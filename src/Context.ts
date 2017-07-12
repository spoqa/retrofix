import { Provider } from './index';
import { Store, SideEffects } from './types';

export type ContextItem = { store: Store, sideEffects: SideEffects };

export type ContextItems = {
    [contextKey: string]: ContextItem,
};

export function contextShape(props: any, propName: string): null | Error {
    return props[propName] instanceof Context ? null : new Error();
}

export default class Context {
    private rootContextItem: ContextItem;
    constructor(
        public rootProvider: Provider,
        private items: ContextItems = {},
    ) {
        const { store, sideEffects } = this.rootProvider.props;
        this.rootContextItem = { store, sideEffects };
    }
    get(contextKey?: string): ContextItem {
        const contextItem = contextKey ?
            this.items[contextKey] :
            this.rootContextItem;
        if (!contextItem) throw new Error();
        return contextItem;
    }
    has(provider: Provider): boolean {
        const { context } = provider.props;
        return !!(context && this.items[context]);
    }
    mount(provider: Provider): void {
        const { store, sideEffects, context } = provider.props;
        if (!context) return;
        this.items[context] = { store, sideEffects };
    }
    unmount(provider: Provider): void {
        const { context } = provider.props;
        context && delete this.items[context];
    }
}
