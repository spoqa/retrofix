export interface Store {
    subscribe: Function;
    dispatch: Function;
    getState: Function;
}

export interface SideEffects {
    [sideEffectName: string]: Function;
}
