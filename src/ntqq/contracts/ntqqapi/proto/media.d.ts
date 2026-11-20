import { ProtoMessage } from '@saltify/typeproto';
export declare namespace Media {
    const FileInfo: ProtoMessage<{
        readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly md5HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly sha1HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly fileType: import("@saltify/typeproto").ProtoSpec<{
            type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            picFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            videoFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pttFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const IndexNode: ProtoMessage<{
        readonly info: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly md5HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly sha1HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly fileType: import("@saltify/typeproto").ProtoSpec<{
                type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                picFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                videoFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                pttFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, false>;
        readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly storeID: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly uploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly expire: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const ExtBizInfo: ProtoMessage<{
        readonly pic: import("@saltify/typeproto").ProtoSpec<{
            bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            summary: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            bytesPbReserveC2c: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            bytesPbReserveTroop: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            fromScene: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            toScene: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            oldFileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly video: import("@saltify/typeproto").ProtoSpec<{
            fromScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            toScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, false>;
        readonly ptt: import("@saltify/typeproto").ProtoSpec<{
            srcUin: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
            pttScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            pttType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            changeVoice: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            waveform: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            autoConvertText: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            bytesReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            bytesPbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            bytesGeneralFlags: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        }, true, false>;
        readonly busiType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const NTV2RichMediaReq: ProtoMessage<{
        readonly reqHead: import("@saltify/typeproto").ProtoSpec<{
            common: import("@saltify/typeproto").ProtoSpec<{
                requestId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                command: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            scene: import("@saltify/typeproto").ProtoSpec<{
                requestType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field103: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                sceneType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                c2c: import("@saltify/typeproto").ProtoSpec<{
                    accountType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    tmpInfo: import("@saltify/typeproto").ProtoSpec<{
                        body: import("@saltify/typeproto").ProtoSpec<{
                            groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            targetUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        }, false, false>;
                    }, true, false>;
                }, false, false>;
                group: import("@saltify/typeproto").ProtoSpec<{
                    groupId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
            }, false, false>;
            client: import("@saltify/typeproto").ProtoSpec<{
                agentType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
        }, false, false>;
        readonly upload: import("@saltify/typeproto").ProtoSpec<{
            uploadInfo: import("@saltify/typeproto").ProtoSpec<{
                fileInfo: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly md5HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly sha1HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileType: import("@saltify/typeproto").ProtoSpec<{
                        type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        picFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        videoFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pttFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }>, false, false>;
                subFileType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, true>;
            tryFastUploadCompleted: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            srvSendMsg: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            clientRandomId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            compatQMsgSceneType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            extBizInfo: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly pic: import("@saltify/typeproto").ProtoSpec<{
                    bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    summary: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    bytesPbReserveC2c: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    bytesPbReserveTroop: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    fromScene: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    toScene: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    oldFileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, false>;
                readonly video: import("@saltify/typeproto").ProtoSpec<{
                    fromScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    toScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                }, false, false>;
                readonly ptt: import("@saltify/typeproto").ProtoSpec<{
                    srcUin: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                    pttScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    pttType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    changeVoice: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    waveform: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    autoConvertText: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    bytesReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    bytesPbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    bytesGeneralFlags: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                }, true, false>;
                readonly busiType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }>, false, false>;
            clientSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            noNeedCompatMsg: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
        }, true, false>;
        readonly download: import("@saltify/typeproto").ProtoSpec<{
            node: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly info: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly md5HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly sha1HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileType: import("@saltify/typeproto").ProtoSpec<{
                        type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        picFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        videoFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pttFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }>, false, false>;
                readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly storeID: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly uploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly expire: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }>, false, false>;
        }, true, false>;
        readonly uploadCompleted: import("@saltify/typeproto").ProtoSpec<{
            srvSendMsg: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            clientRandomId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            msgInfo: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            clientSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
    }>;
    const MsgInfo: ProtoMessage<{
        readonly msgInfoBody: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly index: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly info: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly md5HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly sha1HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileType: import("@saltify/typeproto").ProtoSpec<{
                        type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        picFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        videoFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pttFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }>, false, false>;
                readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly storeID: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly uploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly expire: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }>, false, false>;
            readonly pic: import("@saltify/typeproto").ProtoSpec<{
                urlPath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                ext: import("@saltify/typeproto").ProtoSpec<{
                    originalParam: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    bigParam: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    thumbParam: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, false, false>;
                domain: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
            readonly video: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            readonly audio: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            readonly fileExist: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            readonly hashSum: import("@saltify/typeproto").ProtoSpec<{
                bytesPbReserveC2c: import("@saltify/typeproto").ProtoSpec<{
                    friendUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, true, false>;
                troopSource: import("@saltify/typeproto").ProtoSpec<{
                    groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
            }, false, false>;
        }>, false, true>;
        readonly extBizInfo: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly pic: import("@saltify/typeproto").ProtoSpec<{
                bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                summary: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                bytesPbReserveC2c: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                bytesPbReserveTroop: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                fromScene: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                toScene: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                oldFileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            readonly video: import("@saltify/typeproto").ProtoSpec<{
                fromScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                toScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, false, false>;
            readonly ptt: import("@saltify/typeproto").ProtoSpec<{
                srcUin: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                pttScene: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                pttType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                changeVoice: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                waveform: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                autoConvertText: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                bytesReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                bytesPbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                bytesGeneralFlags: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            }, true, false>;
            readonly busiType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, false>;
    }>;
    const FileIdInfo: ProtoMessage<{
        readonly sha1: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly size: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly appid: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly expire: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const NTV2RichMediaResp: ProtoMessage<{
        readonly upload: import("@saltify/typeproto").ProtoSpec<{
            uKey: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            uKeyTtlSecond: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            ipv4s: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly outIP: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly outPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly inIP: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly inPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly ipType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }>, false, true>;
            ipv6s: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly outIP: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                readonly outPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly inIP: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                readonly inPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly ipType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }>, false, true>;
            msgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            msgInfo: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            ext: import("@saltify/typeproto").ProtoSpec<{
                subType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                extType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                extValue: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, false, true>;
            compatQMsg: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            subFileInfos: import("@saltify/typeproto").ProtoSpec<{
                subType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                uKey: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                uKeyTtlSecond: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                ipv4s: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly outIP: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly outPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly inIP: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly inPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly ipType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }>, false, true>;
                ipv6s: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly outIP: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    readonly outPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly inIP: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    readonly inPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly ipType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }>, false, true>;
            }, false, true>;
        }, true, false>;
        readonly download: import("@saltify/typeproto").ProtoSpec<{
            rKeyParam: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            rKeyTtlSecond: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            info: import("@saltify/typeproto").ProtoSpec<{
                domain: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                urlPath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                httpsPort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            rKeyCreateTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
    }>;
    const HighwaySessionReq: ProtoMessage<{
        readonly reqBody: import("@saltify/typeproto").ProtoSpec<{
            uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            idcId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            appid: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            loginSigType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            loginSigTicket: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            requestFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            serviceTypes: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
            bid: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field9: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            field10: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            field11: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            version: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    const HighwaySessionResp: ProtoMessage<{
        readonly rspBody: import("@saltify/typeproto").ProtoSpec<{
            sigSession: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            sessionKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            addrs: import("@saltify/typeproto").ProtoSpec<{
                serviceType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                addrs: import("@saltify/typeproto").ProtoSpec<{
                    type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    ip: import("@saltify/typeproto").ProtoSpec<"fixed32", false, false>;
                    port: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    area: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, true>;
            }, false, true>;
        }, false, false>;
    }>;
    const ReqDataHighwayHead: ProtoMessage<{
        readonly msgBaseHead: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly version: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly uin: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            readonly command: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            readonly seq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly retryTimes: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly dataFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly commandId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly buildVer: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        }>, false, false>;
        readonly msgSegHead: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly serviceId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly filesize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly dataOffset: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly dataLength: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            readonly serviceTicket: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            readonly md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            readonly fileMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            readonly cacheAddr: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly cachePort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, false>;
        readonly bytesReqExtendInfo: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly timestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly msgLoginSigHead: import("@saltify/typeproto").ProtoSpec<{
            uint32LoginSigType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            bytesLoginSig: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    const RespDataHighwayHead: ProtoMessage<{
        readonly msgBaseHead: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly version: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly uin: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            readonly command: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            readonly seq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly retryTimes: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly dataFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly commandId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly buildVer: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        }>, false, false>;
        readonly msgSegHead: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly serviceId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly filesize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly dataOffset: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly dataLength: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            readonly serviceTicket: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            readonly md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            readonly fileMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            readonly cacheAddr: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            readonly cachePort: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, true, false>;
        readonly errorCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly allowRetry: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly cacheCost: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly htCost: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly bytesRspExtendInfo: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        readonly timestamp: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly range: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly isReset: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const NTHighwayIPv4: ProtoMessage<{
        readonly domain: import("@saltify/typeproto").ProtoSpec<{
            isEnable: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            ip: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
        readonly port: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const NTHighwayNetwork: ProtoMessage<{
        readonly ipv4s: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly domain: import("@saltify/typeproto").ProtoSpec<{
                isEnable: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                ip: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
            readonly port: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }>, false, true>;
    }>;
    const NTV2RichMediaHighwayExt: ProtoMessage<{
        readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly uKey: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly network: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly ipv4s: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly domain: import("@saltify/typeproto").ProtoSpec<{
                    isEnable: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                    ip: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, false, false>;
                readonly port: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }>, false, true>;
        }>, false, false>;
        readonly msgInfoBody: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly index: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly info: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly md5HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly sha1HexStr: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    readonly fileType: import("@saltify/typeproto").ProtoSpec<{
                        type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        picFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        videoFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pttFormat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, false, false>;
                    readonly width: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly height: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly time: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    readonly original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }>, false, false>;
                readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                readonly storeID: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly uploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly expire: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }>, false, false>;
            readonly pic: import("@saltify/typeproto").ProtoSpec<{
                urlPath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                ext: import("@saltify/typeproto").ProtoSpec<{
                    originalParam: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    bigParam: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    thumbParam: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, false, false>;
                domain: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
            readonly video: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            readonly audio: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            readonly fileExist: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            readonly hashSum: import("@saltify/typeproto").ProtoSpec<{
                bytesPbReserveC2c: import("@saltify/typeproto").ProtoSpec<{
                    friendUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, true, false>;
                troopSource: import("@saltify/typeproto").ProtoSpec<{
                    groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
            }, false, false>;
        }>, false, true>;
        readonly blockSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly hash: import("@saltify/typeproto").ProtoSpec<{
            fileSha1: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
        }, false, false>;
    }>;
    const FlashTransferSha1StateV: ProtoMessage<{
        readonly state: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
    }>;
    const FlashTransferUploadReq: ProtoMessage<{
        readonly fieId1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly fileId3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            fieId1: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            uKey: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            start: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            end: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            sha1: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            sha1StateV: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                readonly state: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
            }>, false, false>;
            body: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, false, false>;
    }>;
    const FlashTransferUploadResp: ProtoMessage<{
        readonly status: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const FileUploadExt: ProtoMessage<{
        readonly unknown1: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly unknown2: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly unknown3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly entry: import("@saltify/typeproto").ProtoSpec<{
            busiBuff: import("@saltify/typeproto").ProtoSpec<{
                busId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                receiverUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            fileEntry: import("@saltify/typeproto").ProtoSpec<{
                fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                checkKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                md510M: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                sha3: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                uploadKey: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, false, false>;
            clientInfo: import("@saltify/typeproto").ProtoSpec<{
                clientType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                appId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                terminalType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                clientVer: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                unknown: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            }, false, false>;
            fileNameInfo: import("@saltify/typeproto").ProtoSpec<{
                fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
            host: import("@saltify/typeproto").ProtoSpec<{
                hosts: import("@saltify/typeproto").ProtoSpec<{
                    url: import("@saltify/typeproto").ProtoSpec<{
                        unknown: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        host: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    }, false, false>;
                    port: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, false, true>;
            }, false, false>;
        }, false, false>;
        readonly unknown200: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
    }>;
    /** PicUp.DataUp, cmd=3000 */
    const GroupAvatarExtra: ProtoMessage<{
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly groupUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field3: import("@saltify/typeproto").ProtoSpec<{
            field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
}
