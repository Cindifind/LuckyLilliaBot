/** Type-only service contracts. Runtime consumers use injected services, never construct these implementations. */
export type { default as Core } from './ntqqapi/core';
export type { default as Store, MsgInfo } from './store';
export type { QQProtocolInstance, QQProtocolBase } from './qqProtocol';
export type { NTFileApi, NTFriendApi, NTGroupApi, NTLoginApi, NTMsgApi, NTSystemApi, NTUserApi, NTWebApi } from './ntqqapi/api';
export type * from './types';
export type { Config as BotConfig, OB11Config, MilkyConfig } from './support/types';
export type { OneBotActions } from './onebot/service';
