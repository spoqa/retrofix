declare module 'hoist-non-react-statics' {
    function hoistStatics<T, U>(targetComponent: T, sourceComponent: U): T;
    namespace hoistStatics { }
    export = hoistStatics;
}
