import {
    Component,
    Children,
} from 'react';

import { Context } from './index';
import { Store, SideEffects } from './types';
import { contextShape } from './Context';
import { assert } from './util';

export type ProviderProps = {
    store: Store,
    sideEffects: SideEffects,
    context?: string,
    onUnmount?(): void,
};

export type ProviderContext = {
    retrofix: Context,
};

export default class Provider extends Component<ProviderProps, ProviderContext> {
    private _retrofix: Context;
    private get isRoot() { return this.props.context == null; }
    private get retrofix() { return this.isRoot ? this._retrofix : this.context.retrofix; }
    componentWillMount() {
        if (this.isRoot) {
            this._retrofix = new Context(this);
            assert(this.context.retrofix, '같은 하늘 아래 두 개의 태양은 있을 수 없습니다.');
        } else {
            assert(!this.context.retrofix, 'local Provider는 root Provider의 자손이어야 합니다.');
        }
        const { retrofix } = this;
        assert(retrofix.has(this), `이미 '${ this.props.context }'로 연결된 다른 Provider가 있습니다.`);
        retrofix.mount(this);
    }
    componentWillUnmount() {
        this.retrofix.unmount(this);
        this.props.onUnmount && this.props.onUnmount();
    }
    componentWillReceiveProps(nextProps: ProviderProps) {
        assert(
            (this.props.store !== nextProps.store) ||
            (this.props.sideEffects !== nextProps.sideEffects) ||
            (this.props.context !== nextProps.context),
            'Provider가 받는 props는 변하지 않아야 합니다.'
        );
    }
    getChildContext(): ProviderContext {
        return { retrofix: this.retrofix };
    }
    render() {
        return Children.only(this.props.children);
    }
    static contextTypes = { retrofix: contextShape };
    static childContextTypes = { retrofix: contextShape };
}
