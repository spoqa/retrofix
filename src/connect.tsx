import * as React from 'react';
import { Component, ComponentType } from 'react';
import * as hoistStatics from 'hoist-non-react-statics';

import { SideEffects } from './types';
import { ContextItem, contextShape } from './Context';
import { shallowEqual } from './util';

export interface Action {
    type: any;
}

export type Dispatch<TAction extends Action> = (a: TAction) => TAction;

export type GetSelectedState<TSelectedState> = () => TSelectedState;

export interface Materials<TAction extends Action, TOwnProps, TSelectedState> {
    ownProps: TOwnProps;
    getSelectedState: GetSelectedState<TSelectedState>;
    dispatch: Dispatch<TAction>;
    sideEffects: SideEffects;
}

export interface ConnectOptions<TOwnProps, TSelectedState> {
    context?: string;
    ownPropsEqual: (props: TOwnProps, nextProps: TOwnProps) => boolean;
    selectedStateEqual: (state: TSelectedState, nextState: TSelectedState) => boolean;
}

let hotReloadingVersion = 0;
const noop = () => {};

export default function connect<TState, TAction extends Action, TOwnProps, TSelectedState, TContainerProps>(
    stateSelector: (state: TState) => TSelectedState,
    mapMaterialsToProps: (materials: Materials<TAction, TOwnProps, TSelectedState>) => TContainerProps,
    options?: Partial<ConnectOptions<TOwnProps, TSelectedState>>,
): (Container: ComponentType<any>) => ComponentType<TOwnProps> {
    type ContainerType = ComponentType<TContainerProps>;
    const version = ++hotReloadingVersion;
    const {
        context,
        ownPropsEqual,
        selectedStateEqual,
    }: ConnectOptions<TOwnProps, TSelectedState> = {
        ownPropsEqual: shallowEqual,
        selectedStateEqual: shallowEqual,
        ...options,
    };
    return (Container: ContainerType) => {
        class Connect extends Component<TOwnProps, TSelectedState> {
            retrofix: ContextItem;
            getSelectedState: GetSelectedState<TSelectedState>;
            ref: ContainerType | null;
            update: Function;
            unsubscribe: Function;
            version: number;
            componentWillMount() {
                this.retrofix = this.context.retrofix.get(context);
                this.ref = null;
                this.version = version;
                this.setState(stateSelector(this.retrofix.store.getState()));
                this.getSelectedState = () => this.state;
            }
            componentDidMount() {
                this.update = () => this.setState(stateSelector(this.retrofix.store.getState()));
                this.unsubscribe = this.retrofix.store.subscribe(() => this.update());
            }
            componentWillUnmount() {
                this.update = noop;
                this.unsubscribe();
            }
            shouldComponentUpdate(nextProps: TOwnProps, nextState: TSelectedState) {
                if (ownPropsEqual(this.props, nextProps) &&
                    selectedStateEqual(this.state, nextState)) return false;
                return true;
            }
            render() {
                const { props: ownProps, getSelectedState } = this;
                const { store: { dispatch }, sideEffects } = this.retrofix;
                const props: any = mapMaterialsToProps({
                    ownProps,
                    getSelectedState,
                    dispatch: dispatch as Dispatch<TAction>,
                    sideEffects,
                });
                props.ref = (ref: ContainerType) => this.ref = ref;
                return <Container { ...props }/>;
            }
            static contextTypes = { retrofix: contextShape };
        }
        if (process.env.NODE_ENV !== 'production') {
            // hot reloading
            Connect.prototype.componentWillUpdate = function componentWillUpdate() {
                if (this.version !== version) {
                    this.version = version;
                    this.unsubscribe();
                    this.retrofix = this.context.retrofix.get(context);
                    this.unsubscribe = this.retrofix.store.subscribe(() => this.update());
                }
            };
        }
        return hoistStatics(Connect, Container);
    };
}
