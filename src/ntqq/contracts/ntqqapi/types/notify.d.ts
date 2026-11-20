export declare enum FriendReqType {
    MeInitiator = 0,
    PeerInitiator = 1,
    MeAgreed = 2,
    MeAgreedAndAdded = 3,
    PeerAgreed = 4,
    PeerAgreedAndAdded = 5,
    PeerRefused = 6,
    MeRefused = 7,
    MeIgnored = 8,
    MeAgreeAnyone = 9,
    MeSetQuestion = 10,
    MeAgreeAndAddFailed = 11,
    MsgInfo = 12,
    MeInitiatorWaitPeerConfirm = 13
}
export declare enum GroupNotificationType {
    JoinRequest = 1,
    Invitation = 2,
    SetAdmin = 3,
    Kick = 6,
    Quit = 13,
    UnsetAdmin = 16,
    InvitedJoinRequest = 22
}
export declare enum RequestState {
    Init = 0,
    Unhandle = 1,
    Agreed = 2,
    Refused = 3,
    Ignored = 4
}
