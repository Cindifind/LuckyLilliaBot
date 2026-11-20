import { QQProtocolBase } from './base';
import { NativeQQProtocol } from './nativeQQ';
import { DirectQQProtocol } from './direct';
import { FriendMixin, GroupMixin, MediaMixin, MessageMixin, SystemMixin, UserMixin } from './mixins';
export type { PBData, NativeQQResSendPB, NativeQQResRecvPB, NativeQQReqSendPB, NativeQQRes, NativeQQReq, ResListener, QQResourceUsage, } from './types';
export { QQProtocolBase } from './base';
export { NativeQQProtocol } from './nativeQQ';
export { DirectQQProtocol } from './direct';
type Constructor<T = object> = abstract new (...args: any[]) => T;
type Mixin<TBase extends Constructor> = (Base: TBase) => Constructor;
type MixinInstance<T> = T extends (Base: any) => infer R ? R extends Constructor<infer I> ? I : never : never;
type MergeMixins<TBase, TMixins extends readonly Mixin<any>[]> = TMixins extends readonly [
    infer First extends Mixin<any>,
    ...infer Rest extends readonly Mixin<any>[]
] ? MergeMixins<TBase & MixinInstance<First>, Rest> : TBase;
declare const mixins: readonly [typeof GroupMixin, typeof FriendMixin, typeof MediaMixin, typeof MessageMixin, typeof UserMixin, typeof SystemMixin];
export declare const DirectQQProtocolClient: new (ctx: import("cordis").Context, loginOptions?: {
    autoLoginUin?: string;
} | undefined) => DirectQQProtocol & QQProtocolBase & import("./mixins/group").GroupMixinMethods & import("./mixins/friend").FriendMixinMethods & import("./mixins/media").MediaMixinMethods & import("./mixins/message").MessageMixinMethods & import("./mixins/user").UserMixinMethods & import("./mixins/system").SystemMixinMethods;
export declare const NativeQQProtocolClient: new (ctx: import("cordis").Context, loginOptions?: {
    autoLoginUin?: string;
} | undefined) => NativeQQProtocol & QQProtocolBase & import("./mixins/group").GroupMixinMethods & import("./mixins/friend").FriendMixinMethods & import("./mixins/media").MediaMixinMethods & import("./mixins/message").MessageMixinMethods & import("./mixins/user").UserMixinMethods & import("./mixins/system").SystemMixinMethods;
export type QQProtocolInstance = MergeMixins<QQProtocolBase, typeof mixins>;
declare module 'cordis' {
    interface Context {
        qqProtocol: QQProtocolInstance;
    }
}
