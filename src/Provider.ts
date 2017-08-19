import {
    Component,
    Children,
} from 'react';

import { Context } from './index';
import { Store, SideEffects } from './types';
import { contextShape } from './Context';

export type ProviderProps = {
    store: Store,
    sideEffects: SideEffects,
    context?: string,
    onUnmount?(): void,
};

export type ProviderContext = {
    retrofixContext: Context,
};

export default class Provider extends Component<ProviderProps, ProviderContext> {
    private retrofixContext: Context;
    private get isRoot(): boolean { return this.props.context == null; }
    private get contextKey(): string { return this.props.context || ''; }
    private get parentRetrofixContext(): Context | undefined { return this.context.retrofixContext; }
    componentWillMount() {
        const { contextKey } = this;
        const contextItem = {
            store: this.props.store,
            sideEffects: this.props.sideEffects,
        };
        if (this.isRoot) {
            if (process.env.NODE_ENV !== 'production') {
                const { parentRetrofixContext } = this;
                if (parentRetrofixContext) {
                    throw new Error('같은 하늘 아래 두 개의 태양은 있을 수 없습니다.');
                }
            }
            this.retrofixContext = Context.createRootContext(contextItem);
        } else {
            const { parentRetrofixContext } = this;
            if (process.env.NODE_ENV !== 'production') {
                if (parentRetrofixContext) {
                    if (parentRetrofixContext.has(contextKey)) {
                        throw new Error(`부모 노드 중에 '${ this.props.context }'로 연결된 다른 Provider가 있습니다.`);
                    }
                } else {
                    throw new Error('local Provider는 root Provider의 자손 노드여야 합니다.');
                }
            }
            this.retrofixContext = Context.createLocalContext(
                parentRetrofixContext!,
                contextKey,
                contextItem,
            );
        }
    }
    componentWillUnmount() {
        this.props.onUnmount && this.props.onUnmount();
    }
    getChildContext(): ProviderContext {
        return { retrofixContext: this.retrofixContext };
    }
    render() {
        return Children.only(this.props.children);
    }
    static contextTypes = { retrofixContext: contextShape };
    static childContextTypes = { retrofixContext: contextShape };
}

if (process.env.NODE_ENV !== 'production') {
    Provider.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps: ProviderProps) {
        if (
            (this.props.store !== nextProps.store) ||
            (this.props.sideEffects !== nextProps.sideEffects) ||
            (this.props.context !== nextProps.context)
        ) {
            throw new Error('Provider가 받는 props는 변하지 않아야 합니다.');
        }
    };
}
