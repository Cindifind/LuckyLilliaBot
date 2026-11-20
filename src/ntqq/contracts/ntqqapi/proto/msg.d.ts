import { ProtoMessage } from '@saltify/typeproto';
export declare namespace Msg {
    const VideoFileMsg: ProtoMessage<{
        readonly fileUuid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly fileMd5: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly fileFormat: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly fileTime: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly thumbWidth: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly thumbHeight: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly thumbFileMd5: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly source: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly thumbFileSize: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly busiType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly fromChatType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly toChatType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly boolSupportProgressive: import("@saltify/typeproto").ProtoSpec<"bool", true, false>;
        readonly fileWidth: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly fileHeight: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly subBusiType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly videoAttr: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly bytesThumbFileUrls: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
        readonly bytesVideoFileUrls: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
        readonly thumbDownloadFlag: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly fileDownloadFlag: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
    }>;
    const Elem: ProtoMessage<{
        readonly text: import("@saltify/typeproto").ProtoSpec<{
            str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            link: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            attr6Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            attr7Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        }, true, false>;
        readonly face: import("@saltify/typeproto").ProtoSpec<{
            index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            old: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        }, true, false>;
        readonly notOnlineImage: import("@saltify/typeproto").ProtoSpec<{
            filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            downloadPath: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            oldVerSendFile: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            imgType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            previewsImage: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            picMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            picHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            picWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            resId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            result: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            opFaceBuf: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            oldPicMd5: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
            thumbWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            thumbHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            showLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            downloadLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            url400: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            width400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            height400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, true, false>;
        readonly transElemInfo: import("@saltify/typeproto").ProtoSpec<{
            elemType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            elemValue: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, true, false>;
        readonly marketFace: import("@saltify/typeproto").ProtoSpec<{
            summary: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            itemType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            info: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            faceId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            tabId: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            subType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            key: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            width: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            height: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        }, true, false>;
        readonly customFace: import("@saltify/typeproto").ProtoSpec<{
            guid: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            shortcut: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            buffer: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            oldData: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            serverIp: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
            serverPort: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
            fileType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            signature: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            useful: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            bizType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            repeatIndex: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            repeatImage: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            imageType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            index: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            source: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            size: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            origin: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            thumbWidth: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
            thumbHeight: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
            showLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            downloadLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            x400Url: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            x400Width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            x400Height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            pbReserve: import("@saltify/typeproto").ProtoSpec<{
                subType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                summary: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field10: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                field21: import("@saltify/typeproto").ProtoSpec<{
                    field1: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    field2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    field5: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    md5Str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, false, false>;
                field31: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
        }, true, false>;
        readonly elemFlags2: import("@saltify/typeproto").ProtoSpec<{
            colorTextId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            msgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            whisperSessionId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pttChangeBit: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            vipStatus: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            compatibleId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            insts: import("@saltify/typeproto").ProtoSpec<{
                appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, true>;
            msgRptCnt: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            srcInst: import("@saltify/typeproto").ProtoSpec<{
                appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, false, false>;
            longtitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            latitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            customFont: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pcSupportDef: import("@saltify/typeproto").ProtoSpec<{
                pcPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                pcPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                macPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                macPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                ptlsSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                ptlsNotSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
            }, false, false>;
            crmFlags: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        }, true, false>;
        readonly richMsg: import("@saltify/typeproto").ProtoSpec<{
            template: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            serviceId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        }, true, false>;
        readonly groupFile: import("@saltify/typeproto").ProtoSpec<{
            filename: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            fileSize: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
            fileId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            batchId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            fileKey: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            sequence: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
        }, true, false>;
        readonly extraInfo: import("@saltify/typeproto").ProtoSpec<{
            nick: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            groupCard: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            level: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            flags: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            groupMask: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            msgTailId: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
            senderTitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            apnsTips: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            uin: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            msgStateFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
            apnsSoundType: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
            newGroupFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
        }, true, false>;
        readonly videoFile: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly generalFlags: import("@saltify/typeproto").ProtoSpec<{
            bubbleDiyTextId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            groupFlagNew: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            uin: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            rpId: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            prpFold: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            longTextFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            longTextResId: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            groupType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            toUinFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            glamourLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            memberLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            groupRankSeq: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
            olympicTorch: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            babyqGuideMsgCookie: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            uin32ExpertFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            bubbleSubId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            pendantId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            rpIndex: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, true, false>;
        readonly srcMsg: import("@saltify/typeproto").ProtoSpec<{
            origSeqs: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
            senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            time: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
            elems: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
            attr: import("@saltify/typeproto").ProtoSpec<{
                oriMsgType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                sourceMsgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                senderUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                receiverUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                ntMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            }, false, false>;
            srcMsg: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            toUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
        readonly lightApp: import("@saltify/typeproto").ProtoSpec<{
            data: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            msgResid: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        }, true, false>;
        readonly commonElem: import("@saltify/typeproto").ProtoSpec<{
            serviceType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pbElem: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
    }>;
    const Message: ProtoMessage<{
        readonly routingHead: import("@saltify/typeproto").ProtoSpec<{
            fromUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fromUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fromAppid: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fromInstid: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            toUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            toUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            c2c: import("@saltify/typeproto").ProtoSpec<{
                c2cType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                serviceType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                sig: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                fromTinyId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                toTinyId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
            group: import("@saltify/typeproto").ProtoSpec<{
                groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupInfoSeq: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                groupCard: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                groupCardType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupLevel: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                extGroupKeyInfo: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                msgFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, true, false>;
        }, false, false>;
        /**
         * OlPush 的消息头, 跟发送时的 SendContentHead 布局不同。群聊 field 5 是所有人一致的群 msgSeq, field 11 为 0;
         * 私聊 field 5 是发送方的 clientSequence (撤回和引用用它), field 11 是双端一致的 c2cMsgSeq
         */
        readonly contentHead: import("@saltify/typeproto").ProtoSpec<{
            msgType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            subType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            c2cCmd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            /** 发送方生成, 两端一致 */
            random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            groupMsgSeqOrC2cClientSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            msgTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pkgNum: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pkgIndex: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            divSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            autoReply: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            c2cMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            /** C2C 可由 (0x01000000 << 32) | random 算出 */
            msgUid: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            /** 拉历史时 server 不填 field 12, 同样的 id 在这里 */
            msgUidAlt: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
            forward: import("@saltify/typeproto").ProtoSpec<{
                field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                field4: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                avatar: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
        }, false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            richText: import("@saltify/typeproto").ProtoSpec<{
                attr: import("@saltify/typeproto").ProtoSpec<{
                    codePage: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    time: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    random: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    color: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    size: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    effect: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    charSet: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    pitchAndFamily: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    fontName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    reserveData: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                }, false, false>;
                elems: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly text: import("@saltify/typeproto").ProtoSpec<{
                        str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        link: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        attr6Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        attr7Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    }, true, false>;
                    readonly face: import("@saltify/typeproto").ProtoSpec<{
                        index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        old: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    }, true, false>;
                    readonly notOnlineImage: import("@saltify/typeproto").ProtoSpec<{
                        filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        fileLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        downloadPath: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        oldVerSendFile: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        imgType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        previewsImage: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        picMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        picHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        picWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        resId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        result: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        opFaceBuf: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        oldPicMd5: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                        thumbWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        thumbHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        showLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        downloadLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        url400: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        width400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        height400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, true, false>;
                    readonly transElemInfo: import("@saltify/typeproto").ProtoSpec<{
                        elemType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        elemValue: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, true, false>;
                    readonly marketFace: import("@saltify/typeproto").ProtoSpec<{
                        summary: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        itemType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        info: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        faceId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        tabId: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        subType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        key: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        width: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        height: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    }, true, false>;
                    readonly customFace: import("@saltify/typeproto").ProtoSpec<{
                        guid: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        shortcut: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        buffer: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        oldData: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        serverIp: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        serverPort: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        fileType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        signature: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        useful: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        bizType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        repeatIndex: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        repeatImage: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        imageType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        index: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        source: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        size: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        origin: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        thumbWidth: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        thumbHeight: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        showLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        downloadLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        x400Url: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        x400Width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        x400Height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<{
                            subType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            summary: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            field10: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            field21: import("@saltify/typeproto").ProtoSpec<{
                                field1: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field5: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                md5Str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            }, false, false>;
                            field31: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        }, true, false>;
                    }, true, false>;
                    readonly elemFlags2: import("@saltify/typeproto").ProtoSpec<{
                        colorTextId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        msgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        whisperSessionId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pttChangeBit: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        vipStatus: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        compatibleId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        insts: import("@saltify/typeproto").ProtoSpec<{
                            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, false, true>;
                        msgRptCnt: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        srcInst: import("@saltify/typeproto").ProtoSpec<{
                            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, false, false>;
                        longtitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        latitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        customFont: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pcSupportDef: import("@saltify/typeproto").ProtoSpec<{
                            pcPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            pcPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            macPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            macPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            ptlsSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                            ptlsNotSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                        }, false, false>;
                        crmFlags: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    }, true, false>;
                    readonly richMsg: import("@saltify/typeproto").ProtoSpec<{
                        template: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        serviceId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    }, true, false>;
                    readonly groupFile: import("@saltify/typeproto").ProtoSpec<{
                        filename: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        fileSize: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                        fileId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        batchId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        fileKey: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        sequence: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                    }, true, false>;
                    readonly extraInfo: import("@saltify/typeproto").ProtoSpec<{
                        nick: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        groupCard: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        level: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        flags: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        groupMask: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        msgTailId: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        senderTitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        apnsTips: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        uin: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        msgStateFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        apnsSoundType: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        newGroupFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                    }, true, false>;
                    readonly videoFile: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    readonly generalFlags: import("@saltify/typeproto").ProtoSpec<{
                        bubbleDiyTextId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        groupFlagNew: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        uin: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        rpId: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        prpFold: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        longTextFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        longTextResId: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        groupType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        toUinFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        glamourLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        memberLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        groupRankSeq: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
                        olympicTorch: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        babyqGuideMsgCookie: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        uin32ExpertFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        bubbleSubId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        pendantId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        rpIndex: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, true, false>;
                    readonly srcMsg: import("@saltify/typeproto").ProtoSpec<{
                        origSeqs: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                        senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        time: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        elems: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
                        attr: import("@saltify/typeproto").ProtoSpec<{
                            oriMsgType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            sourceMsgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                            senderUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            receiverUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            ntMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        }, false, false>;
                        srcMsg: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        toUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, true, false>;
                    readonly lightApp: import("@saltify/typeproto").ProtoSpec<{
                        data: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        msgResid: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    }, true, false>;
                    readonly commonElem: import("@saltify/typeproto").ProtoSpec<{
                        serviceType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pbElem: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, true, false>;
                }>, false, true>;
            }, false, false>;
            msgContent: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            msgEncryptContent: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
        }, true, false>;
    }>;
    const PbMultiMsgItem: ProtoMessage<{
        readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly buffer: import("@saltify/typeproto").ProtoSpec<{
            msg: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
        }, false, false>;
    }>;
    const PbMultiMsgTransmit: ProtoMessage<{
        readonly msg: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly routingHead: import("@saltify/typeproto").ProtoSpec<{
                fromUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                fromUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                fromAppid: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                fromInstid: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                toUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                toUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                c2c: import("@saltify/typeproto").ProtoSpec<{
                    c2cType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    serviceType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    sig: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    fromTinyId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    toTinyId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    name: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, false, false>;
                group: import("@saltify/typeproto").ProtoSpec<{
                    groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    groupType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    groupInfoSeq: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                    groupCard: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    groupCardType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    groupLevel: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    groupName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    extGroupKeyInfo: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    msgFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                }, true, false>;
            }, false, false>;
            /**
             * OlPush 的消息头, 跟发送时的 SendContentHead 布局不同。群聊 field 5 是所有人一致的群 msgSeq, field 11 为 0;
             * 私聊 field 5 是发送方的 clientSequence (撤回和引用用它), field 11 是双端一致的 c2cMsgSeq
             */
            readonly contentHead: import("@saltify/typeproto").ProtoSpec<{
                msgType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                subType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                c2cCmd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                /** 发送方生成, 两端一致 */
                random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                groupMsgSeqOrC2cClientSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                msgTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                pkgNum: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                pkgIndex: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                divSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                autoReply: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                c2cMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                /** C2C 可由 (0x01000000 << 32) | random 算出 */
                msgUid: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                /** 拉历史时 server 不填 field 12, 同样的 id 在这里 */
                msgUidAlt: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                forward: import("@saltify/typeproto").ProtoSpec<{
                    field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    field4: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                    avatar: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                }, true, false>;
            }, false, false>;
            readonly body: import("@saltify/typeproto").ProtoSpec<{
                richText: import("@saltify/typeproto").ProtoSpec<{
                    attr: import("@saltify/typeproto").ProtoSpec<{
                        codePage: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        time: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        random: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        color: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        size: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        effect: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        charSet: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        pitchAndFamily: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        fontName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        reserveData: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, false, false>;
                    elems: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                        readonly text: import("@saltify/typeproto").ProtoSpec<{
                            str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            link: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            attr6Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            attr7Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        }, true, false>;
                        readonly face: import("@saltify/typeproto").ProtoSpec<{
                            index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            old: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        }, true, false>;
                        readonly notOnlineImage: import("@saltify/typeproto").ProtoSpec<{
                            filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            fileLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            downloadPath: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            oldVerSendFile: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            imgType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            previewsImage: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            picMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            picHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            picWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            resId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            result: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            opFaceBuf: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            oldPicMd5: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                            thumbWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            thumbHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            showLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            downloadLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            url400: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            width400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            height400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        }, true, false>;
                        readonly transElemInfo: import("@saltify/typeproto").ProtoSpec<{
                            elemType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            elemValue: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        }, true, false>;
                        readonly marketFace: import("@saltify/typeproto").ProtoSpec<{
                            summary: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            itemType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            info: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            faceId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            tabId: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            subType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            key: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            width: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            height: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        }, true, false>;
                        readonly customFace: import("@saltify/typeproto").ProtoSpec<{
                            guid: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            shortcut: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            buffer: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            oldData: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            serverIp: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                            serverPort: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                            fileType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            signature: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            useful: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            bizType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            repeatIndex: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            repeatImage: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            imageType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            index: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            source: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            size: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            origin: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            thumbWidth: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                            thumbHeight: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                            showLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            downloadLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            x400Url: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            x400Width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            x400Height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            pbReserve: import("@saltify/typeproto").ProtoSpec<{
                                subType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                summary: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                field10: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field21: import("@saltify/typeproto").ProtoSpec<{
                                    field1: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                    field2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                    field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                    field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                    field5: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                    md5Str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                }, false, false>;
                                field31: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            }, true, false>;
                        }, true, false>;
                        readonly elemFlags2: import("@saltify/typeproto").ProtoSpec<{
                            colorTextId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                            msgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                            whisperSessionId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            pttChangeBit: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            vipStatus: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            compatibleId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            insts: import("@saltify/typeproto").ProtoSpec<{
                                appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            }, false, true>;
                            msgRptCnt: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            srcInst: import("@saltify/typeproto").ProtoSpec<{
                                appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            }, false, false>;
                            longtitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            latitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            customFont: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            pcSupportDef: import("@saltify/typeproto").ProtoSpec<{
                                pcPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                pcPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                macPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                macPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                                ptlsSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                                ptlsNotSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                            }, false, false>;
                            crmFlags: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        }, true, false>;
                        readonly richMsg: import("@saltify/typeproto").ProtoSpec<{
                            template: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            serviceId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        }, true, false>;
                        readonly groupFile: import("@saltify/typeproto").ProtoSpec<{
                            filename: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            fileSize: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                            fileId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            batchId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            fileKey: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            sequence: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                        }, true, false>;
                        readonly extraInfo: import("@saltify/typeproto").ProtoSpec<{
                            nick: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            groupCard: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            level: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            flags: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            groupMask: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            msgTailId: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                            senderTitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            apnsTips: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            uin: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            msgStateFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                            apnsSoundType: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                            newGroupFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        }, true, false>;
                        readonly videoFile: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        readonly generalFlags: import("@saltify/typeproto").ProtoSpec<{
                            bubbleDiyTextId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            groupFlagNew: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            uin: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                            rpId: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            prpFold: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            longTextFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            longTextResId: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            groupType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            toUinFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            glamourLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            memberLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            groupRankSeq: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
                            olympicTorch: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            babyqGuideMsgCookie: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            uin32ExpertFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            bubbleSubId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            pendantId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                            rpIndex: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        }, true, false>;
                        readonly srcMsg: import("@saltify/typeproto").ProtoSpec<{
                            origSeqs: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                            senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            time: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            elems: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
                            attr: import("@saltify/typeproto").ProtoSpec<{
                                oriMsgType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                                sourceMsgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                                senderUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                receiverUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                                ntMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            }, false, false>;
                            srcMsg: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                            toUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, true, false>;
                        readonly lightApp: import("@saltify/typeproto").ProtoSpec<{
                            data: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            msgResid: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        }, true, false>;
                        readonly commonElem: import("@saltify/typeproto").ProtoSpec<{
                            serviceType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            pbElem: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                            businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, true, false>;
                    }>, false, true>;
                }, false, false>;
                msgContent: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                msgEncryptContent: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            }, true, false>;
        }>, false, true>;
        readonly pbItemList: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            readonly buffer: import("@saltify/typeproto").ProtoSpec<{
                msg: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
            }, false, false>;
        }>, false, true>;
    }>;
    const PushMsg: ProtoMessage<{
        readonly message: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
    }>;
    /** trpc.qq_new_tech.status_svc.StatusService.KickNT */
    const KickNTPush: ProtoMessage<{
        readonly uin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly tipsDesc: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly tipsTitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        /** 1001 = 异地顶号 (删 session 重新扫码); 其他 = 服务端主动踢等 (保留凭证重连) */
        readonly code: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        /** 时间戳或某种 token */
        readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const QSmallFaceExtra: ProtoMessage<{
        readonly faceId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly text: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly compatText: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    /** commonElem(serviceType=37) 包装的"超级表情" / dice / rps 等动态贴纸 */
    const LargeFaceExtra: ProtoMessage<{
        readonly aniStickerPackId: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly aniStickerId: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly faceId: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
        readonly field4: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
        readonly aniStickerType: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
        readonly resultId: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly preview: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly field9: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
    }>;
    const GroupFileExtra: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly display: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly inner: import("@saltify/typeproto").ProtoSpec<{
            info: import("@saltify/typeproto").ProtoSpec<{
                busId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                fileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                field5: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                field7: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                fileMd5: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, false, false>;
        }, false, false>;
    }>;
    const FileExtra: ProtoMessage<{
        readonly file: import("@saltify/typeproto").ProtoSpec<{
            fileType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            sig: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            fileUuid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileMd5: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            fileName: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            note: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            reserved: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            subCmd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            microCloud: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            fileUrls: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
            downloadFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            dangerLevel: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            lifeTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uploadTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            absFileType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            clientType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            expireTime: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            fileIdCrcMedia: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
    }>;
    /** MessageSvc.PbSendMsg */
    const PbSendMsg: ProtoMessage<{
        readonly routingHead: import("@saltify/typeproto").ProtoSpec<{
            c2c: import("@saltify/typeproto").ProtoSpec<{
                toUin: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                toUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            }, true, false>;
            group: import("@saltify/typeproto").ProtoSpec<{
                groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            }, true, false>;
            groupTemp: import("@saltify/typeproto").ProtoSpec<{
                groupCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                toUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
            trans0X211: import("@saltify/typeproto").ProtoSpec<{
                toUin: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                ccCmd: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                uid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
            }, true, false>;
        }, false, false>;
        readonly contentHead: import("@saltify/typeproto").ProtoSpec<{
            pkgNum: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            pkgIndex: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            divSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            autoReply: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        }, true, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            richText: import("@saltify/typeproto").ProtoSpec<{
                elems: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
                    readonly text: import("@saltify/typeproto").ProtoSpec<{
                        str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        link: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        attr6Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        attr7Buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    }, true, false>;
                    readonly face: import("@saltify/typeproto").ProtoSpec<{
                        index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        old: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        buf: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    }, true, false>;
                    readonly notOnlineImage: import("@saltify/typeproto").ProtoSpec<{
                        filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        fileLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        downloadPath: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        oldVerSendFile: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        imgType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        previewsImage: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        picMd5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        picHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        picWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        resId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        original: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        bizType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        result: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        index: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        opFaceBuf: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        oldPicMd5: import("@saltify/typeproto").ProtoSpec<"bool", false, false>;
                        thumbWidth: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        thumbHeight: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        showLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        downloadLen: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        url400: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        width400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        height400: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, true, false>;
                    readonly transElemInfo: import("@saltify/typeproto").ProtoSpec<{
                        elemType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        elemValue: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, true, false>;
                    readonly marketFace: import("@saltify/typeproto").ProtoSpec<{
                        summary: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        itemType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        info: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        faceId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        tabId: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        subType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        key: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        width: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        height: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    }, true, false>;
                    readonly customFace: import("@saltify/typeproto").ProtoSpec<{
                        guid: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        filePath: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        shortcut: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        buffer: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        flag: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        oldData: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        fileId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        serverIp: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        serverPort: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        fileType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        signature: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        useful: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        thumbUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        bigUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        origUrl: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        bizType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        repeatIndex: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        repeatImage: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        imageType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        index: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        source: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        size: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        origin: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        thumbWidth: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        thumbHeight: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        showLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        downloadLen: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        x400Url: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        x400Width: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        x400Height: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<{
                            subType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            summary: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            field10: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                            field21: import("@saltify/typeproto").ProtoSpec<{
                                field1: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field2: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                                field3: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                field5: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                                md5Str: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            }, false, false>;
                            field31: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        }, true, false>;
                    }, true, false>;
                    readonly elemFlags2: import("@saltify/typeproto").ProtoSpec<{
                        colorTextId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        msgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        whisperSessionId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pttChangeBit: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        vipStatus: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        compatibleId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        insts: import("@saltify/typeproto").ProtoSpec<{
                            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, false, true>;
                        msgRptCnt: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        srcInst: import("@saltify/typeproto").ProtoSpec<{
                            appId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            instId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        }, false, false>;
                        longtitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        latitude: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        customFont: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pcSupportDef: import("@saltify/typeproto").ProtoSpec<{
                            pcPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            pcPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            macPtlBegin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            macPtlEnd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                            ptlsSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                            ptlsNotSupport: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                        }, false, false>;
                        crmFlags: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                    }, true, false>;
                    readonly richMsg: import("@saltify/typeproto").ProtoSpec<{
                        template: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        serviceId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                    }, true, false>;
                    readonly groupFile: import("@saltify/typeproto").ProtoSpec<{
                        filename: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        fileSize: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                        fileId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        batchId: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        fileKey: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        sequence: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
                    }, true, false>;
                    readonly extraInfo: import("@saltify/typeproto").ProtoSpec<{
                        nick: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        groupCard: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        level: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        flags: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        groupMask: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        msgTailId: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        senderTitle: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                        apnsTips: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        uin: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        msgStateFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        apnsSoundType: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                        newGroupFlag: import("@saltify/typeproto").ProtoSpec<"int32", true, false>;
                    }, true, false>;
                    readonly videoFile: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    readonly generalFlags: import("@saltify/typeproto").ProtoSpec<{
                        bubbleDiyTextId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        groupFlagNew: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        uin: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        rpId: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        prpFold: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        longTextFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        longTextResId: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                        groupType: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        toUinFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        glamourLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        memberLevel: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        groupRankSeq: import("@saltify/typeproto").ProtoSpec<"int64", false, false>;
                        olympicTorch: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        babyqGuideMsgCookie: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        uin32ExpertFlag: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        bubbleSubId: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        pendantId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                        rpIndex: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        pbReserve: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                    }, true, false>;
                    readonly srcMsg: import("@saltify/typeproto").ProtoSpec<{
                        origSeqs: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
                        senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        time: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
                        elems: import("@saltify/typeproto").ProtoSpec<"bytes", false, true>;
                        attr: import("@saltify/typeproto").ProtoSpec<{
                            oriMsgType: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                            sourceMsgId: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
                            senderUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                            receiverUid: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                            ntMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
                        }, false, false>;
                        srcMsg: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                        toUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, true, false>;
                    readonly lightApp: import("@saltify/typeproto").ProtoSpec<{
                        data: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        msgResid: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
                    }, true, false>;
                    readonly commonElem: import("@saltify/typeproto").ProtoSpec<{
                        serviceType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                        pbElem: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
                        businessType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
                    }, true, false>;
                }>, false, true>;
            }, true, false>;
            msgContent: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        }, false, false>;
        readonly clientSequence: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly random: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly syncCookie: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
        readonly via: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly control: import("@saltify/typeproto").ProtoSpec<{
            msgFlag: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, true, false>;
        readonly multiSendSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
    }>;
    /** 双端一致的 msgSeq 二选一: 群聊在 field 11, 私聊在 field 14 (别跟私聊 contentHead field 5 的 clientSequence 搞混) */
    const PbSendMsgResp: ProtoMessage<{
        readonly resultCode: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly errMsg: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        readonly sendTime: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly msgInfoFlag: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly groupMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly c2cMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
    }>;
    /** pttTrans.TransGroupPttReq, 结果经 MsgPush (528 / 61) 异步推回 */
    const PttTransGroupReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            msgUid: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            groupUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            voiceMd5Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field8: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            voiceFileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field10: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field10: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** pttTrans.TransC2CPttReq */
    const PttTransC2CReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            msgUid: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            receiverUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            voiceFileId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field8: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            voiceMd5Hex: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, false>;
        readonly field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field10: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    /** MsgPush (528 / 61) 的 msgContent, 群和私聊共用, 按 msgUid 关联请求 */
    const PttTransResultPush: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            msgUid: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            /** 1 = group, 2 = c2c */
            chatType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field5: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field6: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            text: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            senderUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            /** group: groupCode；c2c: 收件人 uin */
            groupOrReceiverUin: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
    }>;
    /** Faceroam.OpReq */
    const FaceroamOpReq: ProtoMessage<{
        readonly comm: import("@saltify/typeproto").ProtoSpec<{
            imPlat: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            osVersion: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            qVersion: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
        }, false, false>;
        readonly selfUin: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        /** 1 = 列表, 2 = 删除 */
        readonly subCmd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly deleteList: import("@saltify/typeproto").ProtoSpec<{
            emojiId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        }, false, true>;
        readonly field6: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
    }>;
    const FaceroamListResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly errMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly subCmd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly userInfo: import("@saltify/typeproto").ProtoSpec<{
            fileName: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
            deleteFile: import("@saltify/typeproto").ProtoSpec<"string", false, true>;
            bid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            maxRoamSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        /** 跟 fileName 一一对应 */
        readonly emojiType: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
    }>;
    const FaceroamDeleteResp: ProtoMessage<{
        readonly retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly errMsg: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
        readonly subCmd: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly results: import("@saltify/typeproto").ProtoSpec<{
            emojiId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            status: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, true>;
    }>;
    /** ImgStore.BDHExpressionRoam */
    const BDHExpressionRoamReq: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            field1: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uin: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            field3: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            /** 16 字节原始 md5, 不是 hex */
            md5: import("@saltify/typeproto").ProtoSpec<"bytes", false, false>;
            fileSize: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field7: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field8: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field9: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            version: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            field16: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        }, false, false>;
        /** 对应 highway commandId（add 走 cmd=9） */
        readonly commandId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly extension: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
    }>;
    const BDHExpressionRoamResp: ProtoMessage<{
        readonly field1: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly body: import("@saltify/typeproto").ProtoSpec<{
            retCode: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field2: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            field4: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
            uploadIps: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
            uploadPorts: import("@saltify/typeproto").ProtoSpec<"uint32", false, true>;
            /** highway upload 用的 ticket */
            uKey: import("@saltify/typeproto").ProtoSpec<"bytes", true, false>;
            field9: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            field10: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            field11: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            field12: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
            ext: import("@saltify/typeproto").ProtoSpec<{
                domain: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
                path1: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                path2: import("@saltify/typeproto").ProtoSpec<"string", true, false>;
                emojiId: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
            }, true, false>;
        }, false, false>;
    }>;
    /** InfoSyncPush 里的群节点, 带每个群的最新 seq */
    const InfoSyncPushGroupNode: ProtoMessage<{
        readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly groupSeq: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly readMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
        readonly latestMsgTime: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
    }>;
    const InfoSyncPush: ProtoMessage<{
        readonly groupNodes: import("@saltify/typeproto").ProtoSpec<ProtoMessage<{
            readonly groupCode: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            readonly groupSeq: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
            readonly readMsgSeq: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
            readonly latestMsgTime: import("@saltify/typeproto").ProtoSpec<"uint64", true, false>;
        }>, false, true>;
    }>;
    const MarkdownExtra: ProtoMessage<{
        readonly content: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const TextResvAttr: ProtoMessage<{
        readonly atType: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly atMemberUin: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly atMemberTinyid: import("@saltify/typeproto").ProtoSpec<"uint32", true, false>;
        readonly atMemberUid: import("@saltify/typeproto").ProtoSpec<"string", false, false>;
    }>;
    const PokeExtra: ProtoMessage<{
        readonly type: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly strength: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
    const MessageStyleExtra: ProtoMessage<{
        readonly field4: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        readonly font: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly fontEffectId: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
        readonly vipType: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly vipLevel: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly vipNameplate: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly groupMemberLevel: import("@saltify/typeproto").ProtoSpec<{
            level: import("@saltify/typeproto").ProtoSpec<"int32", false, false>;
        }, true, false>;
        readonly groupHonorStyle: import("@saltify/typeproto").ProtoSpec<"uint64", false, false>;
        readonly messageSequence: import("@saltify/typeproto").ProtoSpec<"uint32", false, false>;
    }>;
}
