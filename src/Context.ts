import { Store, SideEffects } from './types';

export interface ContextItem {
    store: Store;
    sideEffects: SideEffects;
}

export interface ContextItems {
    [contextKey: string]: ContextItem;
}

export function contextShape(props: any, propName: string): null | Error {
    return props[propName] ?
        (props[propName] instanceof Context ? null : new Error()) :
        null;
}

export default class Context {
    constructor(
        private contextKeyList: string[],
        private contextItemList: ContextItem[],
    ) { }
    get(contextKey: string = ''): ContextItem {
        const contextItemIndex = this.contextKeyList.indexOf(contextKey);
        if (contextItemIndex === -1) throw new Error();
        return this.contextItemList[contextItemIndex];
    }
    has(contextKey: string = ''): boolean {
        const contextItemIndex = this.contextKeyList.indexOf(contextKey);
        return contextItemIndex !== -1;
    }
    static createRootContext(rootContextItem: ContextItem): Context {
        return new Context(
            [''],
            [rootContextItem]
        );
    }
    static createLocalContext(
        parentContext: Context,
        contextKey: string,
        contextItem: ContextItem,
    ): Context {
        return new Context(
            parentContext.contextKeyList.concat(contextKey),
            parentContext.contextItemList.concat(contextItem),
        );
    }
}
