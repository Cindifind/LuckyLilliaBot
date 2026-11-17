import { ProtoMessage } from '@saltify/typeproto';
export declare namespace Action {
    const SendLongMsgReq: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            peer: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }>, false, false>;
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            payload: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, false>;
        readonly settings: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, false>;
    }>;
    const SendLongMsgResp: ProtoMessage<{
        readonly result: import("@saltify/typeproto").ProtoSpec<{
            resId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
        readonly settings: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, false>;
    }>;
    const PullPicsReq: ProtoMessage<{
        readonly uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly word: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly word2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly field8: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field9: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field14: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const PullPicsResp: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, true>;
    }>;
    const RecvLongMsgReq: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            peer: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly uid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }>, false, false>;
            resId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            acquire: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, false, false>;
        readonly settings: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, false>;
    }>;
    const RecvLongMsgResp: ProtoMessage<{
        readonly result: import("@saltify/typeproto").ProtoSpec<{
            resId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            payload: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, false>;
        readonly settings: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, false>;
    }>;
    const FetchUserLoginDaysReq: ProtoMessage<{
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly json: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const FetchUserLoginDaysResp: ProtoMessage<{
        readonly json: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** trpc.msg.register_proxy.RegisterProxy.SsoGetGroupMsg */
    const SsoGetGroupMsgReq: ProtoMessage<{
        readonly groupInfo: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            startSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            endSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly filter: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const SsoGetGroupMsgResp: ProtoMessage<{
        readonly retcode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly errorMsg: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            startSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            endSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            messages: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
        }, false, false>;
    }>;
    /** trpc.msg.register_proxy.RegisterProxy.SsoGetC2CMsg */
    const SsoGetC2CMsgReq: ProtoMessage<{
        readonly peerUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly startSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly endSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const SsoGetC2CMsgResp: ProtoMessage<{
        readonly retcode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly errorMsg: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly messages: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
    }>;
    /** trpc.msg.register_proxy.RegisterProxy.SsoGetRoamMsg, 按时间拉 */
    const SsoGetRoamMsgReq: ProtoMessage<{
        readonly peerUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly count: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly direction: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const SsoGetRoamMsgResp: ProtoMessage<{
        readonly peerUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly isComplete: import("@saltify/typeproto").ProtoSpec<"bool", true, false>;
        readonly timestamp: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly random: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly messages: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
    }>;
    /** trpc.msg.msg_svc.MsgService.SsoGroupRecallMsg */
    const SsoGroupRecallMsgReq: ProtoMessage<{
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            sequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** trpc.msg.msg_svc.MsgService.SsoC2CRecallMsg */
    const SsoC2CRecallMsgReq: ProtoMessage<{
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly info: import("@saltify/typeproto").ProtoSpec<{
            /** PbSendMsg 时的 clientSequence */
            clientSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            /** (0x01000000<<32) | random */
            messageUid: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            /** PbSendMsgResp.sendTime */
            timestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            /** PbSendMsgResp.c2cMsgSeq */
            c2cMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly field5: import("@saltify/typeproto").ProtoSpec<{
            field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** trpc.qq_new_tech.status_svc.StatusService.SetStatus */
    const SetStatusReq: ProtoMessage<{
        readonly status: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly extStatus: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly batteryStatus: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly customExt: import("@saltify/typeproto").ProtoSpec<{
            faceId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            text: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
    }>;
    const SetStatusResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly message: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const GetAlbumListReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly groupCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly albumId: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }>, false, false>;
        readonly sessionId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly headers: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly value: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }>, false, true>;
    }>;
    const GetAlbumListResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            albums: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly albumId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly owner: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly desc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly createTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly modifyTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly lastUploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly uploadNumber: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly cover: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly image: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                        readonly lloc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        readonly photoUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                            readonly spec: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            readonly url: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                                readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            }>, false, false>;
                        }>, false, true>;
                        readonly defaultUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                            readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }>, true, false>;
                    }>, true, false>;
                }>, true, false>;
                readonly creator: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly nick: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly uin: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }>, true, false>;
            }>, false, true>;
        }, true, false>;
    }>;
    /** QunAlbum.trpc.qzone.webapp_qun_media.QunMedia.AddAlbum */
    const AddAlbumReq: ProtoMessage<{
        readonly requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            info: import("@saltify/typeproto").ProtoSpec<{
                groupCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                desc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
        readonly sessionId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly headers: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly value: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }>, false, true>;
    }>;
    const AddAlbumResp: ProtoMessage<{
        readonly requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            info: import("@saltify/typeproto").ProtoSpec<{
                albumId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                groupCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                desc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
        }, true, false>;
    }>;
    /** QunAlbum.trpc.qzone.webapp_qun_media.QunMedia.DeleteAlbum */
    const DeleteAlbumReq: ProtoMessage<{
        readonly requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            albumId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
        readonly sessionId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly headers: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly value: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }>, false, true>;
    }>;
    const DeleteAlbumResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** QunAlbum.trpc.qzone.webapp_qun_media.QunMedia.GetMediaList */
    const GetMediaListReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            albumId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            attachInfo: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
        readonly sessionId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly headers: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly value: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }>, false, true>;
    }>;
    const GetMediaListResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            album: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly albumId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly owner: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly desc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly createTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly modifyTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly lastUploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly uploadNumber: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly cover: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly image: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                        readonly lloc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        readonly photoUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                            readonly spec: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            readonly url: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                                readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            }>, false, false>;
                        }>, false, true>;
                        readonly defaultUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                            readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }>, true, false>;
                    }>, true, false>;
                }>, true, false>;
                readonly creator: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly nick: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly uin: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }>, true, false>;
            }>, true, false>;
            mediaList: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly image: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly lloc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly photoUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                        readonly spec: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        readonly url: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                            readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }>, false, false>;
                    }>, false, true>;
                    readonly defaultUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                        readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }>, true, false>;
                }>, true, false>;
                readonly video: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly id: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly cover: import("@saltify/typeproto").ProtoSpec<{
                        lloc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        photoUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                            readonly spec: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            readonly url: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                                readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            }>, false, false>;
                        }>, false, true>;
                        defaultUrl: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                            readonly url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }>, true, false>;
                    }, false, false>;
                    readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly videoTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly videoUrl: import("@saltify/typeproto").ProtoSpec<{
                        spec: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        url: import("@saltify/typeproto").ProtoSpec<{
                            url: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, false, false>;
                    }, false, true>;
                }>, true, false>;
                readonly desc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly uploader: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly batchId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly uploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly like: import("@saltify/typeproto").ProtoSpec<{
                    key: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, true, false>;
            }>, false, true>;
            nextAttachInfo: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            nextHasMore: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, true, false>;
    }>;
    /** trpc.msg.msg_svc.MsgService.SsoGetPeerSeq, 只支持私聊 */
    const SsoGetPeerSeqReq: ProtoMessage<{
        readonly peerUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const SsoGetPeerSeqResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        /** c2cMsgSeq, 通常等于 seq2 */
        readonly seq1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        /** 偶尔比 seq1 大 1 */
        readonly seq2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly latestMsgTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** trpc.msg.msg_svc.MsgService.SsoReadedReport */
    const SsoReadedReportReq: ProtoMessage<{
        readonly group: import("@saltify/typeproto").ProtoSpec<{
            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            startSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
        readonly c2c: import("@saltify/typeproto").ProtoSpec<{
            targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            startSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
    }>;
    const SsoReadedReportResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly retMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
}
