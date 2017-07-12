export type Store = {
    subscribe: Function,
    dispatch: Function,
    getState: Function,
};

export type SideEffects = { [sideEffectName: string]: Function };
