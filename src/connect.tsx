import React, { Component, ComponentType } from 'react';
import * as hoistStatics from 'hoist-non-react-statics';

import { Context } from './index';
import { SideEffects } from './types';
import { ContextItem, contextShape } from './Context';
import { shallowEqual } from './util';

export type State = Object;
export type GetSelectedState<TSelectedState> = () => TSelectedState;
export type Dispatch = Function;

export type Materials<TOwnProps, TSelectedState> = {
    ownProps: TOwnProps,
    getSelectedState: GetSelectedState<TSelectedState>,
    dispatch: Dispatch,
    sideEffects: SideEffects,
};

export type ConnectContext = {
    retrofix: Context,
};

let hotReloadingVersion = 0;
const noop = () => {};

export default function connect<TOwnProps, TSelectedState, TContainerProps>(
    stateSelector: (state: State) => TSelectedState,
    mapMaterialsToProps: (materials: Materials<TOwnProps, TSelectedState>) => TContainerProps,
    contextKey?: string,
): Function {
    type ContainerType = ComponentType<TContainerProps>;
    const version = ++hotReloadingVersion;
    return (Container: ContainerType) => {
        class Connect extends Component<TOwnProps, TSelectedState> {
            retrofix: ContextItem;
            getSelectedState: GetSelectedState<TSelectedState>;
            ref: ContainerType | null;
            update: Function;
            unsubscribe: Function;
            version: number;
            componentWillMount() {
                this.retrofix = this.context.retrofix.get(contextKey);
                this.ref = null;
                this.version = version;
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
                if (shallowEqual(this.props, nextProps) &&
                    shallowEqual(this.state, nextState)) return false;
                return true;
            }
            render() {
                const { props: ownProps, getSelectedState } = this;
                const { store: { dispatch }, sideEffects } = this.retrofix;
                const props: any = mapMaterialsToProps({
                    ownProps,
                    getSelectedState,
                    dispatch,
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
                    this.retrofix = this.context.retrofix.get(contextKey);
                    this.unsubscribe = this.retrofix.store.subscribe(() => this.update());
                }
            };
        }
        return hoistStatics(Connect, Container);
    };
}
