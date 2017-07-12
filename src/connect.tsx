import React, { Component, ComponentType } from 'react';
import * as hoistStatics from 'hoist-non-react-statics';

import { Context } from './index';
import { SideEffects } from './types';
import { ContextItem, contextShape } from './Context';

export type GetState = Function;
export type Dispatch = Function;

export type Materials<TOwnProps> = {
    ownProps: TOwnProps,
    getState: GetState,
    dispatch: Dispatch,
    sideEffects: SideEffects,
};

export type ConnectContext = {
    retrofix: Context,
};

let hotReloadingVersion = 0;
const noop = () => {};

export default function connect<TOwnProps, TContainerProps>(
    mapMaterialsToProps: (materials: Materials<TOwnProps>) => TContainerProps,
    contextKey?: string,
): Function {
    type ContainerType = ComponentType<TContainerProps>;
    const version = ++hotReloadingVersion;
    return (Container: ContainerType) => {
        class Connect extends Component<TOwnProps, {}> {
            retrofix: ContextItem;
            ref: ContainerType | null;
            unsubscribe: Function;
            update: Function;
            version: number;
            componentWillMount() {
                this.retrofix = this.context.retrofix.get(contextKey);
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
                const { store, sideEffects } = this.retrofix;
                const { getState, dispatch } = store;
                const props: any = mapMaterialsToProps({
                    ownProps,
                    getState,
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
