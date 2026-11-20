import { Service, Context } from 'cordis';
import { Config as LLOBConfig } from '../support/types';
import { Peer, SendMessageElement, GroupJoinRequestEvent, GroupInvitedJoinRequestEvent, GroupInvitationEvent, MessageDeletedEvent, GroupRemovedEvent, GroupAddedEvent, GroupMemberAddedEvent, GroupDisbandEvent, GroupMemberRemovedEvent, GroupMemberCardNameChangedEvent, FriendRequestEvent, FriendRemovedEvent, FriendAddedEvent, FriendNudgeEvent, GroupNudgeEvent, GroupMemberSpecialTitleChangedEvent, GroupNameChangedEvent, GroupWholeMuteEvent, GroupMuteEvent, GroupAdminChangedEvent, PinChangedEvent, GroupMessageReactionEvent, GroupEssenceMessageChangedEvent, ProfileLikeEvent, PttTransResultEvent, KickedOfflineEvent, MessageCreatedEvent, MessageSentEvent, StatusChangedEvent } from './types';
import { noop } from 'cosmokit';
declare module 'cordis' {
    interface Context {
        app: Core;
    }
    interface Events {
        'qq/raw': (input: {
            cmd: string;
            payload: Buffer;
        }) => void;
        'nt/message-created': (input: MessageCreatedEvent) => void;
        'nt/message-deleted': (input: MessageDeletedEvent) => void;
        'nt/message-sent': (input: MessageSentEvent) => void;
        'nt/group-join-request': (input: GroupJoinRequestEvent) => void;
        'nt/group-invited-join-request': (input: GroupInvitedJoinRequestEvent) => void;
        'nt/group-invitation': (input: GroupInvitationEvent) => void;
        'nt/group-added': (input: GroupAddedEvent) => void;
        'nt/group-removed': (input: GroupRemovedEvent) => void;
        'nt/group-disband': (input: GroupDisbandEvent) => void;
        'nt/group-nudge': (input: GroupNudgeEvent) => void;
        'nt/group-name-changed': (input: GroupNameChangedEvent) => void;
        'nt/group-admin-changed': (input: GroupAdminChangedEvent) => void;
        'nt/group-message-reaction': (input: GroupMessageReactionEvent) => void;
        'nt/group-essence-message-changed': (input: GroupEssenceMessageChangedEvent) => void;
        'nt/group-whole-mute': (input: GroupWholeMuteEvent) => void;
        'nt/group-mute': (input: GroupMuteEvent) => void;
        'nt/group-member-added': (input: GroupMemberAddedEvent) => void;
        'nt/group-member-removed': (input: GroupMemberRemovedEvent) => void;
        'nt/group-member-card-name-changed': (input: GroupMemberCardNameChangedEvent) => void;
        'nt/group-member-special-title-changed': (input: GroupMemberSpecialTitleChangedEvent) => void;
        'nt/friend-request': (input: FriendRequestEvent) => void;
        'nt/friend-added': (input: FriendAddedEvent) => void;
        'nt/friend-removed': (input: FriendRemovedEvent) => void;
        'nt/friend-nudge': (input: FriendNudgeEvent) => void;
        'nt/profile-like': (input: ProfileLikeEvent) => void;
        'nt/pin-changed': (input: PinChangedEvent) => void;
        'nt/ptt-trans-result': (input: PttTransResultEvent) => void;
        'nt/kicked-offline': (input: KickedOfflineEvent) => void;
        'nt/status-changed': (input: StatusChangedEvent) => void;
    }
}
declare class Core extends Service {
    protected ctx: Context;
    config: Core.Config;
    static inject: string[];
    startupTime: number;
    messageReceivedCount: number;
    messageSentCount: number;
    lastMessageTime: number;
    constructor(ctx: Context, config: Core.Config);
    [Service.init](): Promise<typeof noop>;
    start(): void;
    sendMessage(ctx: Context, peer: Peer, sendElements: SendMessageElement[], deleteAfterSentFiles: string[]): Promise<import("./types").RawMessage>;
    private registerListener;
}
declare namespace Core {
    interface Config extends LLOBConfig {
    }
}
export default Core;
