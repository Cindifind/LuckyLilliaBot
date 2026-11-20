import type { QQProtocolBase } from '../base';
export declare function SystemMixin<T extends abstract new (...args: any[]) => QQProtocolBase>(Base: T): T & (abstract new (...args: any[]) => SystemMixinMethods);
/** Public methods contributed by this protocol mixin. */
export interface SystemMixinMethods {
    fetchPins(): Promise<{
        readonly friends: {
            uid: string;
        }[];
        readonly groups: {
            groupCode: number;
        }[];
    }>;
}
