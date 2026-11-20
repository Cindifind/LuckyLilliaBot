import { ProtoMessage } from '@saltify/typeproto';
export declare namespace Notify {
    const GroupMemberChange: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly memberUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly adminUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const GroupAdminChange: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly flag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly isPromote: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            extraDisable: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly adminUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly isPromote: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            }>, true, false>;
            extraEnable: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly adminUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly isPromote: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            }>, true, false>;
        }, false, false>;
    }>;
    const FriendRelatedOrPinChange: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            friendDeleted: import("@saltify/typeproto").ProtoSpec<{
                uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
            pinChanged: import("@saltify/typeproto").ProtoSpec<{
                body: import("@saltify/typeproto").ProtoSpec<{
                    uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    info: import("@saltify/typeproto").ProtoSpec<{
                        timestamp: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, false, false>;
                }, false, false>;
            }, true, false>;
            profileLike: import("@saltify/typeproto").ProtoSpec<{
                msg: import("@saltify/typeproto").ProtoSpec<{
                    count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    detail: import("@saltify/typeproto").ProtoSpec<{
                        txt: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        nickname: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    }, false, false>;
                }, false, false>;
            }, true, false>;
        }, false, false>;
    }>;
    const GroupRecall: ProtoMessage<{
        readonly operatorUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly recallMessages: import("@saltify/typeproto").ProtoSpec<{
            sequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            flag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            authorUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, true>;
        readonly userDef: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly groupType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly opType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly tipInfo: import("@saltify/typeproto").ProtoSpec<{
            tip: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        }, true, false>;
    }>;
    const FriendRecall: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            fromUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            toUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            clientSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            /** C2C 是 (0x01000000 << 32) | random */
            msgUid: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            tipInfo: import("@saltify/typeproto").ProtoSpec<{
                tip: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
            sequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const FriendRequest: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            fromUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            message: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            via: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, true, false>;
    }>;
    const GroupReaction: ProtoMessage<{
        readonly data: import("@saltify/typeproto").ProtoSpec<{
            data: import("@saltify/typeproto").ProtoSpec<{
                target: import("@saltify/typeproto").ProtoSpec<{
                    sequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
                data: import("@saltify/typeproto").ProtoSpec<{
                    code: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    reactionType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    operatorUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    actionType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    const GeneralGrayTip: ProtoMessage<{
        readonly bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly busiId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly ctrlFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly c2cType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly serviceType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly templId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly templParam: import("@saltify/typeproto").ProtoSpec<["string", "string"], false, false>;
        readonly content: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly tipsSeqId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const GroupMute: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly operatorUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            state: import("@saltify/typeproto").ProtoSpec<{
                targetUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                duration: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    const GroupInvitation: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly invitorUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const GroupJoinRequest: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly memberUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const GroupInvitedJoinRequest: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            inner: import("@saltify/typeproto").ProtoSpec<{
                groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                invitorUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    const GroupEssenceChange: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly msgSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly setFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly memberUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly operatorUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly timeStamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly msgSequence2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly operatorNickName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly memberNickName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly setFlag2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** 0x2DC subtype 16 / 17 / 20 的内层, 前面是 [4B groupCode + 1B + 2B 长度] */
    const NotifyMessageBody: ProtoMessage<{
        readonly notifyType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly eventParam: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly recall: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly operatorUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            readonly recallMessages: import("@saltify/typeproto").ProtoSpec<{
                sequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                flag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                authorUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, true>;
            readonly userDef: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            readonly groupType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            readonly opType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            readonly tipInfo: import("@saltify/typeproto").ProtoSpec<{
                tip: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            }, true, false>;
        }>, true, false>;
        readonly subType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly operatorUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly generalGrayTip: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly busiId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly ctrlFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly c2cType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            readonly serviceType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            readonly templId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly templParam: import("@saltify/typeproto").ProtoSpec<["string", "string"], false, false>;
            readonly content: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly tipsSeqId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, true, false>;
        readonly essenceMessage: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly msgSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly setFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly memberUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly operatorUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly timeStamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly msgSequence2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly operatorNickName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly memberNickName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly setFlag2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, true, false>;
        readonly msgSequence: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
        readonly reaction: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly data: import("@saltify/typeproto").ProtoSpec<{
                data: import("@saltify/typeproto").ProtoSpec<{
                    target: import("@saltify/typeproto").ProtoSpec<{
                        sequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    data: import("@saltify/typeproto").ProtoSpec<{
                        code: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        reactionType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        operatorUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        actionType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                }, false, false>;
            }, false, false>;
        }>, true, false>;
    }>;
    /** subType=16 + field13=12 时 NotifyMessageBody.eventParam 的内容; field 1 似乎恒为 1 */
    const GroupNameChangeBody: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly newName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const GroupRemoved: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const GroupJoined: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly adminUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const FriendAdded: ProtoMessage<{
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            friendUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const GroupMemberSpecialTitleChange: ProtoMessage<{
        readonly tipText: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly memberUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
}
