import * as React from 'react';
import { Component, ComponentType } from 'react';
import * as hoistStatics from 'hoist-non-react-statics';

import { ContextItem, contextShape } from '../Context';

export interface Action {
    type: any;
}

export type Dispatch<TAction extends Action> = (a: TAction) => TAction;

export interface MapStateToProps<TStateProps, TOwnProps> {
    (state: any, ownProps?: TOwnProps): TStateProps;
}

export interface MapDispatchToProps<TDispatchProps, TOwnProps> {
    (dispatch: Dispatch<any>, ownProps?: TOwnProps): TDispatchProps;
}

export interface MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps> {
    (stateProps: TStateProps, dispatchProps: TDispatchProps, ownProps?: TOwnProps): TMergedProps;
}

export interface Options {
    context?: string; // retrofix context
    pure?: boolean;
    withRef?: boolean;
}

let hotReloadingVersion = 0;
const noop = () => {};

const defaultMapDispatchToProps = (dispatch: Dispatch<any>) => ({ dispatch });

export default function connect<TStateProps, TDispatchProps, TOwnProps, TMergedProps>(
    mapStateToProps?: MapStateToProps<TStateProps, TOwnProps> | null,
    mapDispatchToProps?: MapDispatchToProps<TDispatchProps, TOwnProps>,
    mergeProps?: MergeProps<TStateProps, TDispatchProps, TOwnProps, TMergedProps>,
    options?: Options,
): (Container: ComponentType<TMergedProps>) => ComponentType<TOwnProps> {
    type ContainerType = ComponentType<TMergedProps>;
    const version = ++hotReloadingVersion;
    const {
        context,
    }: {
        context: string | null,
    } = {
        context: null,
        ...options,
    };
    return (Container: ContainerType) => {
        class Connect extends Component<TOwnProps> {
            retrofix: ContextItem;
            ref: ContainerType | null;
            update: Function;
            unsubscribe: Function;
            version: number;
            getWrappedInstance() {
                return this.ref;
            }
            componentWillMount() {
                this.retrofix = this.context.retrofix.get(context);
                this.ref = null;
                this.version = version;
            }
            componentDidMount() {
                this.update = () => this.setState({});
                this.unsubscribe = this.retrofix.store.subscribe(() => this.update());
            }
            componentWillUnmount() {
                this.update = noop;
                this.unsubscribe();
            }
            render() {
                const { props: ownProps } = this;
                const { store: { getState, dispatch } } = this.retrofix;
                const stateProps =
                    (mapStateToProps && mapStateToProps(getState(), ownProps)) ||
                    null;
                const dispatchProps =
                    (mapDispatchToProps && mapDispatchToProps(dispatch as any, ownProps)) ||
                    defaultMapDispatchToProps(dispatch as any);
                const props: any = mergeProps ?
                    mergeProps(stateProps!, dispatchProps as any, ownProps) :
                    stateProps ? { ...stateProps as any, ...dispatchProps as any } : dispatchProps;
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
