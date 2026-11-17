// src/support/globalVars.ts
import path from "node:path";
import { mkdirSync } from "node:fs";
var DATA_DIR = path.resolve("data");
var TEMP_DIR = path.join(DATA_DIR, "temp");
var LOG_DIR = path.join(DATA_DIR, "logs");
var dbDir = path.join(DATA_DIR, "database");
function ensureRuntimeDirectories() {
  for (const dir of [DATA_DIR, TEMP_DIR, dbDir]) mkdirSync(dir, { recursive: true });
}
var STATE_DIR = path.join(DATA_DIR, "state");

// src/support/logger.ts
import { defaultFormatters } from "cordis";
defaultFormatters.h = (value) => Buffer.isBuffer(value) ? value.toString("hex") : value == null ? "" : String(value);
var DEBUG_ARGV = process.argv.includes("--debug");
var LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
var configLevel = LEVELS.info;
var makeLogger;
var cache = /* @__PURE__ */ new Map();
function isDebugEnabled() {
  return getLogLevel() === LEVELS.debug;
}
function getLogLevel() {
  return DEBUG_ARGV ? LEVELS.debug : configLevel;
}
function setConfigLogLevel(level) {
  configLevel = level !== void 0 && Object.hasOwn(LEVELS, level) ? LEVELS[level] : LEVELS.info;
}
function bindLoggerFactory(factory) {
  makeLogger = factory;
}
function getLogger(namespace) {
  const forward = (level) => (...args) => resolve(namespace)[level](...args);
  return {
    error: forward("error"),
    warn: forward("warn"),
    info: forward("info"),
    debug: forward("debug")
  };
}
function resolve(namespace) {
  const factory = makeLogger;
  if (!factory) return consoleShim(namespace);
  let lg = cache.get(namespace);
  if (!lg) {
    lg = factory(namespace);
    cache.set(namespace, lg);
  }
  return lg;
}
function consoleShim(namespace) {
  const p = `[${namespace}]`;
  return {
    error: (...a) => console.error(p, ...a),
    warn: (...a) => {
      if (getLogLevel() >= LEVELS.warn) console.warn(p, ...a);
    },
    info: (...a) => {
      if (getLogLevel() >= LEVELS.info) console.info(p, ...a);
    },
    debug: (...a) => {
      if (isDebugEnabled()) console.debug(p, ...a);
    }
  };
}

// src/support/utils/ffmpeg.ts
var FFMPEG_PLUGIN = "lucky-lillia-plugin-ffmpeg";
var FFmpegUnavailableError = class extends Error {
  code = "FFMPEG_PLUGIN_MISSING";
  constructor(message = `\u672A\u5B89\u88C5\u6216\u672A\u542F\u7528 FFmpeg \u63D2\u4EF6\uFF08${FFMPEG_PLUGIN}\uFF09\uFF0C\u8BF7\u5B89\u88C5\u5E76\u542F\u7528\u540E\u91CD\u8BD5`) {
    super(message);
    this.name = "FFmpegUnavailableError";
  }
};
var active;
function installFFmpegBridge(ctx) {
  ctx.inject(["ffmpeg"], (scope) => {
    const binding = { api: scope.ffmpeg };
    scope.effect(() => {
      active = binding;
      return () => {
        if (active === binding) active = void 0;
      };
    });
  });
}
function tryGetFFmpegAddon(ctx) {
  return ctx?.get("ffmpeg") ?? active?.api;
}
function getFFmpegAddon(ctx) {
  const api = tryGetFFmpegAddon(ctx);
  if (!api) throw new FFmpegUnavailableError();
  return api;
}
var warned = false;
function setFFMpegPath(ffmpegPath) {
  if (ffmpegPath && !warned) {
    warned = true;
    getLogger("ffmpeg").info(`\u65E7\u7248 FFmpeg \u53EF\u6267\u884C\u6587\u4EF6\u8DEF\u5F84\u4E0D\u518D\u4F7F\u7528\uFF0C\u9700\u8981\u8F6C\u7801\u65F6\u8BF7\u5B89\u88C5\u5E76\u542F\u7528 ${FFMPEG_PLUGIN} \u63D2\u4EF6`);
  }
}

// src/ntqqapi/proto/action.ts
import { ProtoField, ProtoMessage } from "@saltify/typeproto";
var Action;
((Action2) => {
  const LongMsgPeer = ProtoMessage.of({
    uid: ProtoField(2, "string")
  });
  const LongMsgSettings = ProtoMessage.of({
    field1: ProtoField(1, "uint32"),
    field2: ProtoField(2, "uint32"),
    field3: ProtoField(3, "uint32"),
    field4: ProtoField(4, "uint32")
  });
  Action2.SendLongMsgReq = ProtoMessage.of({
    info: ProtoField(2, {
      type: ProtoField(1, "uint32"),
      peer: ProtoField(2, LongMsgPeer),
      groupCode: ProtoField(3, "uint32"),
      payload: ProtoField(4, "bytes")
    }),
    settings: ProtoField(15, LongMsgSettings)
  });
  Action2.SendLongMsgResp = ProtoMessage.of({
    result: ProtoField(2, {
      resId: ProtoField(3, "string")
    }),
    settings: ProtoField(15, LongMsgSettings)
  });
  Action2.PullPicsReq = ProtoMessage.of({
    uin: ProtoField(2, "uint32"),
    field3: ProtoField(3, "uint32"),
    word: ProtoField(6, "string"),
    word2: ProtoField(7, "string"),
    field8: ProtoField(8, "uint32"),
    field9: ProtoField(9, "uint32"),
    field14: ProtoField(14, "uint32")
  });
  Action2.PullPicsResp = ProtoMessage.of({
    info: ProtoField(3, {
      url: ProtoField(5, "string")
    }, "repeated")
  });
  Action2.RecvLongMsgReq = ProtoMessage.of({
    info: ProtoField(1, {
      peer: ProtoField(1, LongMsgPeer),
      resId: ProtoField(2, "string"),
      acquire: ProtoField(3, "bool")
    }),
    settings: ProtoField(15, LongMsgSettings)
  });
  Action2.RecvLongMsgResp = ProtoMessage.of({
    result: ProtoField(1, {
      resId: ProtoField(3, "string"),
      payload: ProtoField(4, "bytes")
    }),
    settings: ProtoField(15, LongMsgSettings)
  });
  Action2.FetchUserLoginDaysReq = ProtoMessage.of({
    field2: ProtoField(2, "uint32"),
    json: ProtoField(3, "string")
  });
  Action2.FetchUserLoginDaysResp = ProtoMessage.of({
    json: ProtoField(4, "string")
  });
  Action2.SsoGetGroupMsgReq = ProtoMessage.of({
    groupInfo: ProtoField(1, {
      groupCode: ProtoField(1, "uint32"),
      startSequence: ProtoField(2, "uint32"),
      endSequence: ProtoField(3, "uint32")
    }),
    filter: ProtoField(2, "uint32")
  });
  Action2.SsoGetGroupMsgResp = ProtoMessage.of({
    retcode: ProtoField(1, "uint32"),
    errorMsg: ProtoField(2, "string", "optional"),
    body: ProtoField(3, {
      groupCode: ProtoField(3, "uint32"),
      startSequence: ProtoField(4, "uint32"),
      endSequence: ProtoField(5, "uint32"),
      messages: ProtoField(6, "bytes", "repeated")
    })
  });
  Action2.SsoGetC2CMsgReq = ProtoMessage.of({
    peerUid: ProtoField(2, "string"),
    startSequence: ProtoField(3, "uint32"),
    endSequence: ProtoField(4, "uint32")
  });
  Action2.SsoGetC2CMsgResp = ProtoMessage.of({
    retcode: ProtoField(1, "uint32"),
    errorMsg: ProtoField(2, "string", "optional"),
    messages: ProtoField(7, "bytes", "repeated")
  });
  Action2.SsoGetRoamMsgReq = ProtoMessage.of({
    peerUid: ProtoField(1, "string"),
    time: ProtoField(2, "uint32"),
    // 0 表示从当前时间起
    random: ProtoField(3, "uint32"),
    // 0 即可
    count: ProtoField(4, "uint32"),
    // 最大 30
    direction: ProtoField(5, "uint32")
    // 1=向上(更新)；2=向下(更早)
  });
  Action2.SsoGetRoamMsgResp = ProtoMessage.of({
    peerUid: ProtoField(3, "string", "optional"),
    isComplete: ProtoField(4, "bool", "optional"),
    timestamp: ProtoField(5, "uint32", "optional"),
    random: ProtoField(6, "uint32", "optional"),
    messages: ProtoField(7, "bytes", "repeated")
  });
  Action2.SsoGroupRecallMsgReq = ProtoMessage.of({
    type: ProtoField(1, "uint32"),
    groupCode: ProtoField(2, "uint32"),
    info: ProtoField(3, {
      sequence: ProtoField(1, "uint32")
    })
  });
  Action2.SsoC2CRecallMsgReq = ProtoMessage.of({
    type: ProtoField(1, "uint32"),
    targetUid: ProtoField(3, "string"),
    info: ProtoField(4, {
      /** PbSendMsg 时的 clientSequence */
      clientSequence: ProtoField(1, "uint32"),
      random: ProtoField(2, "uint32"),
      /** (0x01000000<<32) | random */
      messageUid: ProtoField(3, "uint64"),
      /** PbSendMsgResp.sendTime */
      timestamp: ProtoField(4, "uint32"),
      field5: ProtoField(5, "uint32"),
      /** PbSendMsgResp.c2cMsgSeq */
      c2cMsgSeq: ProtoField(6, "uint32")
    }),
    field5: ProtoField(5, {
      field1: ProtoField(1, "uint32"),
      field2: ProtoField(2, "uint32")
    }),
    field6: ProtoField(6, "uint32")
  });
  Action2.SetStatusReq = ProtoMessage.of({
    status: ProtoField(1, "uint32"),
    extStatus: ProtoField(2, "uint32"),
    batteryStatus: ProtoField(3, "uint32"),
    customExt: ProtoField(4, {
      faceId: ProtoField(1, "uint32"),
      text: ProtoField(2, "string"),
      field3: ProtoField(3, "uint32")
      // 1
    }, "optional")
  });
  Action2.SetStatusResp = ProtoMessage.of({
    retCode: ProtoField(1, "uint32"),
    message: ProtoField(2, "string")
  });
  const QunAlbumPhotoUrl = ProtoMessage.of({
    url: ProtoField(1, "string"),
    width: ProtoField(2, "uint32"),
    height: ProtoField(3, "uint32")
  });
  const QunAlbumThumbnail = ProtoMessage.of({
    spec: ProtoField(1, "uint32"),
    url: ProtoField(2, QunAlbumPhotoUrl)
  });
  const QunAlbumImage = ProtoMessage.of({
    lloc: ProtoField(3, "string"),
    photoUrl: ProtoField(4, QunAlbumThumbnail, "repeated"),
    defaultUrl: ProtoField(5, QunAlbumPhotoUrl, "optional")
  });
  const QunAlbumCover = ProtoMessage.of({
    type: ProtoField(1, "uint32"),
    image: ProtoField(2, QunAlbumImage, "optional")
  });
  const QunAlbumCreator = ProtoMessage.of({
    nick: ProtoField(2, "string"),
    uin: ProtoField(13, "string")
  });
  const QunAlbumRecord = ProtoMessage.of({
    albumId: ProtoField(1, "string"),
    owner: ProtoField(2, "string"),
    name: ProtoField(3, "string"),
    desc: ProtoField(4, "string"),
    createTime: ProtoField(5, "uint32"),
    modifyTime: ProtoField(6, "uint32"),
    lastUploadTime: ProtoField(7, "uint32"),
    uploadNumber: ProtoField(8, "uint32"),
    cover: ProtoField(9, QunAlbumCover, "optional"),
    creator: ProtoField(10, QunAlbumCreator, "optional")
  });
  const QunAlbumMetaHeader = ProtoMessage.of({
    name: ProtoField(1, "string"),
    value: ProtoField(2, "string")
  });
  const QunAlbumReqBody = ProtoMessage.of({
    groupCode: ProtoField(1, "string"),
    albumId: ProtoField(2, "bytes")
  });
  Action2.GetAlbumListReq = ProtoMessage.of({
    field1: ProtoField(1, "uint32"),
    field2: ProtoField(2, "bytes"),
    field3: ProtoField(3, "bytes"),
    body: ProtoField(4, QunAlbumReqBody),
    sessionId: ProtoField(5, "string"),
    headers: ProtoField(10, QunAlbumMetaHeader, "repeated")
  });
  Action2.GetAlbumListResp = ProtoMessage.of({
    retCode: ProtoField(2, "uint32"),
    retMsg: ProtoField(3, "string"),
    body: ProtoField(4, {
      albums: ProtoField(1, QunAlbumRecord, "repeated")
    }, "optional")
  });
  Action2.AddAlbumReq = ProtoMessage.of({
    requestId: ProtoField(1, "uint32"),
    field2: ProtoField(2, "bytes"),
    field3: ProtoField(3, "bytes"),
    body: ProtoField(4, {
      info: ProtoField(1, {
        groupCode: ProtoField(2, "string"),
        name: ProtoField(3, "string"),
        desc: ProtoField(4, "string"),
        field5: ProtoField(5, "uint32")
      })
    }),
    sessionId: ProtoField(5, "string"),
    headers: ProtoField(10, QunAlbumMetaHeader, "repeated")
  });
  Action2.AddAlbumResp = ProtoMessage.of({
    requestId: ProtoField(1, "uint32"),
    retCode: ProtoField(2, "uint32"),
    retMsg: ProtoField(3, "string"),
    body: ProtoField(4, {
      info: ProtoField(1, {
        albumId: ProtoField(1, "string"),
        groupCode: ProtoField(2, "string"),
        name: ProtoField(3, "string"),
        desc: ProtoField(4, "string")
      })
    }, "optional")
  });
  Action2.DeleteAlbumReq = ProtoMessage.of({
    requestId: ProtoField(1, "uint32"),
    field2: ProtoField(2, "bytes"),
    field3: ProtoField(3, "bytes"),
    body: ProtoField(4, {
      groupCode: ProtoField(1, "string"),
      albumId: ProtoField(2, "string")
    }),
    sessionId: ProtoField(5, "string"),
    headers: ProtoField(10, QunAlbumMetaHeader, "repeated")
  });
  Action2.DeleteAlbumResp = ProtoMessage.of({
    retCode: ProtoField(2, "uint32"),
    retMsg: ProtoField(3, "string")
  });
  const QunMediaImage = ProtoMessage.of({
    lloc: ProtoField(3, "string"),
    photoUrl: ProtoField(4, QunAlbumThumbnail, "repeated"),
    defaultUrl: ProtoField(5, QunAlbumPhotoUrl, "optional")
  });
  const QunMediaVideo = ProtoMessage.of({
    id: ProtoField(1, "string"),
    url: ProtoField(2, "string"),
    cover: ProtoField(3, {
      lloc: ProtoField(3, "string"),
      photoUrl: ProtoField(4, QunAlbumThumbnail, "repeated"),
      defaultUrl: ProtoField(5, QunAlbumPhotoUrl, "optional")
    }),
    width: ProtoField(4, "uint32"),
    height: ProtoField(5, "uint32"),
    videoTime: ProtoField(6, "uint32"),
    videoUrl: ProtoField(7, {
      spec: ProtoField(1, "uint32"),
      url: ProtoField(2, {
        url: ProtoField(1, "string"),
        width: ProtoField(2, "uint32"),
        height: ProtoField(3, "uint32")
      })
    }, "repeated")
  });
  const QunMediaItem = ProtoMessage.of({
    type: ProtoField(1, "uint32"),
    image: ProtoField(2, QunMediaImage, "optional"),
    video: ProtoField(3, QunMediaVideo, "optional"),
    desc: ProtoField(4, "string"),
    uploader: ProtoField(6, "string"),
    batchId: ProtoField(7, "uint32"),
    uploadTime: ProtoField(8, "uint32"),
    like: ProtoField(10, {
      key: ProtoField(1, "string")
    }, "optional")
  });
  Action2.GetMediaListReq = ProtoMessage.of({
    field1: ProtoField(1, "uint32"),
    field2: ProtoField(2, "bytes"),
    field3: ProtoField(3, "bytes"),
    body: ProtoField(4, {
      groupCode: ProtoField(1, "string"),
      albumId: ProtoField(2, "string"),
      field3: ProtoField(3, "uint32"),
      field4: ProtoField(4, "bytes"),
      attachInfo: ProtoField(5, "string")
    }),
    sessionId: ProtoField(5, "string"),
    headers: ProtoField(10, QunAlbumMetaHeader, "repeated")
  });
  Action2.GetMediaListResp = ProtoMessage.of({
    retCode: ProtoField(2, "uint32"),
    retMsg: ProtoField(3, "string"),
    body: ProtoField(4, {
      album: ProtoField(1, QunAlbumRecord, "optional"),
      mediaList: ProtoField(3, QunMediaItem, "repeated"),
      nextAttachInfo: ProtoField(5, "string"),
      nextHasMore: ProtoField(7, "bool")
    }, "optional")
  });
  Action2.SsoGetPeerSeqReq = ProtoMessage.of({
    peerUid: ProtoField(1, "string")
  });
  Action2.SsoGetPeerSeqResp = ProtoMessage.of({
    retCode: ProtoField(1, "uint32"),
    retMsg: ProtoField(2, "string"),
    /** c2cMsgSeq, 通常等于 seq2 */
    seq1: ProtoField(3, "uint32"),
    /** 偶尔比 seq1 大 1 */
    seq2: ProtoField(4, "uint32"),
    latestMsgTime: ProtoField(5, "uint32")
  });
  Action2.SsoReadedReportReq = ProtoMessage.of({
    group: ProtoField(1, {
      groupCode: ProtoField(1, "uint32"),
      startSequence: ProtoField(2, "uint32")
    }, "optional"),
    c2c: ProtoField(2, {
      targetUid: ProtoField(2, "string"),
      time: ProtoField(3, "uint32"),
      startSequence: ProtoField(4, "uint32")
    }, "optional")
  });
  Action2.SsoReadedReportResp = ProtoMessage.of({
    retCode: ProtoField(1, "uint32"),
    retMsg: ProtoField(2, "string")
  });
})(Action || (Action = {}));

// src/ntqqapi/proto/notify.ts
import { ProtoField as ProtoField2, ProtoMessage as ProtoMessage2 } from "@saltify/typeproto";
var Notify;
((Notify2) => {
  Notify2.GroupMemberChange = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32"),
    memberUid: ProtoField2(3, "string"),
    type: ProtoField2(4, "uint32"),
    adminUid: ProtoField2(5, "string")
  });
  const GroupAdminExtra = ProtoMessage2.of({
    adminUid: ProtoField2(1, "string"),
    isPromote: ProtoField2(2, "bool")
  });
  Notify2.GroupAdminChange = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32"),
    flag: ProtoField2(2, "uint32"),
    isPromote: ProtoField2(3, "bool"),
    body: ProtoField2(4, {
      extraDisable: ProtoField2(1, GroupAdminExtra, "optional"),
      extraEnable: ProtoField2(2, GroupAdminExtra, "optional")
    })
  });
  Notify2.FriendRelatedOrPinChange = ProtoMessage2.of({
    body: ProtoField2(1, {
      type: ProtoField2(2, "uint32"),
      friendDeleted: ProtoField2(14, {
        uid: ProtoField2(1, "string")
      }, "optional"),
      pinChanged: ProtoField2(20, {
        body: ProtoField2(1, {
          uid: ProtoField2(1, "string"),
          groupCode: ProtoField2(2, "uint32", "optional"),
          info: ProtoField2(400, {
            timestamp: ProtoField2(2, "bytes")
          })
        })
      }, "optional"),
      profileLike: ProtoField2(203, {
        msg: ProtoField2(14, {
          count: ProtoField2(1, "uint32"),
          time: ProtoField2(2, "uint32"),
          detail: ProtoField2(3, {
            txt: ProtoField2(1, "string"),
            uin: ProtoField2(3, "uint32"),
            nickname: ProtoField2(5, "string")
          })
        })
      }, "optional")
    })
  });
  Notify2.GroupRecall = ProtoMessage2.of({
    operatorUid: ProtoField2(1, "string", "optional"),
    recallMessages: ProtoField2(3, {
      sequence: ProtoField2(1, "uint32"),
      time: ProtoField2(2, "uint32"),
      random: ProtoField2(3, "uint32"),
      type: ProtoField2(4, "uint32"),
      flag: ProtoField2(5, "uint32"),
      authorUid: ProtoField2(6, "string")
    }, "repeated"),
    userDef: ProtoField2(5, "bytes", "optional"),
    groupType: ProtoField2(6, "uint32", "optional"),
    opType: ProtoField2(7, "uint32", "optional"),
    tipInfo: ProtoField2(9, {
      tip: ProtoField2(2, "string", "optional")
    }, "optional")
  });
  Notify2.FriendRecall = ProtoMessage2.of({
    body: ProtoField2(1, {
      fromUid: ProtoField2(1, "string"),
      toUid: ProtoField2(2, "string"),
      clientSequence: ProtoField2(3, "uint32"),
      /** C2C 是 (0x01000000 << 32) | random */
      msgUid: ProtoField2(4, "uint64"),
      random: ProtoField2(6, "uint32"),
      tipInfo: ProtoField2(13, {
        tip: ProtoField2(2, "string")
      }, "optional"),
      sequence: ProtoField2(20, "uint32")
    })
  });
  Notify2.FriendRequest = ProtoMessage2.of({
    body: ProtoField2(1, {
      fromUid: ProtoField2(2, "string"),
      message: ProtoField2(10, "string"),
      via: ProtoField2(11, "string")
    }, "optional")
  });
  Notify2.GroupReaction = ProtoMessage2.of({
    data: ProtoField2(1, {
      data: ProtoField2(1, {
        target: ProtoField2(2, {
          sequence: ProtoField2(1, "uint32")
        }),
        data: ProtoField2(3, {
          code: ProtoField2(1, "string"),
          reactionType: ProtoField2(2, "uint32"),
          count: ProtoField2(3, "uint32"),
          operatorUid: ProtoField2(4, "string"),
          actionType: ProtoField2(5, "uint32")
        })
      })
    })
  });
  Notify2.GeneralGrayTip = ProtoMessage2.of({
    bizType: ProtoField2(1, "uint32"),
    busiId: ProtoField2(2, "uint32"),
    ctrlFlag: ProtoField2(3, "uint32"),
    c2cType: ProtoField2(4, "uint32", "optional"),
    serviceType: ProtoField2(5, "uint32", "optional"),
    templId: ProtoField2(6, "uint32"),
    templParam: ProtoField2(7, ["string", "string"]),
    content: ProtoField2(8, "string"),
    tipsSeqId: ProtoField2(10, "uint32")
  });
  Notify2.GroupMute = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32"),
    operatorUid: ProtoField2(4, "string"),
    info: ProtoField2(5, {
      state: ProtoField2(3, {
        targetUid: ProtoField2(1, "string", "optional"),
        duration: ProtoField2(2, "uint32")
      })
    })
  });
  Notify2.GroupInvitation = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32"),
    invitorUid: ProtoField2(5, "string")
  });
  Notify2.GroupJoinRequest = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32"),
    memberUid: ProtoField2(3, "string")
  });
  Notify2.GroupInvitedJoinRequest = ProtoMessage2.of({
    info: ProtoField2(2, {
      inner: ProtoField2(1, {
        groupCode: ProtoField2(1, "uint32"),
        targetUid: ProtoField2(5, "string"),
        invitorUid: ProtoField2(6, "string")
      })
    })
  });
  Notify2.GroupEssenceChange = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32"),
    msgSequence: ProtoField2(2, "uint32"),
    random: ProtoField2(3, "uint32"),
    setFlag: ProtoField2(4, "uint32"),
    memberUin: ProtoField2(5, "uint32"),
    operatorUin: ProtoField2(6, "uint32"),
    timeStamp: ProtoField2(7, "uint32"),
    msgSequence2: ProtoField2(8, "uint32"),
    operatorNickName: ProtoField2(9, "string"),
    memberNickName: ProtoField2(10, "string"),
    setFlag2: ProtoField2(11, "uint32")
  });
  Notify2.NotifyMessageBody = ProtoMessage2.of({
    notifyType: ProtoField2(1, "uint32", "optional"),
    groupCode: ProtoField2(4, "uint32", "optional"),
    eventParam: ProtoField2(5, "bytes", "optional"),
    recall: ProtoField2(11, Notify2.GroupRecall, "optional"),
    subType: ProtoField2(13, "uint32", "optional"),
    operatorUid: ProtoField2(21, "string", "optional"),
    generalGrayTip: ProtoField2(26, Notify2.GeneralGrayTip, "optional"),
    essenceMessage: ProtoField2(33, Notify2.GroupEssenceChange, "optional"),
    msgSequence: ProtoField2(37, "uint64", "optional"),
    reaction: ProtoField2(44, Notify2.GroupReaction, "optional")
  });
  Notify2.GroupNameChangeBody = ProtoMessage2.of({
    field1: ProtoField2(1, "uint32", "optional"),
    newName: ProtoField2(2, "string")
  });
  Notify2.GroupRemoved = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32")
  });
  Notify2.GroupJoined = ProtoMessage2.of({
    groupCode: ProtoField2(1, "uint32"),
    adminUid: ProtoField2(3, "string")
  });
  Notify2.FriendAdded = ProtoMessage2.of({
    body: ProtoField2(2, {
      friendUid: ProtoField2(1, "string")
    })
  });
  Notify2.GroupMemberSpecialTitleChange = ProtoMessage2.of({
    tipText: ProtoField2(2, "string"),
    memberUin: ProtoField2(5, "uint32")
  });
})(Notify || (Notify = {}));

// src/ntqqapi/proto/media.ts
import { ProtoField as ProtoField3, ProtoMessage as ProtoMessage3 } from "@saltify/typeproto";
var Media;
((Media2) => {
  Media2.FileInfo = ProtoMessage3.of({
    fileSize: ProtoField3(1, "uint32"),
    md5HexStr: ProtoField3(2, "string"),
    sha1HexStr: ProtoField3(3, "string"),
    fileName: ProtoField3(4, "string"),
    fileType: ProtoField3(5, {
      type: ProtoField3(1, "uint32"),
      picFormat: ProtoField3(2, "uint32"),
      videoFormat: ProtoField3(3, "uint32"),
      pttFormat: ProtoField3(4, "uint32")
    }),
    width: ProtoField3(6, "uint32"),
    height: ProtoField3(7, "uint32"),
    time: ProtoField3(8, "uint32"),
    original: ProtoField3(9, "uint32")
  });
  Media2.IndexNode = ProtoMessage3.of({
    info: ProtoField3(1, Media2.FileInfo),
    fileUuid: ProtoField3(2, "string"),
    storeID: ProtoField3(3, "uint32"),
    uploadTime: ProtoField3(4, "uint32"),
    expire: ProtoField3(5, "uint32"),
    type: ProtoField3(6, "uint32")
  });
  Media2.ExtBizInfo = ProtoMessage3.of({
    pic: ProtoField3(1, {
      bizType: ProtoField3(1, "uint32"),
      summary: ProtoField3(2, "string"),
      bytesPbReserveC2c: ProtoField3(11, "bytes", "optional"),
      bytesPbReserveTroop: ProtoField3(12, "bytes", "optional"),
      fromScene: ProtoField3(1001, "uint32"),
      toScene: ProtoField3(1002, "uint32"),
      oldFileId: ProtoField3(1003, "uint32")
    }),
    video: ProtoField3(2, {
      fromScene: ProtoField3(1, "uint32", "optional"),
      toScene: ProtoField3(2, "uint32", "optional"),
      pbReserve: ProtoField3(3, "bytes")
    }),
    ptt: ProtoField3(3, {
      srcUin: ProtoField3(1, "uint64", "optional"),
      pttScene: ProtoField3(2, "uint32", "optional"),
      pttType: ProtoField3(3, "uint32", "optional"),
      changeVoice: ProtoField3(4, "uint32", "optional"),
      waveform: ProtoField3(5, "bytes", "optional"),
      autoConvertText: ProtoField3(6, "uint32", "optional"),
      bytesReserve: ProtoField3(11, "bytes", "optional"),
      bytesPbReserve: ProtoField3(12, "bytes", "optional"),
      bytesGeneralFlags: ProtoField3(13, "bytes", "optional")
    }, "optional"),
    busiType: ProtoField3(10, "uint32")
  });
  Media2.NTV2RichMediaReq = ProtoMessage3.of({
    reqHead: ProtoField3(1, {
      common: ProtoField3(1, {
        requestId: ProtoField3(1, "uint32"),
        command: ProtoField3(2, "uint32")
      }),
      scene: ProtoField3(2, {
        requestType: ProtoField3(101, "uint32"),
        businessType: ProtoField3(102, "uint32"),
        field103: ProtoField3(103, "uint32"),
        sceneType: ProtoField3(200, "uint32"),
        c2c: ProtoField3(201, {
          accountType: ProtoField3(1, "uint32"),
          targetUid: ProtoField3(2, "string"),
          tmpInfo: ProtoField3(3, {
            body: ProtoField3(3, {
              groupCode: ProtoField3(3, "uint32"),
              targetUid: ProtoField3(2, "string")
            })
          }, "optional")
        }),
        group: ProtoField3(202, {
          groupId: ProtoField3(1, "uint32")
        })
      }),
      client: ProtoField3(3, {
        agentType: ProtoField3(1, "uint32")
      })
    }),
    upload: ProtoField3(2, {
      uploadInfo: ProtoField3(1, {
        fileInfo: ProtoField3(1, Media2.FileInfo),
        subFileType: ProtoField3(2, "uint32")
      }, "repeated"),
      tryFastUploadCompleted: ProtoField3(2, "bool"),
      srvSendMsg: ProtoField3(3, "bool"),
      clientRandomId: ProtoField3(4, "uint32"),
      compatQMsgSceneType: ProtoField3(5, "uint32"),
      extBizInfo: ProtoField3(6, Media2.ExtBizInfo),
      clientSeq: ProtoField3(7, "uint32"),
      noNeedCompatMsg: ProtoField3(8, "bool")
    }, "optional"),
    download: ProtoField3(3, {
      node: ProtoField3(1, Media2.IndexNode)
    }, "optional"),
    uploadCompleted: ProtoField3(6, {
      srvSendMsg: ProtoField3(1, "bool"),
      clientRandomId: ProtoField3(2, "uint64"),
      msgInfo: ProtoField3(3, "bytes"),
      clientSeq: ProtoField3(4, "uint32")
    }, "optional")
  });
  const MsgInfoBody = ProtoMessage3.of({
    index: ProtoField3(1, Media2.IndexNode),
    pic: ProtoField3(2, {
      urlPath: ProtoField3(1, "string"),
      ext: ProtoField3(2, {
        originalParam: ProtoField3(1, "string"),
        bigParam: ProtoField3(2, "string"),
        thumbParam: ProtoField3(3, "string")
      }),
      domain: ProtoField3(3, "string")
    }, "optional"),
    // 空的 VideoInfo / AudioInfo, 不声明的话 decode 再 encode 会丢掉
    video: ProtoField3(3, "bytes", "optional"),
    audio: ProtoField3(4, "bytes", "optional"),
    fileExist: ProtoField3(5, "bool"),
    hashSum: ProtoField3(6, {
      bytesPbReserveC2c: ProtoField3(201, {
        friendUid: ProtoField3(2, "string")
      }, "optional"),
      troopSource: ProtoField3(202, {
        groupCode: ProtoField3(1, "uint32")
      }, "optional")
    })
  });
  Media2.MsgInfo = ProtoMessage3.of({
    msgInfoBody: ProtoField3(1, MsgInfoBody, "repeated"),
    extBizInfo: ProtoField3(2, Media2.ExtBizInfo)
  });
  Media2.FileIdInfo = ProtoMessage3.of({
    sha1: ProtoField3(2, "bytes"),
    size: ProtoField3(3, "uint32"),
    appid: ProtoField3(4, "uint32"),
    time: ProtoField3(5, "uint32"),
    expire: ProtoField3(10, "uint32")
  });
  const IPv4 = ProtoMessage3.of({
    outIP: ProtoField3(1, "uint32"),
    outPort: ProtoField3(2, "uint32"),
    inIP: ProtoField3(3, "uint32"),
    inPort: ProtoField3(4, "uint32"),
    ipType: ProtoField3(5, "uint32")
  });
  const IPv6 = ProtoMessage3.of({
    outIP: ProtoField3(1, "bytes"),
    outPort: ProtoField3(2, "uint32"),
    inIP: ProtoField3(3, "bytes"),
    inPort: ProtoField3(4, "uint32"),
    ipType: ProtoField3(5, "uint32")
  });
  Media2.NTV2RichMediaResp = ProtoMessage3.of({
    upload: ProtoField3(2, {
      uKey: ProtoField3(1, "string", "optional"),
      uKeyTtlSecond: ProtoField3(2, "uint32"),
      ipv4s: ProtoField3(3, IPv4, "repeated"),
      ipv6s: ProtoField3(4, IPv6, "repeated"),
      msgSeq: ProtoField3(5, "uint32", "optional"),
      // 原样保留 server 的 bytes 当 commonElem.pbElem: decode 再 encode 会丢字段
      msgInfo: ProtoField3(6, "bytes"),
      ext: ProtoField3(7, {
        subType: ProtoField3(1, "uint32"),
        extType: ProtoField3(2, "uint32"),
        extValue: ProtoField3(3, "bytes")
      }, "repeated"),
      compatQMsg: ProtoField3(8, "bytes"),
      subFileInfos: ProtoField3(10, {
        subType: ProtoField3(1, "uint32"),
        uKey: ProtoField3(2, "string", "optional"),
        uKeyTtlSecond: ProtoField3(3, "uint32"),
        ipv4s: ProtoField3(4, IPv4, "repeated"),
        ipv6s: ProtoField3(5, IPv6, "repeated")
      }, "repeated")
    }, "optional"),
    download: ProtoField3(3, {
      rKeyParam: ProtoField3(1, "string"),
      rKeyTtlSecond: ProtoField3(2, "uint32"),
      info: ProtoField3(3, {
        domain: ProtoField3(1, "string"),
        urlPath: ProtoField3(2, "string"),
        httpsPort: ProtoField3(3, "uint32")
      }),
      rKeyCreateTime: ProtoField3(4, "uint32")
    }, "optional")
  });
  Media2.HighwaySessionReq = ProtoMessage3.of({
    reqBody: ProtoField3(1281, {
      uin: ProtoField3(1, "uint32"),
      idcId: ProtoField3(2, "uint32"),
      appid: ProtoField3(3, "uint32"),
      loginSigType: ProtoField3(4, "uint32"),
      loginSigTicket: ProtoField3(5, "bytes", "optional"),
      requestFlag: ProtoField3(6, "uint32"),
      serviceTypes: ProtoField3(7, "uint32", "repeated"),
      bid: ProtoField3(8, "uint32"),
      field9: ProtoField3(9, "int32"),
      field10: ProtoField3(10, "int32"),
      field11: ProtoField3(11, "int32"),
      version: ProtoField3(15, "string")
    })
  });
  Media2.HighwaySessionResp = ProtoMessage3.of({
    rspBody: ProtoField3(1281, {
      sigSession: ProtoField3(1, "bytes"),
      sessionKey: ProtoField3(2, "bytes"),
      addrs: ProtoField3(3, {
        serviceType: ProtoField3(1, "uint32"),
        addrs: ProtoField3(2, {
          type: ProtoField3(1, "uint32"),
          ip: ProtoField3(2, "fixed32"),
          port: ProtoField3(3, "uint32"),
          area: ProtoField3(4, "uint32")
        }, "repeated")
      }, "repeated")
    })
  });
  const DataHighwayHead = ProtoMessage3.of({
    version: ProtoField3(1, "uint32"),
    uin: ProtoField3(2, "string", "optional"),
    command: ProtoField3(3, "string", "optional"),
    seq: ProtoField3(4, "uint32"),
    retryTimes: ProtoField3(5, "uint32"),
    appId: ProtoField3(6, "uint32"),
    dataFlag: ProtoField3(7, "uint32"),
    commandId: ProtoField3(8, "uint32"),
    buildVer: ProtoField3(9, "bytes", "optional")
  });
  const SegHead = ProtoMessage3.of({
    serviceId: ProtoField3(1, "uint32"),
    filesize: ProtoField3(2, "uint32"),
    dataOffset: ProtoField3(3, "uint32"),
    dataLength: ProtoField3(4, "uint32"),
    retCode: ProtoField3(5, "uint32", "optional"),
    serviceTicket: ProtoField3(6, "bytes"),
    md5: ProtoField3(8, "bytes"),
    fileMd5: ProtoField3(9, "bytes"),
    cacheAddr: ProtoField3(10, "uint32"),
    cachePort: ProtoField3(13, "uint32")
  });
  Media2.ReqDataHighwayHead = ProtoMessage3.of({
    msgBaseHead: ProtoField3(1, DataHighwayHead),
    msgSegHead: ProtoField3(2, SegHead),
    bytesReqExtendInfo: ProtoField3(3, "bytes"),
    timestamp: ProtoField3(4, "uint32"),
    msgLoginSigHead: ProtoField3(5, {
      uint32LoginSigType: ProtoField3(1, "uint32"),
      bytesLoginSig: ProtoField3(2, "bytes", "optional"),
      appId: ProtoField3(3, "uint32")
    })
  });
  Media2.RespDataHighwayHead = ProtoMessage3.of({
    msgBaseHead: ProtoField3(1, DataHighwayHead),
    msgSegHead: ProtoField3(2, SegHead, "optional"),
    errorCode: ProtoField3(3, "uint32"),
    allowRetry: ProtoField3(4, "uint32"),
    cacheCost: ProtoField3(5, "uint32"),
    htCost: ProtoField3(6, "uint32"),
    bytesRspExtendInfo: ProtoField3(7, "bytes"),
    timestamp: ProtoField3(8, "uint32"),
    range: ProtoField3(9, "uint32"),
    isReset: ProtoField3(10, "uint32")
  });
  Media2.NTHighwayIPv4 = ProtoMessage3.of({
    domain: ProtoField3(1, {
      isEnable: ProtoField3(1, "bool"),
      ip: ProtoField3(2, "string")
    }),
    port: ProtoField3(2, "uint32")
  });
  Media2.NTHighwayNetwork = ProtoMessage3.of({
    ipv4s: ProtoField3(1, Media2.NTHighwayIPv4, "repeated")
  });
  Media2.NTV2RichMediaHighwayExt = ProtoMessage3.of({
    fileUuid: ProtoField3(1, "string"),
    uKey: ProtoField3(2, "string"),
    network: ProtoField3(5, Media2.NTHighwayNetwork),
    msgInfoBody: ProtoField3(6, MsgInfoBody, "repeated"),
    blockSize: ProtoField3(10, "uint32"),
    hash: ProtoField3(11, {
      fileSha1: ProtoField3(1, "bytes", "repeated")
    })
  });
  Media2.FlashTransferSha1StateV = ProtoMessage3.of({
    state: ProtoField3(1, "bytes", "repeated")
  });
  Media2.FlashTransferUploadReq = ProtoMessage3.of({
    fieId1: ProtoField3(1, "uint32"),
    appId: ProtoField3(2, "uint32"),
    fileId3: ProtoField3(3, "uint32"),
    body: ProtoField3(107, {
      fieId1: ProtoField3(1, "bytes"),
      uKey: ProtoField3(2, "string"),
      start: ProtoField3(3, "uint32"),
      end: ProtoField3(4, "uint32"),
      sha1: ProtoField3(5, "bytes"),
      sha1StateV: ProtoField3(6, Media2.FlashTransferSha1StateV),
      body: ProtoField3(7, "bytes")
    })
  });
  Media2.FlashTransferUploadResp = ProtoMessage3.of({
    status: ProtoField3(5, "string")
  });
  Media2.FileUploadExt = ProtoMessage3.of({
    unknown1: ProtoField3(1, "int32"),
    unknown2: ProtoField3(2, "int32"),
    unknown3: ProtoField3(3, "int32"),
    entry: ProtoField3(100, {
      busiBuff: ProtoField3(100, {
        busId: ProtoField3(1, "int32"),
        senderUin: ProtoField3(100, "uint32"),
        receiverUin: ProtoField3(200, "uint32"),
        groupCode: ProtoField3(400, "uint32")
      }),
      fileEntry: ProtoField3(200, {
        fileSize: ProtoField3(100, "uint32"),
        md5: ProtoField3(200, "bytes"),
        checkKey: ProtoField3(300, "bytes"),
        md510M: ProtoField3(400, "bytes", "optional"),
        sha3: ProtoField3(500, "bytes", "optional"),
        fileId: ProtoField3(600, "string"),
        uploadKey: ProtoField3(700, "bytes")
      }),
      clientInfo: ProtoField3(300, {
        clientType: ProtoField3(100, "int32"),
        appId: ProtoField3(200, "string"),
        terminalType: ProtoField3(300, "int32"),
        clientVer: ProtoField3(400, "string"),
        unknown: ProtoField3(600, "int32")
      }),
      fileNameInfo: ProtoField3(400, {
        fileName: ProtoField3(100, "string")
      }),
      host: ProtoField3(500, {
        hosts: ProtoField3(200, {
          url: ProtoField3(1, {
            unknown: ProtoField3(1, "int32"),
            host: ProtoField3(2, "string")
          }),
          port: ProtoField3(2, "uint32")
        }, "repeated")
      })
    }),
    unknown200: ProtoField3(200, "int32", "optional")
  });
  Media2.GroupAvatarExtra = ProtoMessage3.of({
    type: ProtoField3(1, "uint32"),
    groupUin: ProtoField3(2, "uint32"),
    field3: ProtoField3(3, {
      field1: ProtoField3(1, "uint32")
    }),
    field5: ProtoField3(5, "uint32"),
    field6: ProtoField3(6, "uint32")
  });
})(Media || (Media = {}));

// src/ntqqapi/proto/oidb.ts
import { ProtoField as ProtoField4, ProtoMessage as ProtoMessage4 } from "@saltify/typeproto";
var Oidb;
((Oidb2) => {
  Oidb2.Base = ProtoMessage4.of({
    command: ProtoField4(1, "uint32"),
    subCommand: ProtoField4(2, "uint32"),
    errorCode: ProtoField4(3, "uint32"),
    body: ProtoField4(4, "bytes"),
    errorMsg: ProtoField4(5, "string"),
    isReserved: ProtoField4(12, "uint32")
  });
  Oidb2.SendPokeReq = ProtoMessage4.of({
    toUin: ProtoField4(1, "uint32"),
    groupCode: ProtoField4(2, "uint32"),
    friendUin: ProtoField4(5, "uint32")
  });
  Oidb2.SetSpecialTitleReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    body: ProtoField4(3, {
      targetUid: ProtoField4(1, "string"),
      specialTitle: ProtoField4(5, "string"),
      expireTime: ProtoField4(6, "int32"),
      uidName: ProtoField4(7, "string")
    })
  });
  Oidb2.GetRKeyResp = ProtoMessage4.of({
    result: ProtoField4(4, {
      rkeyItems: ProtoField4(1, {
        rkey: ProtoField4(1, "string"),
        ttlSec: ProtoField4(2, "uint32"),
        storeId: ProtoField4(3, "uint32"),
        createTime: ProtoField4(4, "uint32"),
        type: ProtoField4(5, "uint32")
      }, "repeated")
    })
  });
  Oidb2.FetchUserInfoByUinReq = ProtoMessage4.of({
    uin: ProtoField4(1, "uint32"),
    field2: ProtoField4(2, "uint32"),
    keys: ProtoField4(3, {
      key: ProtoField4(1, "uint32")
    }, "repeated")
  });
  Oidb2.FetchUserInfoByUidReq = ProtoMessage4.of({
    uid: ProtoField4(1, "string"),
    keys: ProtoField4(3, {
      key: ProtoField4(1, "uint32")
    }, "repeated")
  });
  Oidb2.FetchUserInfoResp = ProtoMessage4.of({
    body: ProtoField4(1, {
      properties: ProtoField4(2, {
        numberProperties: ProtoField4(1, ["uint32", "uint32"]),
        bytesProperties: ProtoField4(2, ["uint32", "bytes"])
      }),
      uin: ProtoField4(3, "uint32")
    })
  });
  Oidb2.FetchGroupMembersReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    field2: ProtoField4(2, "uint32"),
    field3: ProtoField4(3, "uint32"),
    body: ProtoField4(4, {
      memberName: ProtoField4(10, "bool"),
      memberCard: ProtoField4(11, "bool"),
      level: ProtoField4(12, "bool"),
      specialTitle: ProtoField4(17, "bool"),
      joinTimestamp: ProtoField4(100, "bool"),
      lastMsgTimestamp: ProtoField4(101, "bool"),
      shutUpTimestamp: ProtoField4(102, "bool"),
      permission: ProtoField4(107, "bool")
    }),
    cookie: ProtoField4(15, "bytes", "optional")
  });
  Oidb2.FetchGroupMembersResp = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    members: ProtoField4(2, {
      id: ProtoField4(1, {
        uid: ProtoField4(2, "string"),
        uin: ProtoField4(4, "uint32")
      }),
      memberName: ProtoField4(10, "string"),
      memberCard: ProtoField4(11, {
        memberCard: ProtoField4(2, "string", "optional")
      }),
      level: ProtoField4(12, {
        level: ProtoField4(2, "uint32", "optional")
      }, "optional"),
      specialTitle: ProtoField4(17, "string", "optional"),
      joinTimestamp: ProtoField4(100, "uint32"),
      lastMsgTimestamp: ProtoField4(101, "uint32"),
      shutUpTimestamp: ProtoField4(102, "uint32", "optional"),
      permission: ProtoField4(107, "uint32", "optional")
    }, "repeated"),
    memberCount: ProtoField4(3, "uint32"),
    cookie: ProtoField4(15, "bytes", "optional")
  });
  Oidb2.FetchAiCharacterListReq = ProtoMessage4.of({
    groupId: ProtoField4(1, "uint32"),
    chatType: ProtoField4(2, "uint32")
  });
  Oidb2.FetchAiCharacterListResp = ProtoMessage4.of({
    property: ProtoField4(1, {
      type: ProtoField4(1, "string"),
      characters: ProtoField4(2, {
        characterId: ProtoField4(1, "string"),
        characterName: ProtoField4(2, "string"),
        previewUrl: ProtoField4(3, "string")
      }, "repeated")
    }, "repeated")
  });
  Oidb2.GetGroupGenerateAiRecordReq = ProtoMessage4.of({
    groupId: ProtoField4(1, "uint32"),
    voiceId: ProtoField4(2, "string"),
    text: ProtoField4(3, "string"),
    chatType: ProtoField4(4, "uint32"),
    clientMsgInfo: ProtoField4(5, {
      msgRandom: ProtoField4(1, "uint32")
    })
  });
  Oidb2.GetGroupFileReq = ProtoMessage4.of({
    download: ProtoField4(3, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32"),
      busId: ProtoField4(3, "uint32"),
      fileId: ProtoField4(4, "string")
    })
  });
  Oidb2.GetGroupFileResp = ProtoMessage4.of({
    download: ProtoField4(3, {
      retCode: ProtoField4(1, "int64"),
      clientWording: ProtoField4(3, "string"),
      downloadDns: ProtoField4(5, "string"),
      downloadUrl: ProtoField4(6, "bytes")
    })
  });
  Oidb2.GetPrivateFileReq = ProtoMessage4.of({
    subCommand: ProtoField4(1, "uint32"),
    field2: ProtoField4(2, "uint32"),
    body: ProtoField4(14, {
      // 发起者自己的 uid
      receiverUid: ProtoField4(10, "string"),
      fileUuid: ProtoField4(20, "string"),
      type: ProtoField4(30, "uint32"),
      fileHash: ProtoField4(60, "string"),
      t2: ProtoField4(601, "uint32")
    }),
    field101: ProtoField4(101, "uint32"),
    field102: ProtoField4(102, "uint32"),
    field200: ProtoField4(200, "uint32"),
    field99999: ProtoField4(99999, "bytes")
  });
  Oidb2.GetPrivateFileResp = ProtoMessage4.of({
    command: ProtoField4(1, "uint32"),
    subCommand: ProtoField4(2, "uint32"),
    body: ProtoField4(14, {
      retCode: ProtoField4(10, "int64"),
      state: ProtoField4(20, "string"),
      result: ProtoField4(30, {
        extra: ProtoField4(120, {
          field100: ProtoField4(100, "uint32"),
          download: ProtoField4(102, {
            downloadUrl: ProtoField4(8, "bytes"),
            downloadDns: ProtoField4(11, "string")
          })
        })
      }),
      metadata: ProtoField4(40, {
        fileName: ProtoField4(7, "string")
      })
    }),
    field50: ProtoField4(50, "uint32")
  });
  Oidb2.GroupClockInReq = ProtoMessage4.of({
    body: ProtoField4(2, {
      uin: ProtoField4(1, "string"),
      groupCode: ProtoField4(2, "string"),
      appVersion: ProtoField4(3, "string")
    })
  });
  Oidb2.GroupFileReq = ProtoMessage4.of({
    uploadFileReq: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32"),
      busId: ProtoField4(3, "uint32"),
      entrance: ProtoField4(4, "uint32"),
      parentFolderId: ProtoField4(5, "string"),
      fileName: ProtoField4(6, "string"),
      localPath: ProtoField4(7, "string"),
      fileSize: ProtoField4(8, "uint32"),
      sha: ProtoField4(9, "bytes"),
      sha3: ProtoField4(10, "bytes", "optional"),
      md5: ProtoField4(11, "bytes"),
      supportMultiUpload: ProtoField4(12, "bool")
    })
  });
  Oidb2.GroupFileResp = ProtoMessage4.of({
    uploadFileRsp: ProtoField4(1, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string"),
      uploadIp: ProtoField4(4, "string"),
      serverDns: ProtoField4(5, "string"),
      busId: ProtoField4(6, "uint32"),
      fileId: ProtoField4(7, "string"),
      checkKey: ProtoField4(8, "bytes"),
      fileKey: ProtoField4(9, "bytes"),
      fileExist: ProtoField4(10, "bool"),
      uploadIpLanV4: ProtoField4(12, "string", "repeated"),
      uploadIpLanV6: ProtoField4(13, "string", "repeated"),
      uploadPort: ProtoField4(14, "uint32")
    })
  });
  Oidb2.GroupFileFeedReq = ProtoMessage4.of({
    feedsInfoReq: ProtoField4(5, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32"),
      feedsInfoList: ProtoField4(3, {
        busId: ProtoField4(1, "uint32"),
        fileId: ProtoField4(2, "string"),
        msgRandom: ProtoField4(3, "uint32"),
        feedFlag: ProtoField4(5, "uint32")
      }, "repeated")
    })
  });
  Oidb2.GroupFileFeedResp = ProtoMessage4.of({
    feedsInfoRsp: ProtoField4(5, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string"),
      feedsResultList: ProtoField4(4, {
        retCode: ProtoField4(1, "int64"),
        detail: ProtoField4(2, "string"),
        fileId: ProtoField4(3, "string"),
        busId: ProtoField4(4, "uint32"),
        deadTime: ProtoField4(5, "uint32"),
        msgSeq: ProtoField4(6, "uint32")
      }, "repeated"),
      svrBusyWaitTime: ProtoField4(5, "uint32")
    })
  });
  Oidb2.OfflineFileUploadReq = ProtoMessage4.of({
    command: ProtoField4(1, "uint32"),
    seq: ProtoField4(2, "int32"),
    upload: ProtoField4(19, {
      senderUid: ProtoField4(10, "string"),
      receiverUid: ProtoField4(20, "string"),
      fileSize: ProtoField4(30, "uint32"),
      fileName: ProtoField4(40, "string"),
      md510MCheckSum: ProtoField4(50, "bytes"),
      sha1CheckSum: ProtoField4(60, "bytes"),
      localPath: ProtoField4(70, "string"),
      md5CheckSum: ProtoField4(110, "bytes"),
      sha3CheckSum: ProtoField4(120, "bytes")
    }),
    businessId: ProtoField4(101, "int32"),
    clientType: ProtoField4(102, "int32"),
    flagSupportMediaPlatform: ProtoField4(200, "int32")
  });
  Oidb2.OfflineFileUploadResp = ProtoMessage4.of({
    command: ProtoField4(1, "uint32"),
    seq: ProtoField4(2, "int32"),
    upload: ProtoField4(19, {
      retCode: ProtoField4(10, "int32"),
      retMsg: ProtoField4(20, "string"),
      totalSpace: ProtoField4(30, "uint32"),
      usedSpace: ProtoField4(40, "uint32"),
      uploadedSize: ProtoField4(50, "uint32"),
      uploadIp: ProtoField4(60, "string"),
      uploadDomain: ProtoField4(70, "string"),
      uploadPort: ProtoField4(80, "uint32"),
      uuid: ProtoField4(90, "string"),
      uploadKey: ProtoField4(100, "bytes"),
      fileExist: ProtoField4(110, "bool"),
      packSize: ProtoField4(120, "int32"),
      uploadIpList: ProtoField4(130, "string", "repeated"),
      uploadHttpsPort: ProtoField4(140, "int32"),
      uploadHttpsDomain: ProtoField4(150, "string"),
      uploadDns: ProtoField4(160, "string"),
      uploadLanip: ProtoField4(170, "string"),
      fileIdCrc: ProtoField4(200, "string"),
      rtpMediaPlatformUploadAddress: ProtoField4(210, {
        outIp: ProtoField4(1, "uint32"),
        outPort: ProtoField4(2, "uint32"),
        innerIp: ProtoField4(3, "uint32"),
        innerPort: ProtoField4(4, "uint32"),
        ipType: ProtoField4(5, "uint32")
      }, "repeated"),
      mediaPlatformUploadKey: ProtoField4(220, "bytes")
    }),
    businessId: ProtoField4(101, "int32"),
    clientType: ProtoField4(102, "int32"),
    flagSupportMediaPlatform: ProtoField4(200, "int32")
  });
  Oidb2.FetchGroupsReq = ProtoMessage4.of({
    config: ProtoField4(1, {
      config1: ProtoField4(1, {
        groupOwner: ProtoField4(1, "bool"),
        createdTime: ProtoField4(2, "bool"),
        memberMax: ProtoField4(3, "bool"),
        memberCount: ProtoField4(4, "bool"),
        groupName: ProtoField4(5, "bool"),
        topTime: ProtoField4(9, "bool"),
        groupShutupExpireTime: ProtoField4(10, "bool"),
        description: ProtoField4(18, "bool"),
        question: ProtoField4(19, "bool"),
        richDescription: ProtoField4(21, "bool"),
        announcement: ProtoField4(30, "bool")
      }),
      config2: ProtoField4(2, {
        memberRole: ProtoField4(2, "bool"),
        remark: ProtoField4(3, "bool"),
        personShutupExpireTime: ProtoField4(4, "bool"),
        msgMask: ProtoField4(7, "bool")
      })
    })
  });
  Oidb2.FetchGroupsResp = ProtoMessage4.of({
    groups: ProtoField4(2, {
      groupCode: ProtoField4(3, "uint32"),
      info: ProtoField4(4, {
        groupOwner: ProtoField4(1, {
          uid: ProtoField4(2, "string")
        }),
        createdTime: ProtoField4(2, "uint32"),
        memberMax: ProtoField4(3, "uint32"),
        memberCount: ProtoField4(4, "uint32"),
        groupName: ProtoField4(5, "string"),
        topTime: ProtoField4(9, "uint32", "optional"),
        groupShutupExpireTime: ProtoField4(10, "uint32", "optional"),
        description: ProtoField4(18, "string", "optional"),
        question: ProtoField4(19, "string", "optional"),
        richDescription: ProtoField4(21, "string", "optional"),
        announcement: ProtoField4(30, "string", "optional")
      }),
      personInfo: ProtoField4(5, {
        memberRole: ProtoField4(2, "uint32"),
        remark: ProtoField4(3, "string", "optional"),
        personShutupExpireTime: ProtoField4(4, "uint32", "optional"),
        msgMask: ProtoField4(7, "uint32")
      })
    }, "repeated")
  });
  Oidb2.GetGroupFileListReq = ProtoMessage4.of({
    listReq: ProtoField4(2, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32"),
      targetDirectory: ProtoField4(3, "string"),
      fileCount: ProtoField4(5, "uint32"),
      sortBy: ProtoField4(9, "uint32"),
      startIndex: ProtoField4(13, "uint32"),
      field17: ProtoField4(17, "uint32"),
      field18: ProtoField4(18, "uint32")
    })
  });
  Oidb2.GetGroupFileListRespItem = ProtoMessage4.of({
    type: ProtoField4(1, "uint32"),
    folderInfo: ProtoField4(2, {
      folderId: ProtoField4(1, "string"),
      parentFolderId: ProtoField4(2, "string"),
      folderName: ProtoField4(3, "string"),
      createTime: ProtoField4(4, "uint32"),
      modifyTime: ProtoField4(5, "uint32"),
      createUin: ProtoField4(6, "uint32"),
      creatorName: ProtoField4(7, "string"),
      totalFileCount: ProtoField4(8, "uint32"),
      modifyUin: ProtoField4(9, "uint32"),
      modifyName: ProtoField4(10, "string"),
      usedSpace: ProtoField4(11, "uint32")
    }, "optional"),
    fileInfo: ProtoField4(3, {
      fileId: ProtoField4(1, "string"),
      fileName: ProtoField4(2, "string"),
      fileSize: ProtoField4(3, "uint32"),
      busId: ProtoField4(4, "uint32"),
      uploadedSize: ProtoField4(5, "uint32"),
      uploadedTime: ProtoField4(6, "uint32"),
      expireTime: ProtoField4(7, "uint32"),
      modifiedTime: ProtoField4(8, "uint32"),
      downloadedTimes: ProtoField4(9, "uint32"),
      fileSha1: ProtoField4(10, "bytes"),
      fileMd5: ProtoField4(12, "bytes"),
      uploaderName: ProtoField4(14, "string"),
      uploaderUin: ProtoField4(15, "uint32"),
      parentDirectory: ProtoField4(16, "string"),
      field17: ProtoField4(17, "uint32"),
      field22: ProtoField4(22, "string")
    }, "optional")
  });
  Oidb2.GetGroupFileListResp = ProtoMessage4.of({
    listResp: ProtoField4(2, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string"),
      isEnd: ProtoField4(4, "bool"),
      items: ProtoField4(5, Oidb2.GetGroupFileListRespItem, "repeated"),
      allFileCount: ProtoField4(7, "uint32"),
      nextIndex: ProtoField4(13, "uint32")
    })
  });
  Oidb2.GetGroupFileCountReq = ProtoMessage4.of({
    countReq: ProtoField4(3, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32"),
      busId: ProtoField4(3, "uint32")
    })
  });
  Oidb2.GetGroupFileCountResp = ProtoMessage4.of({
    countResp: ProtoField4(3, {
      fileCount: ProtoField4(4, "uint32"),
      limitCount: ProtoField4(6, "uint32"),
      isFull: ProtoField4(7, "bool")
    })
  });
  Oidb2.GetGroupFileSpaceReq = ProtoMessage4.of({
    spaceReq: ProtoField4(4, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32")
    })
  });
  Oidb2.GetGroupFileSpaceResp = ProtoMessage4.of({
    spaceResp: ProtoField4(4, {
      totalSpace: ProtoField4(4, "uint64"),
      usedSpace: ProtoField4(5, "uint64")
    })
  });
  Oidb2.ImageOcrReq = ProtoMessage4.of({
    version: ProtoField4(1, "uint32"),
    client: ProtoField4(2, "uint32"),
    entrance: ProtoField4(3, "uint32"),
    ocrReqBody: ProtoField4(10, {
      imageUrl: ProtoField4(1, "string"),
      languageType: ProtoField4(2, "uint32"),
      scene: ProtoField4(3, "uint32"),
      originMd5: ProtoField4(10, "string"),
      afterCompressMd5: ProtoField4(11, "string"),
      afterCompressFileSize: ProtoField4(12, "string"),
      afterCompressWeight: ProtoField4(13, "string"),
      afterCompressHeight: ProtoField4(14, "string"),
      isCut: ProtoField4(15, "bool")
    })
  });
  Oidb2.ImageOcrResp = ProtoMessage4.of({
    retCode: ProtoField4(1, "int32", "optional"),
    errMsg: ProtoField4(2, "string"),
    wording: ProtoField4(3, "string", "optional"),
    ocrRspBody: ProtoField4(10, {
      textDetections: ProtoField4(1, {
        detectedText: ProtoField4(1, "string"),
        confidence: ProtoField4(2, "uint32"),
        polygon: ProtoField4(3, {
          coordinates: ProtoField4(1, {
            x: ProtoField4(1, "int32"),
            y: ProtoField4(2, "int32")
          }, "repeated")
        }),
        advancedInfo: ProtoField4(4, "string")
      }, "repeated"),
      language: ProtoField4(2, "string"),
      requestId: ProtoField4(3, "string"),
      ocrLanguageList: ProtoField4(101, "string", "repeated"),
      dstTranslateLanguageList: ProtoField4(102, "string", "repeated"),
      languageList: ProtoField4(103, {
        languageCode: ProtoField4(1, "string"),
        languageDesc: ProtoField4(2, "string")
      }, "repeated"),
      afterCompressWeight: ProtoField4(111, "uint32"),
      afterCompressHeight: ProtoField4(112, "uint32")
    })
  });
  Oidb2.SetFriendRequestReq = ProtoMessage4.of({
    accept: ProtoField4(1, "uint32"),
    targetUid: ProtoField4(2, "string")
  });
  Oidb2.SetFilteredFriendRequestReq = ProtoMessage4.of({
    selfUid: ProtoField4(1, "string"),
    requestUid: ProtoField4(2, "string")
  });
  Oidb2.IncPullReq = ProtoMessage4.of({
    reqCount: ProtoField4(2, "uint32"),
    time: ProtoField4(3, "uint32"),
    localSeq: ProtoField4(4, "uint32"),
    cookie: ProtoField4(5, "bytes", "optional"),
    flag: ProtoField4(6, "int32"),
    proxySeq: ProtoField4(7, "uint32"),
    requestBiz: ProtoField4(10001, {
      bizType: ProtoField4(1, "int32"),
      bizData: ProtoField4(2, {
        extBusi: ProtoField4(1, "int32", "repeated")
      })
    }, "repeated"),
    extSnsFlagKey: ProtoField4(10002, "uint32", "repeated"),
    extPrivateIdListKey: ProtoField4(10003, "uint32", "repeated")
  });
  Oidb2.IncPullResp = ProtoMessage4.of({
    seq: ProtoField4(1, "uint32"),
    cookie: ProtoField4(2, "bytes", "optional"),
    isEnd: ProtoField4(3, "bool"),
    time: ProtoField4(6, "uint32"),
    selfUin: ProtoField4(7, "uint32"),
    smallSeq: ProtoField4(8, "uint32"),
    friendList: ProtoField4(101, {
      uid: ProtoField4(1, "string"),
      categoryId: ProtoField4(2, "int32"),
      uin: ProtoField4(3, "uint32"),
      subBiz: ProtoField4(10001, ["int32", {
        numData: ProtoField4(1, ["int32", "int32"]),
        data: ProtoField4(2, ["int32", "bytes"])
      }])
    }, "repeated"),
    category: ProtoField4(102, {
      categoryId: ProtoField4(1, "int32"),
      categoryName: ProtoField4(2, "string"),
      categoryMemberCount: ProtoField4(3, "int32"),
      categorySortId: ProtoField4(4, "int32")
    }, "repeated")
  });
  Oidb2.FetchPinsResp = ProtoMessage4.of({
    friends: ProtoField4(1, {
      uid: ProtoField4(1, "string")
    }, "repeated"),
    groups: ProtoField4(3, {
      groupCode: ProtoField4(1, "uint32")
    }, "repeated")
  });
  Oidb2.GetFriendRecommendContactArkReq = ProtoMessage4.of({
    uin: ProtoField4(1, "uint32"),
    phoneNumber: ProtoField4(2, "string"),
    jumpUrl: ProtoField4(3, "string")
  });
  Oidb2.GetFriendRecommendContactArkResp = ProtoMessage4.of({
    ark: ProtoField4(1, "string")
  });
  Oidb2.SetFriendRemarkReq = ProtoMessage4.of({
    uid: ProtoField4(1, "string"),
    remark: ProtoField4(2, "string")
  });
  Oidb2.DeleteFriendReq = ProtoMessage4.of({
    field1: ProtoField4(1, {
      targetUid: ProtoField4(1, "string"),
      field2: ProtoField4(2, {
        field1: ProtoField4(1, "uint32"),
        field2: ProtoField4(2, "uint32"),
        field3: ProtoField4(3, {
          field1: ProtoField4(1, "uint32"),
          field2: ProtoField4(2, "uint32"),
          field3: ProtoField4(3, "uint32")
        })
      }),
      block: ProtoField4(3, "bool"),
      bothDelete: ProtoField4(4, "bool")
    })
  });
  Oidb2.SetFriendCategoryReq = ProtoMessage4.of({
    uid: ProtoField4(1, "string"),
    categoryId: ProtoField4(2, "uint32")
  });
  Oidb2.FetchFriendRequestsReq = ProtoMessage4.of({
    version: ProtoField4(1, "int32"),
    type: ProtoField4(3, "int32"),
    selfUid: ProtoField4(4, "string"),
    startIndex: ProtoField4(5, "int32"),
    reqNum: ProtoField4(6, "int32"),
    getFlag: ProtoField4(8, "int32"),
    startTime: ProtoField4(9, "int32"),
    needCommFriend: ProtoField4(12, "int32"),
    field22: ProtoField4(22, "int32")
  });
  Oidb2.FetchFriendRequestsResp = ProtoMessage4.of({
    field1: ProtoField4(1, "int32"),
    field2: ProtoField4(2, "int32"),
    info: ProtoField4(3, {
      field2: ProtoField4(2, "int32"),
      count: ProtoField4(3, "int32"),
      requests: ProtoField4(7, {
        selfUid: ProtoField4(1, "string"),
        friendUid: ProtoField4(2, "string"),
        state: ProtoField4(3, "int32"),
        timestamp: ProtoField4(4, "uint32"),
        comment: ProtoField4(5, "string"),
        source: ProtoField4(6, "string"),
        sourceId: ProtoField4(7, "int32"),
        subSourceId: ProtoField4(8, "int32"),
        isInitiator: ProtoField4(20, "bool")
      }, "repeated")
    })
  });
  Oidb2.FetchFilteredFriendRequestsReq = ProtoMessage4.of({
    field1: ProtoField4(1, "int32"),
    field2: ProtoField4(2, {
      count: ProtoField4(1, "int32")
    })
  });
  Oidb2.FetchFilteredFriendRequestsResp = ProtoMessage4.of({
    info: ProtoField4(2, {
      requests: ProtoField4(1, {
        sourceUid: ProtoField4(1, "string"),
        sourceNickname: ProtoField4(2, "string"),
        comment: ProtoField4(5, "string"),
        source: ProtoField4(6, "string"),
        warningInfo: ProtoField4(7, "string"),
        timestamp: ProtoField4(8, "uint32"),
        groupCode: ProtoField4(9, "uint32")
      }, "repeated")
    })
  });
  Oidb2.SetFriendPinReq = ProtoMessage4.of({
    field1: ProtoField4(1, "uint32"),
    info: ProtoField4(2, {
      friendUid: ProtoField4(1, "string"),
      field400: ProtoField4(400, {
        field1: ProtoField4(1, "uint32"),
        timestamp: ProtoField4(2, "bytes")
      })
    }),
    field3: ProtoField4(3, "uint32")
  });
  Oidb2.SetGroupPinReq = ProtoMessage4.of({
    field1: ProtoField4(1, "uint32"),
    info: ProtoField4(2, {
      groupCode: ProtoField4(2, "uint32"),
      field400: ProtoField4(400, {
        field1: ProtoField4(1, "uint32"),
        timestamp: ProtoField4(2, "bytes")
      })
    }),
    field3: ProtoField4(3, "uint32")
  });
  Oidb2.FetchGroupReq = ProtoMessage4.of({
    random: ProtoField4(1, "uint32"),
    config: ProtoField4(2, {
      groupCode: ProtoField4(1, "uint32"),
      flags: ProtoField4(2, {
        ownerUid: ProtoField4(1, "bool"),
        groupCreateTime: ProtoField4(2, "bool"),
        maxMemberNum: ProtoField4(5, "bool"),
        memberNum: ProtoField4(6, "bool"),
        groupName: ProtoField4(15, "string"),
        question: ProtoField4(24, "string"),
        description: ProtoField4(40, "string"),
        shutUpMeTimestamp: ProtoField4(46, "bool"),
        richGroupName: ProtoField4(89, "string")
      })
    })
  });
  Oidb2.FetchGroupResp = ProtoMessage4.of({
    info: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      results: ProtoField4(3, {
        ownerUid: ProtoField4(1, "string"),
        groupCreateTime: ProtoField4(2, "uint32"),
        maxMemberNum: ProtoField4(5, "uint32"),
        memberNum: ProtoField4(6, "uint32"),
        groupName: ProtoField4(15, "string"),
        question: ProtoField4(24, "string"),
        description: ProtoField4(40, "string", "optional"),
        shutUpMeTimestamp: ProtoField4(46, "uint32"),
        richGroupName: ProtoField4(89, "string", "optional")
      })
    })
  });
  Oidb2.KickMemberReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    kickUids: ProtoField4(3, "string", "repeated"),
    rejectSubsequentRequests: ProtoField4(4, "bool"),
    reason: ProtoField4(5, "string", "optional")
  });
  Oidb2.MuteMemberReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    memCount: ProtoField4(2, "uint32"),
    memList: ProtoField4(3, {
      uid: ProtoField4(1, "string"),
      duration: ProtoField4(2, "uint32")
    }, "repeated")
  });
  Oidb2.MuteAllMembersReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    body: ProtoField4(2, {
      duration: ProtoField4(17, "uint32")
    })
  });
  Oidb2.SetGroupNameReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    body: ProtoField4(2, {
      name: ProtoField4(3, "string")
    })
  });
  Oidb2.SetMemberCardReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    body: ProtoField4(3, {
      targetUid: ProtoField4(1, "string"),
      card: ProtoField4(8, "string")
    }, "repeated")
  });
  Oidb2.LeaveGroupReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32")
  });
  Oidb2.HandleGroupRequestReq = ProtoMessage4.of({
    operation: ProtoField4(1, "uint32"),
    body: ProtoField4(2, {
      sequence: ProtoField4(1, "uint64"),
      eventType: ProtoField4(2, "uint32"),
      groupCode: ProtoField4(3, "uint32"),
      message: ProtoField4(4, "string")
    })
  });
  Oidb2.SetMemberAdminReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    memberUid: ProtoField4(2, "string"),
    isSet: ProtoField4(3, "bool")
  });
  Oidb2.GroupEssenceReq = ProtoMessage4.of({
    groupCode: ProtoField4(1, "uint32"),
    msgSequence: ProtoField4(2, "uint32"),
    msgRandom: ProtoField4(3, "uint32")
  });
  Oidb2.GroupEssenceResp = ProtoMessage4.of({
    retMsg: ProtoField4(1, "string"),
    retCode: ProtoField4(10, "uint32")
  });
  Oidb2.GroupReactionReq = ProtoMessage4.of({
    groupCode: ProtoField4(2, "uint32"),
    sequence: ProtoField4(3, "uint32"),
    code: ProtoField4(4, "string"),
    type: ProtoField4(5, "uint32")
  });
  Oidb2.FetchCookiesReq = ProtoMessage4.of({
    domain: ProtoField4(1, "string", "repeated")
  });
  Oidb2.FetchCookiesResp = ProtoMessage4.of({
    psKeys: ProtoField4(1, ["string", "string"]),
    keyType: ProtoField4(2, "int32"),
    clientKey: ProtoField4(3, "string"),
    expiration: ProtoField4(4, "uint32")
  });
  Oidb2.FetchGroupNotifiesReq = ProtoMessage4.of({
    count: ProtoField4(1, "uint32"),
    startSequence: ProtoField4(2, "uint64", "optional")
  });
  Oidb2.FetchGroupNotifiesResp = ProtoMessage4.of({
    requests: ProtoField4(1, {
      sequence: ProtoField4(1, "uint64"),
      type: ProtoField4(2, "uint32"),
      requestState: ProtoField4(3, "uint32"),
      group: ProtoField4(4, {
        groupCode: ProtoField4(1, "uint32"),
        groupName: ProtoField4(2, "string")
      }),
      user1: ProtoField4(5, {
        uid: ProtoField4(1, "string"),
        nickName: ProtoField4(2, "string")
      }),
      user2: ProtoField4(6, {
        uid: ProtoField4(1, "string"),
        nickName: ProtoField4(2, "string")
      }, "optional"),
      user3: ProtoField4(7, {
        uid: ProtoField4(1, "string"),
        nickName: ProtoField4(2, "string")
      }, "optional"),
      time: ProtoField4(8, "uint32", "optional"),
      comment: ProtoField4(10, "string", "optional")
    }, "repeated"),
    newLatestSequence: ProtoField4(3, "uint64", "optional")
  });
  Oidb2.FriendLikeReq = ProtoMessage4.of({
    targetUid: ProtoField4(11, "string"),
    field2: ProtoField4(12, "uint32"),
    // 固定 71
    count: ProtoField4(13, "uint32")
  });
  Oidb2.GroupFileDeleteReq = ProtoMessage4.of({
    delete: ProtoField4(4, {
      groupCode: ProtoField4(1, "uint32"),
      busId: ProtoField4(3, "uint32"),
      // 102
      fileId: ProtoField4(5, "string")
    })
  });
  Oidb2.GroupFileDeleteResp = ProtoMessage4.of({
    delete: ProtoField4(4, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string")
    })
  });
  Oidb2.GroupFileMoveReq = ProtoMessage4.of({
    move: ProtoField4(6, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32"),
      // 7
      busId: ProtoField4(3, "uint32"),
      // 102
      fileId: ProtoField4(4, "string"),
      parentDirectory: ProtoField4(5, "string"),
      targetDirectory: ProtoField4(6, "string")
    })
  });
  Oidb2.GroupFileMoveResp = ProtoMessage4.of({
    move: ProtoField4(6, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string")
    })
  });
  Oidb2.GroupRemarkReq = ProtoMessage4.of({
    body: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      targetRemark: ProtoField4(3, "string")
    })
  });
  Oidb2.GroupFolderCreateReq = ProtoMessage4.of({
    create: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      rootDirectory: ProtoField4(3, "string"),
      // 父目录 id，根 "/"
      folderName: ProtoField4(4, "string")
    })
  });
  Oidb2.GroupFolderCreateResp = ProtoMessage4.of({
    create: ProtoField4(1, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string"),
      folderInfo: ProtoField4(4, {
        folderId: ProtoField4(1, "string"),
        folderPath: ProtoField4(2, "string"),
        folderName: ProtoField4(3, "string")
      })
    })
  });
  Oidb2.GroupFolderDeleteReq = ProtoMessage4.of({
    delete: ProtoField4(2, {
      groupCode: ProtoField4(1, "uint32"),
      folderId: ProtoField4(3, "string")
    })
  });
  Oidb2.GroupFolderDeleteResp = ProtoMessage4.of({
    delete: ProtoField4(2, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string")
    })
  });
  Oidb2.GroupFolderRenameReq = ProtoMessage4.of({
    rename: ProtoField4(3, {
      groupCode: ProtoField4(1, "uint32"),
      folderId: ProtoField4(3, "string"),
      newFolderName: ProtoField4(4, "string")
    })
  });
  Oidb2.GroupFolderRenameResp = ProtoMessage4.of({
    rename: ProtoField4(3, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string")
    })
  });
  Oidb2.GetGroupRecommendContactArkReq = ProtoMessage4.of({
    field1: ProtoField4(1, "uint32"),
    groupCode: ProtoField4(2, "uint32"),
    field5: ProtoField4(5, "uint32")
  });
  Oidb2.GetGroupRecommendContactArkResp = ProtoMessage4.of({
    ark: ProtoField4(5, "string")
  });
  Oidb2.SetGroupMsgMaskReq = ProtoMessage4.of({
    body: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      setting: ProtoField4(2, {
        selfUid: ProtoField4(1, "string"),
        msgMask: ProtoField4(4, "uint32")
      }),
      field3: ProtoField4(3, "uint32"),
      field4: ProtoField4(4, "uint32")
    })
  });
  Oidb2.SetGroupMsgMaskResp = ProtoMessage4.of({
    body: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      errCode: ProtoField4(2, "uint32")
    })
  });
  Oidb2.TransGroupFileReq = ProtoMessage4.of({
    body: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      busId: ProtoField4(3, "uint32"),
      fileId: ProtoField4(4, "string")
    })
  });
  Oidb2.TransGroupFileResp = ProtoMessage4.of({
    retCode: ProtoField4(1, "int64"),
    retMsg: ProtoField4(2, "string"),
    clientWording: ProtoField4(3, "string")
  });
  Oidb2.FetchProfileLikeReq = ProtoMessage4.of({
    selfUid: ProtoField4(1, "string"),
    field2: ProtoField4(2, "uint32"),
    field3: ProtoField4(3, "uint32"),
    // 0=我点赞过的, 1=赞过我的
    field4: ProtoField4(4, "uint32"),
    field101: ProtoField4(101, "uint32"),
    start: ProtoField4(102, "int64"),
    count: ProtoField4(103, "uint32")
  });
  Oidb2.FetchProfileLikeResp = ProtoMessage4.of({
    userLikeInfo: ProtoField4(1, {
      targetUid: ProtoField4(1, "string"),
      field2: ProtoField4(2, "uint32"),
      favoriteInfo: ProtoField4(3, {
        users: ProtoField4(4, {
          uid: ProtoField4(1, "string"),
          src: ProtoField4(2, "uint32"),
          latestTime: ProtoField4(3, "uint32"),
          count: ProtoField4(4, "uint32"),
          giftCount: ProtoField4(5, "uint32"),
          customId: ProtoField4(6, "uint32"),
          lastCharged: ProtoField4(8, "uint32"),
          bTodayVotedCnt: ProtoField4(22, "uint32"),
          nick: ProtoField4(101, "string"),
          gender: ProtoField4(102, "uint32"),
          age: ProtoField4(103, "uint32"),
          isvip: ProtoField4(105, "bool"),
          isSvip: ProtoField4(106, "bool")
        }, "repeated")
      }),
      voteInfo: ProtoField4(4, {
        totalCount: ProtoField4(1, "uint32"),
        users: ProtoField4(5, {
          uid: ProtoField4(1, "string"),
          src: ProtoField4(2, "uint32"),
          latestTime: ProtoField4(3, "uint32"),
          count: ProtoField4(4, "uint32"),
          giftCount: ProtoField4(5, "uint32"),
          customId: ProtoField4(6, "uint32"),
          lastCharged: ProtoField4(8, "uint32"),
          bTodayVotedCnt: ProtoField4(22, "uint32"),
          nick: ProtoField4(101, "string"),
          gender: ProtoField4(102, "uint32"),
          age: ProtoField4(103, "uint32"),
          isvip: ProtoField4(105, "bool"),
          isSvip: ProtoField4(106, "bool")
        }, "repeated")
      })
    }),
    start: ProtoField4(101, "uint32")
  });
  Oidb2.FetchProfileLikeCountReq = ProtoMessage4.of({
    uid: ProtoField4(1, "string")
  });
  Oidb2.FetchProfileLikeCountResp = ProtoMessage4.of({
    body: ProtoField4(1, {
      voteInfo: ProtoField4(4, {
        totalCount: ProtoField4(1, "uint32")
      })
    })
  });
  Oidb2.RenameGroupFileReq = ProtoMessage4.of({
    rename: ProtoField4(5, {
      groupCode: ProtoField4(1, "uint32"),
      busId: ProtoField4(3, "uint32"),
      fileId: ProtoField4(4, "string"),
      parentDirectory: ProtoField4(5, "string"),
      newFileName: ProtoField4(6, "string")
    })
  });
  Oidb2.RenameGroupFileResp = ProtoMessage4.of({
    rename: ProtoField4(5, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string")
    })
  });
  Oidb2.ModifySelfProfileReq = ProtoMessage4.of({
    selfUin: ProtoField4(1, "uint32"),
    bytesProperties: ProtoField4(2, {
      key: ProtoField4(1, "uint32"),
      value: ProtoField4(2, "bytes")
    }, "repeated"),
    numberProperties: ProtoField4(3, {
      key: ProtoField4(1, "uint32"),
      value: ProtoField4(2, "uint32")
    }, "repeated")
  });
  Oidb2.FetchEmojiLikesReq = ProtoMessage4.of({
    groupCode: ProtoField4(2, "uint32"),
    msgSeq: ProtoField4(3, "uint32"),
    chatType: ProtoField4(4, "uint32"),
    emojiCode: ProtoField4(5, "string"),
    cookie: ProtoField4(6, "string"),
    field7: ProtoField4(7, "uint32"),
    count: ProtoField4(8, "uint32")
  });
  Oidb2.FetchEmojiLikesResp = ProtoMessage4.of({
    users: ProtoField4(1, {
      uin: ProtoField4(1, "uint32")
    }, "repeated"),
    cookie: ProtoField4(2, "string"),
    isLastPage: ProtoField4(3, "bool"),
    isFirstPage: ProtoField4(4, "bool")
  });
  Oidb2.FlashFileSetIdByCodeReq = ProtoMessage4.of({
    code: ProtoField4(1, "string")
  });
  Oidb2.FlashFileSetIdByCodeResp = ProtoMessage4.of({
    fileSetId: ProtoField4(1, "string")
  });
  Oidb2.FlashFileInfoReq = ProtoMessage4.of({
    fileSetId: ProtoField4(1, "string"),
    field2: ProtoField4(2, "uint32")
  });
  const FlashFileShareLink = ProtoMessage4.of({
    url: ProtoField4(1, "string")
  });
  Oidb2.FlashFileInfoResp = ProtoMessage4.of({
    info: ProtoField4(1, {
      fileSetId: ProtoField4(1, "string"),
      title: ProtoField4(2, "string"),
      subtitle: ProtoField4(3, "string"),
      field4: ProtoField4(4, "uint32"),
      totalSize: ProtoField4(5, "uint32"),
      shareInfo: ProtoField4(8, FlashFileShareLink, "optional"),
      field11: ProtoField4(11, "uint32"),
      createTime: ProtoField4(13, "uint32"),
      expireTime: ProtoField4(14, "uint32")
    }, "optional")
  });
  Oidb2.FlashFileListReq = ProtoMessage4.of({
    fileSetId: ProtoField4(1, "string"),
    paging: ProtoField4(2, {
      cookie: ProtoField4(1, "bytes"),
      field2: ProtoField4(2, "uint32"),
      count: ProtoField4(3, "uint32"),
      field4: ProtoField4(4, "bytes"),
      flags1: ProtoField4(5, {
        field1: ProtoField4(1, "uint32")
      }),
      flags2: ProtoField4(6, {
        field1: ProtoField4(1, "uint32"),
        field2: ProtoField4(2, "uint32")
      })
    }),
    field3: ProtoField4(3, "uint32"),
    field4: ProtoField4(4, "uint32")
  });
  const FlashFileEntry = ProtoMessage4.of({
    fileSetId: ProtoField4(1, "string"),
    fileUuid: ProtoField4(2, "string"),
    field5: ProtoField4(5, "uint32"),
    field6: ProtoField4(6, "uint32"),
    fileTypeFlag: ProtoField4(7, "uint32"),
    // = 11，跟 registerFlashFile.field7 一致
    name: ProtoField4(8, "string"),
    name2: ProtoField4(9, "string"),
    fileSize: ProtoField4(11, "uint32"),
    // list 请求 f3=2 时才返回
    downloadToken: ProtoField4(13, {
      // 可以当 0x12a9_200 的 fileId, 跟 historyToken 是同一份 token 的不同长度版本
      token: ProtoField4(1, "string"),
      tokenWithKind: ProtoField4(2, {
        kind: ProtoField4(1, "uint32"),
        // = 2 (host kind)
        // 在 Windows QQ session 下这里会带完整 download URL；Linux QQ session 只返 token
        token: ProtoField4(2, "string")
      }),
      sha1Hex: ProtoField4(3, "string"),
      field4: ProtoField4(4, "uint32"),
      md5Hex: ProtoField4(5, "string"),
      field6: ProtoField4(6, "uint32"),
      field7: ProtoField4(7, "uint32")
    }, "optional"),
    // commit token, 0x12a9_200 实际认的 fileId
    historyToken: ProtoField4(14, {
      token: ProtoField4(1, "string"),
      field3: ProtoField4(3, "uint32")
    }, "optional"),
    fileUuid2: ProtoField4(15, "string"),
    field18: ProtoField4(18, "uint32"),
    sha1Hex: ProtoField4(20, "string"),
    fileSize2: ProtoField4(21, "uint32"),
    md5Hex: ProtoField4(25, "string")
  });
  Oidb2.FlashFileListResp = ProtoMessage4.of({
    result: ProtoField4(1, {
      field2: ProtoField4(2, "uint32"),
      files: ProtoField4(3, FlashFileEntry, "repeated")
    }, "optional")
  });
  Oidb2.FlashFileGetFileInfoReq = ProtoMessage4.of({
    fileUuid: ProtoField4(1, "string"),
    fileSetId: ProtoField4(2, "string"),
    field3: ProtoField4(3, "uint32")
  });
  Oidb2.FlashFileGetFileInfoResp = ProtoMessage4.of({
    wrap: ProtoField4(1, {
      fileUuid: ProtoField4(1, "string"),
      file: ProtoField4(2, FlashFileEntry, "optional")
    }, "optional")
  });
  Oidb2.FlashFileDownloadReq = ProtoMessage4.of({
    fileSetId: ProtoField4(1, "string"),
    sceneType: ProtoField4(2, "uint32")
  });
  Oidb2.CreateFlashFileSetReq = ProtoMessage4.of({
    totalFileCount: ProtoField4(1, "uint32"),
    meta: ProtoField4(2, {
      title: ProtoField4(2, "string"),
      subtitle: ProtoField4(3, "string"),
      field4: ProtoField4(4, "uint32"),
      totalFileSize: ProtoField4(5, "uint32"),
      uploader: ProtoField4(10, {
        uin: ProtoField4(1, "string"),
        nickname: ProtoField4(2, "string"),
        uid: ProtoField4(3, "string"),
        field4: ProtoField4(4, "bytes")
      }),
      field16: ProtoField4(16, "uint32"),
      field20: ProtoField4(20, "uint32"),
      field21: ProtoField4(21, "uint32"),
      field23: ProtoField4(23, "uint32"),
      // 少了会被 prepFlashFileSet 拒 (100200)
      field24: ProtoField4(24, {
        field2: ProtoField4(2, "uint32"),
        field3: ProtoField4(3, "bytes")
      }, "optional")
    }),
    field3: ProtoField4(3, "uint32"),
    field12: ProtoField4(12, "uint32")
  });
  Oidb2.CreateFlashFileSetResp = ProtoMessage4.of({
    fileSetId: ProtoField4(1, "string"),
    fileSetIdEcho: ProtoField4(2, "string"),
    shareLink: ProtoField4(3, "string"),
    expireTime: ProtoField4(4, "uint32"),
    expireLeftTime: ProtoField4(5, "uint32")
  });
  Oidb2.RegisterFlashFileReq = ProtoMessage4.of({
    field1: ProtoField4(1, "uint32"),
    fileSetId: ProtoField4(2, "string"),
    fileSetIdEcho: ProtoField4(3, "string"),
    file: ProtoField4(4, {
      fileSetId: ProtoField4(1, "string"),
      fileUuid: ProtoField4(2, "string"),
      field3: ProtoField4(3, "uint32"),
      field4: ProtoField4(4, "bytes"),
      field5: ProtoField4(5, "uint32"),
      field6: ProtoField4(6, "uint32"),
      field7: ProtoField4(7, "uint32"),
      name: ProtoField4(8, "string"),
      name2: ProtoField4(9, "string"),
      field10: ProtoField4(10, "uint32"),
      fileSize: ProtoField4(11, "uint32"),
      field12: ProtoField4(12, "uint32"),
      // 必传 (hex string), 不然之后 list 拿不到 sha1 / md5 / historyToken
      sha1Hex: ProtoField4(20, "string", "optional"),
      field24: ProtoField4(24, "bytes", "optional"),
      md5Hex: ProtoField4(25, "string", "optional")
    }),
    // 抓包外层 body 顺序: f5=1, f6=1（没有 f12，f12 是 OIDB Base 的 isReserved）
    field5: ProtoField4(5, "uint32"),
    field6: ProtoField4(6, "uint32")
  });
  Oidb2.PrepFlashFileSetReq = ProtoMessage4.of({
    fileSetId: ProtoField4(1, "string"),
    field2: ProtoField4(2, "bytes")
  });
  Oidb2.FlashFileUploadPreReq = ProtoMessage4.of({
    head: ProtoField4(1, {
      common: ProtoField4(1, {
        requestId: ProtoField4(1, "uint32"),
        command: ProtoField4(2, "uint32")
      }),
      scene: ProtoField4(2, {
        requestType: ProtoField4(101, "uint32"),
        // 2
        businessType: ProtoField4(102, "uint32"),
        // 4 (flash file)
        field103: ProtoField4(103, "uint32"),
        sceneType: ProtoField4(200, "uint32")
        // 5
      }),
      client: ProtoField4(3, {
        agentType: ProtoField4(1, "uint32")
        // 1
      })
    }),
    upload: ProtoField4(2, {
      uploadInfo: ProtoField4(1, {
        fileInfo: ProtoField4(1, {
          fileSize: ProtoField4(1, "uint32"),
          md5: ProtoField4(2, "bytes"),
          sha1: ProtoField4(3, "string"),
          name: ProtoField4(4, "string"),
          fileType: ProtoField4(5, {
            field1: ProtoField4(1, "uint32"),
            field2: ProtoField4(2, "uint32"),
            field3: ProtoField4(3, "uint32"),
            field4: ProtoField4(4, "uint32")
          }),
          width: ProtoField4(6, "uint32"),
          height: ProtoField4(7, "uint32"),
          field8: ProtoField4(8, "uint32"),
          field9: ProtoField4(9, "uint32")
        }),
        subFileType: ProtoField4(2, "uint32")
      }),
      tryFastUploadCompleted: ProtoField4(2, "bool"),
      srvSendMsg: ProtoField4(3, "bool"),
      clientRandomId: ProtoField4(4, "uint32"),
      compatQMsgSceneType: ProtoField4(5, "uint32"),
      extBizInfo: ProtoField4(6, {
        field1: ProtoField4(1, {
          field1: ProtoField4(1, "uint32"),
          field2: ProtoField4(2, "bytes")
        }),
        field2: ProtoField4(2, {
          field1: ProtoField4(1, "uint32")
        }, "optional")
      })
    })
  });
  Oidb2.FlashFileUploadCommitReq = ProtoMessage4.of({
    head: ProtoField4(1, {
      common: ProtoField4(1, {
        requestId: ProtoField4(1, "uint32"),
        command: ProtoField4(2, "uint32")
      }),
      scene: ProtoField4(2, {
        requestType: ProtoField4(101, "uint32"),
        businessType: ProtoField4(102, "uint32"),
        field103: ProtoField4(103, "uint32"),
        sceneType: ProtoField4(200, "uint32")
      }),
      client: ProtoField4(3, {
        agentType: ProtoField4(1, "uint32")
      })
    }),
    commit: ProtoField4(12, {
      fileSummary: ProtoField4(1, {
        fileInfo: ProtoField4(1, {
          fileSize: ProtoField4(1, "uint32"),
          md5: ProtoField4(2, "bytes"),
          sha1: ProtoField4(3, "string"),
          name: ProtoField4(4, "string"),
          fileType: ProtoField4(5, {
            field1: ProtoField4(1, "uint32"),
            field2: ProtoField4(2, "uint32"),
            field3: ProtoField4(3, "uint32"),
            field4: ProtoField4(4, "uint32")
          }),
          width: ProtoField4(6, "uint32"),
          height: ProtoField4(7, "uint32"),
          field8: ProtoField4(8, "uint32"),
          field9: ProtoField4(9, "uint32")
        }),
        token: ProtoField4(2, "string"),
        // preflight 返回的 token
        field3: ProtoField4(3, "uint32"),
        time: ProtoField4(4, "uint32"),
        ttl: ProtoField4(5, "uint32"),
        field6: ProtoField4(6, "uint32")
      }),
      field2: ProtoField4(2, {
        field1: ProtoField4(1, "uint32")
      }),
      field3: ProtoField4(3, {
        field1: ProtoField4(1, "uint32"),
        field2: ProtoField4(2, "uint32")
      }),
      // 必传, 不然 commit 照样返回 success, 但 fileset 停在"待上传"。
      // f1=fileSetId f2=fileSetId f3=fileUuid f7=fileTypeFlag(=11)
      target: ProtoField4(10, {
        fileSetId: ProtoField4(1, "string"),
        fileSetId2: ProtoField4(2, "string"),
        fileUuid: ProtoField4(3, "string"),
        field4: ProtoField4(4, "uint32"),
        field5: ProtoField4(5, "uint32"),
        field6: ProtoField4(6, "uint32"),
        fileTypeFlag: ProtoField4(7, "uint32"),
        field8: ProtoField4(8, "bytes"),
        field9: ProtoField4(9, "uint32"),
        field10: ProtoField4(10, "uint32"),
        field11: ProtoField4(11, "uint32"),
        field12: ProtoField4(12, "uint32"),
        field13: ProtoField4(13, "uint32"),
        field14: ProtoField4(14, "uint32")
      })
    })
  });
  Oidb2.FlashFileUploadResp = ProtoMessage4.of({
    head: ProtoField4(1, {
      common: ProtoField4(1, {
        requestId: ProtoField4(1, "uint32"),
        command: ProtoField4(2, "uint32")
      }),
      retCode: ProtoField4(3, "string", "optional")
    }),
    body: ProtoField4(2, {
      uKey: ProtoField4(1, "string", "optional"),
      uKeyTtlSecond: ProtoField4(2, "uint32"),
      // 要走 highway 时是 IPv4 列表, 秒传命中时是 token 和元数据
      fastUploadInfo: ProtoField4(6, {
        summary: ProtoField4(1, {
          fileSummary: ProtoField4(1, {
            fileInfo: ProtoField4(1, {
              fileSize: ProtoField4(1, "uint32"),
              sha1: ProtoField4(3, "string"),
              name: ProtoField4(4, "string"),
              md5: ProtoField4(5, "bytes"),
              width: ProtoField4(6, "uint32"),
              height: ProtoField4(7, "uint32"),
              field9: ProtoField4(9, "uint32")
            }),
            token: ProtoField4(2, "string"),
            field3: ProtoField4(3, "uint32"),
            time: ProtoField4(4, "uint32"),
            ttl: ProtoField4(5, "uint32"),
            field7: ProtoField4(7, "uint32")
          }),
          field5: ProtoField4(5, "uint32")
        })
      }, "optional")
    }, "optional"),
    commitInfo: ProtoField4(12, {
      summary: ProtoField4(1, {
        token: ProtoField4(2, "string"),
        field3: ProtoField4(3, "uint32"),
        time: ProtoField4(4, "uint32"),
        ttl: ProtoField4(5, "uint32")
      }, "optional")
    }, "optional")
  });
  Oidb2.FlashFileDownloadPreReq = ProtoMessage4.of({
    head: ProtoField4(1, {
      common: ProtoField4(1, {
        requestId: ProtoField4(1, "uint32"),
        command: ProtoField4(2, "uint32")
        // 200
      }),
      scene: ProtoField4(2, {
        requestType: ProtoField4(101, "uint32"),
        // 2
        businessType: ProtoField4(102, "uint32"),
        // 4
        field103: ProtoField4(103, "uint32"),
        // 22
        sceneType: ProtoField4(200, "uint32")
        // 5
      }),
      client: ProtoField4(3, {
        agentType: ProtoField4(1, "uint32")
        // 1
      })
    }),
    download: ProtoField4(3, {
      info: ProtoField4(1, {
        fileInfo: ProtoField4(1, {
          fileSize: ProtoField4(1, "uint32"),
          // 0 OK
          md5: ProtoField4(2, "bytes"),
          sha1: ProtoField4(3, "bytes"),
          // 直接是 string, 不像 0x93d0 是嵌套的 {f10: string}; server 不看它, 随便填
          name: ProtoField4(4, "string"),
          fileType: ProtoField4(5, {
            field1: ProtoField4(1, "uint32"),
            field2: ProtoField4(2, "uint32"),
            field3: ProtoField4(3, "uint32"),
            field4: ProtoField4(4, "uint32")
          }),
          width: ProtoField4(6, "uint32"),
          height: ProtoField4(7, "uint32"),
          field8: ProtoField4(8, "uint32"),
          field9: ProtoField4(9, "uint32")
        }),
        // 来自 commit 或 list 的 download.fileId
        fileId: ProtoField4(2, "string"),
        field3: ProtoField4(3, "uint32"),
        field4: ProtoField4(4, "uint32"),
        field5: ProtoField4(5, "uint32"),
        field6: ProtoField4(6, "uint32")
      }),
      clientCaps: ProtoField4(2, {
        // 抓包外层 f2 直接就是 caps body（不是再嵌一层）
        capsBody: ProtoField4(2, {
          field1: ProtoField4(1, "uint32"),
          field3: ProtoField4(3, "uint32"),
          field5: ProtoField4(5, "uint32"),
          field6: ProtoField4(6, {
            field1: ProtoField4(1, "uint32"),
            field2: ProtoField4(2, "bytes"),
            field3: ProtoField4(3, "bytes"),
            field4: ProtoField4(4, "uint32")
          })
        }),
        smallFlag: ProtoField4(4, {
          field1: ProtoField4(1, "uint32")
        }),
        // server 靠这两个定位文件, 不看 download.info.fileId
        target: ProtoField4(10, {
          fileSetId: ProtoField4(1, "string"),
          fileUuid: ProtoField4(2, "string"),
          field3: ProtoField4(3, "uint32"),
          // = 11，跟 registerFlashFile.field7 一样
          fileUuid2: ProtoField4(4, "string")
          // 同 fileUuid
        })
      }),
      // 抓包为 0
      field3: ProtoField4(3, "uint32")
    })
  });
  Oidb2.FlashFileDownloadPreResp = ProtoMessage4.of({
    head: ProtoField4(1, {
      common: ProtoField4(1, {
        requestId: ProtoField4(1, "uint32"),
        command: ProtoField4(2, "uint32")
      }),
      retCode: ProtoField4(3, "string", "optional")
    }),
    body: ProtoField4(3, {
      rkey: ProtoField4(1, "string"),
      // "&rkey=CAQS..."  跟 url 拼一起
      ttl: ProtoField4(2, "uint32"),
      // 通常 3600
      url: ProtoField4(3, {
        host: ProtoField4(1, "string"),
        // multimedia.qfile.qq.com
        path: ProtoField4(2, "string"),
        // /download?appid=...&fileid=...&fldc=...
        port: ProtoField4(3, "uint32")
        // 443
      })
    }, "optional")
  });
  Oidb2.FetchGroupAtAllRemainReq = ProtoMessage4.of({
    subCmd: ProtoField4(1, "uint32"),
    limitIntervalTypeForUin: ProtoField4(2, "uint32"),
    limitIntervalTypeForGroup: ProtoField4(3, "uint32"),
    uin: ProtoField4(4, "uint32"),
    groupCode: ProtoField4(5, "uint32")
  });
  Oidb2.FetchGroupAtAllRemainResp = ProtoMessage4.of({
    canAtAll: ProtoField4(1, "bool"),
    remainAtAllCountForUin: ProtoField4(2, "uint32"),
    remainAtAllCountForGroup: ProtoField4(3, "uint32"),
    atTimesMsg: ProtoField4(4, "string"),
    canNotAtAllMsg: ProtoField4(5, "string", "optional")
  });
  Oidb2.FetchGroupExtraReq = ProtoMessage4.of({
    random: ProtoField4(1, "uint32"),
    config: ProtoField4(2, {
      groupCode: ProtoField4(1, "uint32"),
      flags: ProtoField4(2, {
        latestMessageSeq: ProtoField4(22, "bool")
      })
    })
  });
  Oidb2.FetchGroupExtraResp = ProtoMessage4.of({
    info: ProtoField4(1, {
      groupCode: ProtoField4(1, "uint32"),
      results: ProtoField4(3, {
        latestMessageSeq: ProtoField4(22, "uint32")
      })
    })
  });
  Oidb2.SetInputStatusReq = ProtoMessage4.of({
    body: ProtoField4(1, {
      toUid: ProtoField4(1, "string"),
      field2: ProtoField4(2, "uint32"),
      eventType: ProtoField4(3, "uint32")
    })
  });
  Oidb2.SetInputStatusResp = ProtoMessage4.of({
    body: ProtoField4(1, {
      retCode: ProtoField4(1, "uint32")
    })
  });
  Oidb2.GetFriendsStatusReq = ProtoMessage4.of({
    selfUid: ProtoField4(1, "string"),
    field5: ProtoField4(5, "uint32"),
    field7: ProtoField4(7, "uint32"),
    field100: ProtoField4(100, "uint32"),
    field101: ProtoField4(101, "uint32")
  });
  Oidb2.GetFriendsStatusResp = ProtoMessage4.of({
    list: ProtoField4(5, {
      uid: ProtoField4(1, "string"),
      status: ProtoField4(2, "uint32")
    }, "repeated")
  });
  Oidb2.ForwardGroupFileReq = ProtoMessage4.of({
    copyToReq: ProtoField4(3, {
      groupCode: ProtoField4(1, "uint32"),
      appId: ProtoField4(2, "uint32"),
      srcBusId: ProtoField4(3, "uint32"),
      srcFileId: ProtoField4(4, "string"),
      dstBusId: ProtoField4(5, "uint32"),
      dstUin: ProtoField4(6, "uint32"),
      newFileName: ProtoField4(40, "string"),
      timCloudPdirKey: ProtoField4(100, "bytes"),
      timCloudPpdirKey: ProtoField4(101, "bytes"),
      timCloudExtensionInfo: ProtoField4(102, "bytes"),
      timFileExistOption: ProtoField4(103, "uint32")
    })
  });
  Oidb2.ForwardGroupFileResp = ProtoMessage4.of({
    copyToRsp: ProtoField4(3, {
      retCode: ProtoField4(1, "int64"),
      retMsg: ProtoField4(2, "string"),
      clientWording: ProtoField4(3, "string"),
      saveFilePath: ProtoField4(4, "string"),
      busId: ProtoField4(5, "uint32"),
      fileName: ProtoField4(40, "string")
    })
  });
})(Oidb || (Oidb = {}));

// src/ntqqapi/proto/msg.ts
import { ProtoField as ProtoField5, ProtoMessage as ProtoMessage5 } from "@saltify/typeproto";
var Msg;
((Msg2) => {
  Msg2.VideoFileMsg = ProtoMessage5.of({
    fileUuid: ProtoField5(1, "string", "optional"),
    fileMd5: ProtoField5(2, "bytes", "optional"),
    fileName: ProtoField5(3, "string", "optional"),
    fileFormat: ProtoField5(4, "uint32", "optional"),
    fileTime: ProtoField5(5, "uint32", "optional"),
    fileSize: ProtoField5(6, "uint32", "optional"),
    thumbWidth: ProtoField5(7, "uint32", "optional"),
    thumbHeight: ProtoField5(8, "uint32", "optional"),
    thumbFileMd5: ProtoField5(9, "bytes", "optional"),
    source: ProtoField5(10, "bytes", "optional"),
    thumbFileSize: ProtoField5(11, "uint32", "optional"),
    busiType: ProtoField5(12, "uint32", "optional"),
    fromChatType: ProtoField5(13, "uint32", "optional"),
    toChatType: ProtoField5(14, "uint32", "optional"),
    boolSupportProgressive: ProtoField5(15, "bool", "optional"),
    fileWidth: ProtoField5(16, "uint32", "optional"),
    fileHeight: ProtoField5(17, "uint32", "optional"),
    subBusiType: ProtoField5(18, "uint32", "optional"),
    videoAttr: ProtoField5(19, "uint32", "optional"),
    bytesThumbFileUrls: ProtoField5(20, "bytes", "repeated"),
    bytesVideoFileUrls: ProtoField5(21, "bytes", "repeated"),
    thumbDownloadFlag: ProtoField5(22, "uint32", "optional"),
    fileDownloadFlag: ProtoField5(23, "uint32", "optional")
  });
  Msg2.Elem = ProtoMessage5.of({
    text: ProtoField5(1, {
      str: ProtoField5(1, "string"),
      link: ProtoField5(2, "string", "optional"),
      attr6Buf: ProtoField5(3, "bytes", "optional"),
      attr7Buf: ProtoField5(4, "bytes", "optional"),
      buf: ProtoField5(11, "bytes", "optional"),
      pbReserve: ProtoField5(12, "bytes", "optional")
    }, "optional"),
    face: ProtoField5(2, {
      index: ProtoField5(1, "uint32"),
      old: ProtoField5(2, "bytes"),
      buf: ProtoField5(11, "bytes", "optional")
    }, "optional"),
    notOnlineImage: ProtoField5(4, {
      filePath: ProtoField5(1, "string"),
      fileLen: ProtoField5(2, "uint32"),
      downloadPath: ProtoField5(3, "bytes"),
      oldVerSendFile: ProtoField5(4, "bytes"),
      imgType: ProtoField5(5, "uint32"),
      previewsImage: ProtoField5(6, "bytes"),
      picMd5: ProtoField5(7, "bytes"),
      picHeight: ProtoField5(8, "uint32"),
      picWidth: ProtoField5(9, "uint32"),
      resId: ProtoField5(10, "string"),
      flag: ProtoField5(11, "bytes"),
      thumbUrl: ProtoField5(12, "string"),
      original: ProtoField5(13, "uint32"),
      bigUrl: ProtoField5(14, "string"),
      origUrl: ProtoField5(15, "string"),
      bizType: ProtoField5(16, "uint32"),
      result: ProtoField5(17, "uint32"),
      index: ProtoField5(18, "uint32"),
      opFaceBuf: ProtoField5(19, "bytes"),
      oldPicMd5: ProtoField5(20, "bool"),
      thumbWidth: ProtoField5(21, "uint32"),
      thumbHeight: ProtoField5(22, "uint32"),
      fileId: ProtoField5(23, "uint32"),
      showLen: ProtoField5(24, "uint32"),
      downloadLen: ProtoField5(25, "uint32"),
      url400: ProtoField5(26, "string"),
      width400: ProtoField5(27, "uint32"),
      height400: ProtoField5(28, "uint32"),
      pbReserve: ProtoField5(29, "bytes")
    }, "optional"),
    transElemInfo: ProtoField5(5, {
      elemType: ProtoField5(1, "uint32"),
      elemValue: ProtoField5(2, "bytes")
    }, "optional"),
    marketFace: ProtoField5(6, {
      summary: ProtoField5(1, "string", "optional"),
      itemType: ProtoField5(2, "uint32", "optional"),
      info: ProtoField5(3, "uint32", "optional"),
      faceId: ProtoField5(4, "bytes", "optional"),
      tabId: ProtoField5(5, "uint32", "optional"),
      subType: ProtoField5(6, "uint32", "optional"),
      key: ProtoField5(7, "string", "optional"),
      width: ProtoField5(10, "uint32", "optional"),
      height: ProtoField5(11, "uint32", "optional")
    }, "optional"),
    customFace: ProtoField5(8, {
      guid: ProtoField5(1, "bytes"),
      filePath: ProtoField5(2, "string"),
      shortcut: ProtoField5(3, "string"),
      buffer: ProtoField5(4, "bytes"),
      flag: ProtoField5(5, "bytes"),
      oldData: ProtoField5(6, "bytes", "optional"),
      fileId: ProtoField5(7, "uint32"),
      serverIp: ProtoField5(8, "int32", "optional"),
      serverPort: ProtoField5(9, "int32", "optional"),
      fileType: ProtoField5(10, "int32"),
      signature: ProtoField5(11, "bytes"),
      useful: ProtoField5(12, "int32"),
      md5: ProtoField5(13, "bytes"),
      thumbUrl: ProtoField5(14, "string"),
      bigUrl: ProtoField5(15, "string"),
      origUrl: ProtoField5(16, "string"),
      bizType: ProtoField5(17, "int32"),
      repeatIndex: ProtoField5(18, "int32"),
      repeatImage: ProtoField5(19, "int32"),
      imageType: ProtoField5(20, "int32"),
      index: ProtoField5(21, "int32"),
      width: ProtoField5(22, "int32"),
      height: ProtoField5(23, "int32"),
      source: ProtoField5(24, "int32"),
      size: ProtoField5(25, "uint32"),
      origin: ProtoField5(26, "int32"),
      thumbWidth: ProtoField5(27, "int32", "optional"),
      thumbHeight: ProtoField5(28, "int32", "optional"),
      showLen: ProtoField5(29, "int32"),
      downloadLen: ProtoField5(30, "int32"),
      x400Url: ProtoField5(31, "string", "optional"),
      x400Width: ProtoField5(32, "int32"),
      x400Height: ProtoField5(33, "int32"),
      pbReserve: ProtoField5(34, {
        subType: ProtoField5(1, "int32"),
        field3: ProtoField5(3, "int32"),
        field4: ProtoField5(4, "int32"),
        summary: ProtoField5(9, "string"),
        field10: ProtoField5(10, "int32"),
        field21: ProtoField5(21, {
          field1: ProtoField5(1, "int32"),
          field2: ProtoField5(2, "string"),
          field3: ProtoField5(3, "int32"),
          field4: ProtoField5(4, "int32"),
          field5: ProtoField5(5, "int32"),
          md5Str: ProtoField5(7, "string")
        }),
        field31: ProtoField5(31, "string")
      }, "optional")
    }, "optional"),
    elemFlags2: ProtoField5(9, {
      colorTextId: ProtoField5(1, "uint64"),
      msgId: ProtoField5(2, "uint64"),
      whisperSessionId: ProtoField5(3, "uint32"),
      pttChangeBit: ProtoField5(4, "uint32"),
      vipStatus: ProtoField5(5, "uint32"),
      compatibleId: ProtoField5(6, "uint32"),
      insts: ProtoField5(7, {
        appId: ProtoField5(1, "uint32"),
        instId: ProtoField5(2, "uint32")
      }, "repeated"),
      msgRptCnt: ProtoField5(8, "uint32"),
      srcInst: ProtoField5(9, {
        appId: ProtoField5(1, "uint32"),
        instId: ProtoField5(2, "uint32")
      }),
      longtitude: ProtoField5(10, "uint32"),
      latitude: ProtoField5(11, "uint32"),
      customFont: ProtoField5(12, "uint32"),
      pcSupportDef: ProtoField5(13, {
        pcPtlBegin: ProtoField5(1, "uint32"),
        pcPtlEnd: ProtoField5(2, "uint32"),
        macPtlBegin: ProtoField5(3, "uint32"),
        macPtlEnd: ProtoField5(4, "uint32"),
        ptlsSupport: ProtoField5(5, "uint32", "repeated"),
        ptlsNotSupport: ProtoField5(6, "uint32", "repeated")
      }),
      crmFlags: ProtoField5(14, "uint32", "optional")
    }, "optional"),
    richMsg: ProtoField5(12, {
      template: ProtoField5(1, "bytes"),
      serviceId: ProtoField5(2, "int32")
    }, "optional"),
    groupFile: ProtoField5(13, {
      filename: ProtoField5(1, "string", "optional"),
      fileSize: ProtoField5(2, "uint64", "optional"),
      fileId: ProtoField5(3, "bytes", "optional"),
      batchId: ProtoField5(4, "bytes", "optional"),
      fileKey: ProtoField5(5, "bytes", "optional"),
      sequence: ProtoField5(7, "uint64", "optional")
    }, "optional"),
    extraInfo: ProtoField5(16, {
      nick: ProtoField5(1, "string", "optional"),
      groupCard: ProtoField5(2, "string", "optional"),
      level: ProtoField5(3, "int32"),
      flags: ProtoField5(4, "int32"),
      groupMask: ProtoField5(5, "int32"),
      msgTailId: ProtoField5(6, "int32", "optional"),
      senderTitle: ProtoField5(7, "string"),
      apnsTips: ProtoField5(8, "string", "optional"),
      uin: ProtoField5(9, "uint32", "optional"),
      msgStateFlag: ProtoField5(10, "int32", "optional"),
      apnsSoundType: ProtoField5(11, "int32", "optional"),
      newGroupFlag: ProtoField5(12, "int32", "optional")
    }, "optional"),
    videoFile: ProtoField5(19, "bytes", "optional"),
    generalFlags: ProtoField5(37, {
      bubbleDiyTextId: ProtoField5(1, "uint32"),
      groupFlagNew: ProtoField5(2, "int32"),
      uin: ProtoField5(3, "uint64"),
      rpId: ProtoField5(4, "bytes"),
      prpFold: ProtoField5(5, "int32"),
      longTextFlag: ProtoField5(6, "int32"),
      longTextResId: ProtoField5(7, "string", "optional"),
      groupType: ProtoField5(8, "int32"),
      toUinFlag: ProtoField5(9, "int32"),
      glamourLevel: ProtoField5(10, "int32"),
      memberLevel: ProtoField5(11, "int32"),
      groupRankSeq: ProtoField5(12, "int64"),
      olympicTorch: ProtoField5(13, "int32"),
      babyqGuideMsgCookie: ProtoField5(14, "bytes"),
      uin32ExpertFlag: ProtoField5(15, "int32"),
      bubbleSubId: ProtoField5(16, "int32"),
      pendantId: ProtoField5(17, "uint64"),
      rpIndex: ProtoField5(18, "bytes"),
      pbReserve: ProtoField5(19, "bytes")
    }, "optional"),
    srcMsg: ProtoField5(45, {
      origSeqs: ProtoField5(1, "uint32", "repeated"),
      senderUin: ProtoField5(2, "uint32"),
      time: ProtoField5(3, "int32"),
      elems: ProtoField5(5, "bytes", "repeated"),
      attr: ProtoField5(8, {
        oriMsgType: ProtoField5(2, "uint32", "optional"),
        sourceMsgId: ProtoField5(3, "uint64"),
        senderUid: ProtoField5(6, "string"),
        receiverUid: ProtoField5(7, "string", "optional"),
        ntMsgSeq: ProtoField5(8, "uint32", "optional")
      }),
      srcMsg: ProtoField5(9, "bytes", "optional"),
      // 仅在合并转发内存在
      toUin: ProtoField5(10, "uint32")
    }, "optional"),
    lightApp: ProtoField5(51, {
      data: ProtoField5(1, "bytes"),
      msgResid: ProtoField5(2, "bytes", "optional")
    }, "optional"),
    commonElem: ProtoField5(53, {
      serviceType: ProtoField5(1, "uint32"),
      pbElem: ProtoField5(2, "bytes"),
      businessType: ProtoField5(3, "uint32")
    }, "optional")
  });
  Msg2.Message = ProtoMessage5.of({
    routingHead: ProtoField5(1, {
      fromUin: ProtoField5(1, "uint32"),
      fromUid: ProtoField5(2, "string"),
      fromAppid: ProtoField5(3, "uint32"),
      fromInstid: ProtoField5(4, "uint32"),
      toUin: ProtoField5(5, "uint32"),
      toUid: ProtoField5(6, "string"),
      c2c: ProtoField5(7, {
        c2cType: ProtoField5(1, "int32"),
        serviceType: ProtoField5(2, "int32"),
        sig: ProtoField5(3, "bytes", "optional"),
        fromTinyId: ProtoField5(4, "uint32"),
        toTinyId: ProtoField5(5, "uint32"),
        name: ProtoField5(6, "string")
      }),
      group: ProtoField5(8, {
        groupCode: ProtoField5(1, "uint32"),
        groupType: ProtoField5(2, "uint32"),
        groupInfoSeq: ProtoField5(3, "uint64"),
        groupCard: ProtoField5(4, "string"),
        groupCardType: ProtoField5(5, "uint32"),
        groupLevel: ProtoField5(6, "uint32"),
        groupName: ProtoField5(7, "string"),
        extGroupKeyInfo: ProtoField5(8, "string"),
        msgFlag: ProtoField5(9, "uint32")
      }, "optional")
    }),
    /**
     * OlPush 的消息头, 跟发送时的 SendContentHead 布局不同。群聊 field 5 是所有人一致的群 msgSeq, field 11 为 0;
     * 私聊 field 5 是发送方的 clientSequence (撤回和引用用它), field 11 是双端一致的 c2cMsgSeq
     */
    contentHead: ProtoField5(2, {
      msgType: ProtoField5(1, "uint32"),
      subType: ProtoField5(2, "uint32"),
      c2cCmd: ProtoField5(3, "uint32"),
      /** 发送方生成, 两端一致 */
      random: ProtoField5(4, "uint32"),
      groupMsgSeqOrC2cClientSeq: ProtoField5(5, "uint32"),
      msgTime: ProtoField5(6, "uint32"),
      pkgNum: ProtoField5(7, "uint32"),
      pkgIndex: ProtoField5(8, "uint32"),
      divSeq: ProtoField5(9, "uint32"),
      autoReply: ProtoField5(10, "uint32"),
      c2cMsgSeq: ProtoField5(11, "uint32"),
      /** C2C 可由 (0x01000000 << 32) | random 算出 */
      msgUid: ProtoField5(12, "uint64"),
      /** 拉历史时 server 不填 field 12, 同样的 id 在这里 */
      msgUidAlt: ProtoField5(32, "uint64", "optional"),
      forward: ProtoField5(15, {
        field1: ProtoField5(1, "uint32"),
        field2: ProtoField5(2, "uint32"),
        field3: ProtoField5(3, "uint32"),
        field4: ProtoField5(4, "string"),
        avatar: ProtoField5(5, "string")
      }, "optional")
    }),
    body: ProtoField5(3, {
      richText: ProtoField5(1, {
        attr: ProtoField5(1, {
          codePage: ProtoField5(1, "int32"),
          time: ProtoField5(2, "int32"),
          random: ProtoField5(3, "int32"),
          color: ProtoField5(4, "int32"),
          size: ProtoField5(5, "int32"),
          effect: ProtoField5(6, "int32"),
          charSet: ProtoField5(7, "int32"),
          pitchAndFamily: ProtoField5(8, "int32"),
          fontName: ProtoField5(9, "string"),
          reserveData: ProtoField5(10, "bytes")
        }),
        elems: ProtoField5(2, Msg2.Elem, "repeated")
      }),
      msgContent: ProtoField5(2, "bytes"),
      msgEncryptContent: ProtoField5(3, "bytes")
    }, "optional")
  });
  Msg2.PbMultiMsgItem = ProtoMessage5.of({
    fileName: ProtoField5(1, "string"),
    buffer: ProtoField5(2, {
      msg: ProtoField5(1, "bytes", "repeated")
    })
  });
  Msg2.PbMultiMsgTransmit = ProtoMessage5.of({
    msg: ProtoField5(1, Msg2.Message, "repeated"),
    pbItemList: ProtoField5(2, Msg2.PbMultiMsgItem, "repeated")
  });
  Msg2.PushMsg = ProtoMessage5.of({
    message: ProtoField5(1, "bytes")
  });
  Msg2.KickNTPush = ProtoMessage5.of({
    uin: ProtoField5(1, "uint32"),
    tipsDesc: ProtoField5(3, "string"),
    tipsTitle: ProtoField5(4, "string"),
    /** 1001 = 异地顶号 (删 session 重新扫码); 其他 = 服务端主动踢等 (保留凭证重连) */
    code: ProtoField5(5, "uint32"),
    /** 时间戳或某种 token */
    field6: ProtoField5(6, "uint32")
  });
  Msg2.QSmallFaceExtra = ProtoMessage5.of({
    faceId: ProtoField5(1, "uint32"),
    text: ProtoField5(2, "string"),
    compatText: ProtoField5(3, "string")
  });
  Msg2.LargeFaceExtra = ProtoMessage5.of({
    aniStickerPackId: ProtoField5(1, "string", "optional"),
    aniStickerId: ProtoField5(2, "string", "optional"),
    faceId: ProtoField5(3, "int32", "optional"),
    field4: ProtoField5(4, "int32", "optional"),
    aniStickerType: ProtoField5(5, "int32", "optional"),
    resultId: ProtoField5(6, "string", "optional"),
    preview: ProtoField5(7, "string", "optional"),
    field9: ProtoField5(9, "int32", "optional")
  });
  Msg2.GroupFileExtra = ProtoMessage5.of({
    field1: ProtoField5(1, "uint32"),
    fileName: ProtoField5(2, "string"),
    display: ProtoField5(3, "string"),
    inner: ProtoField5(7, {
      info: ProtoField5(2, {
        busId: ProtoField5(1, "uint32"),
        fileId: ProtoField5(2, "string"),
        fileSize: ProtoField5(3, "uint32"),
        fileName: ProtoField5(4, "string"),
        field5: ProtoField5(5, "uint32", "optional"),
        field7: ProtoField5(7, "string", "optional"),
        fileMd5: ProtoField5(8, "string")
      })
    })
  });
  Msg2.FileExtra = ProtoMessage5.of({
    file: ProtoField5(1, {
      fileType: ProtoField5(1, "uint32"),
      sig: ProtoField5(2, "bytes", "optional"),
      fileUuid: ProtoField5(3, "string"),
      fileMd5: ProtoField5(4, "bytes", "optional"),
      fileName: ProtoField5(5, "string"),
      fileSize: ProtoField5(6, "uint32"),
      note: ProtoField5(7, "bytes", "optional"),
      reserved: ProtoField5(8, "uint32"),
      subCmd: ProtoField5(9, "uint32"),
      microCloud: ProtoField5(10, "uint32"),
      fileUrls: ProtoField5(11, "bytes", "repeated"),
      downloadFlag: ProtoField5(12, "uint32"),
      dangerLevel: ProtoField5(50, "uint32"),
      lifeTime: ProtoField5(51, "uint32"),
      uploadTime: ProtoField5(52, "uint32"),
      absFileType: ProtoField5(53, "uint32"),
      clientType: ProtoField5(54, "uint32"),
      expireTime: ProtoField5(55, "uint32"),
      pbReserve: ProtoField5(56, "bytes", "optional"),
      fileIdCrcMedia: ProtoField5(57, "string")
    })
  });
  Msg2.PbSendMsg = ProtoMessage5.of({
    routingHead: ProtoField5(1, {
      c2c: ProtoField5(1, {
        toUin: ProtoField5(1, "uint32", "optional"),
        toUid: ProtoField5(2, "string", "optional")
      }, "optional"),
      group: ProtoField5(2, {
        groupCode: ProtoField5(1, "uint32")
      }, "optional"),
      groupTemp: ProtoField5(3, {
        groupCode: ProtoField5(3, "uint32"),
        toUid: ProtoField5(4, "string")
      }, "optional"),
      // C2C 文件消息: fileUuid 和元数据放进 body.msgContent, 配合 ccCmd=4 server 才当离线文件派发
      trans0X211: ProtoField5(15, {
        toUin: ProtoField5(1, "uint32", "optional"),
        ccCmd: ProtoField5(2, "uint32", "optional"),
        uid: ProtoField5(8, "string", "optional")
      }, "optional")
    }),
    contentHead: ProtoField5(2, {
      // 这是 SendContentHead, 跟 OlPush 的 ContentHead 不同
      pkgNum: ProtoField5(1, "uint32", "optional"),
      pkgIndex: ProtoField5(2, "uint32", "optional"),
      divSeq: ProtoField5(3, "uint32", "optional"),
      autoReply: ProtoField5(4, "uint32", "optional")
    }, "optional"),
    body: ProtoField5(3, {
      richText: ProtoField5(1, {
        elems: ProtoField5(2, Msg2.Elem, "repeated")
      }, "optional"),
      msgContent: ProtoField5(2, "bytes", "optional")
    }),
    clientSequence: ProtoField5(4, "uint32", "optional"),
    random: ProtoField5(5, "uint32"),
    syncCookie: ProtoField5(6, "bytes", "optional"),
    via: ProtoField5(8, "uint32", "optional"),
    control: ProtoField5(12, {
      msgFlag: ProtoField5(1, "uint32")
    }, "optional"),
    multiSendSeq: ProtoField5(14, "uint32", "optional")
  });
  Msg2.PbSendMsgResp = ProtoMessage5.of({
    resultCode: ProtoField5(1, "int32"),
    errMsg: ProtoField5(2, "string", "optional"),
    sendTime: ProtoField5(3, "uint32", "optional"),
    msgInfoFlag: ProtoField5(10, "uint32", "optional"),
    groupMsgSeq: ProtoField5(11, "uint32", "optional"),
    c2cMsgSeq: ProtoField5(14, "uint32", "optional")
  });
  Msg2.PttTransGroupReq = ProtoMessage5.of({
    field1: ProtoField5(1, "uint32"),
    body: ProtoField5(2, {
      msgUid: ProtoField5(1, "uint64"),
      senderUin: ProtoField5(2, "uint32"),
      groupUin: ProtoField5(3, "uint32"),
      field4: ProtoField5(4, "uint32"),
      voiceMd5Hex: ProtoField5(5, "string"),
      field6: ProtoField5(6, "uint32"),
      field7: ProtoField5(7, "uint32"),
      field8: ProtoField5(8, "uint32"),
      voiceFileId: ProtoField5(9, "string"),
      field10: ProtoField5(10, "uint32")
    }),
    field5: ProtoField5(5, "uint32"),
    field6: ProtoField5(6, "uint32"),
    field10: ProtoField5(10, "uint32")
  });
  Msg2.PttTransC2CReq = ProtoMessage5.of({
    field1: ProtoField5(1, "uint32"),
    body: ProtoField5(3, {
      msgUid: ProtoField5(1, "uint64"),
      senderUin: ProtoField5(2, "uint32"),
      receiverUin: ProtoField5(3, "uint32"),
      voiceFileId: ProtoField5(4, "string"),
      field5: ProtoField5(5, "uint32"),
      field6: ProtoField5(6, "uint32"),
      field7: ProtoField5(7, "uint32"),
      field8: ProtoField5(8, "uint32"),
      voiceMd5Hex: ProtoField5(9, "string")
    }),
    field5: ProtoField5(5, "uint32"),
    field6: ProtoField5(6, "uint32"),
    field10: ProtoField5(10, "uint32")
  });
  Msg2.PttTransResultPush = ProtoMessage5.of({
    field1: ProtoField5(1, "uint32"),
    body: ProtoField5(2, {
      msgUid: ProtoField5(1, "uint64"),
      /** 1 = group, 2 = c2c */
      chatType: ProtoField5(2, "uint32"),
      field3: ProtoField5(3, "uint32"),
      field4: ProtoField5(4, "uint32"),
      field5: ProtoField5(5, "uint32"),
      field6: ProtoField5(6, "uint32"),
      field7: ProtoField5(7, "uint32"),
      text: ProtoField5(8, "string"),
      senderUin: ProtoField5(9, "uint32"),
      /** group: groupCode；c2c: 收件人 uin */
      groupOrReceiverUin: ProtoField5(10, "uint32")
    })
  });
  Msg2.FaceroamOpReq = ProtoMessage5.of({
    comm: ProtoField5(1, {
      imPlat: ProtoField5(1, "uint32"),
      osVersion: ProtoField5(2, "string"),
      qVersion: ProtoField5(3, "string", "optional")
    }),
    selfUin: ProtoField5(2, "uint64"),
    /** 1 = 列表, 2 = 删除 */
    subCmd: ProtoField5(3, "uint32"),
    deleteList: ProtoField5(5, {
      emojiId: ProtoField5(1, "string")
    }, "repeated"),
    field6: ProtoField5(6, "uint32", "optional")
  });
  Msg2.FaceroamListResp = ProtoMessage5.of({
    retCode: ProtoField5(1, "uint32"),
    errMsg: ProtoField5(2, "string"),
    subCmd: ProtoField5(3, "uint32"),
    userInfo: ProtoField5(4, {
      fileName: ProtoField5(1, "string", "repeated"),
      deleteFile: ProtoField5(2, "string", "repeated"),
      bid: ProtoField5(3, "string"),
      maxRoamSize: ProtoField5(4, "uint32")
    }),
    /** 跟 fileName 一一对应 */
    emojiType: ProtoField5(5, "uint32", "repeated")
  });
  Msg2.FaceroamDeleteResp = ProtoMessage5.of({
    retCode: ProtoField5(1, "uint32"),
    errMsg: ProtoField5(2, "string"),
    subCmd: ProtoField5(3, "uint32"),
    results: ProtoField5(5, {
      emojiId: ProtoField5(1, "string"),
      status: ProtoField5(2, "uint32")
    }, "repeated")
  });
  Msg2.BDHExpressionRoamReq = ProtoMessage5.of({
    field1: ProtoField5(1, "uint32"),
    field2: ProtoField5(2, "uint32"),
    body: ProtoField5(3, {
      field1: ProtoField5(1, "uint32"),
      uin: ProtoField5(2, "uint64"),
      field3: ProtoField5(3, "uint32"),
      /** 16 字节原始 md5, 不是 hex */
      md5: ProtoField5(4, "bytes"),
      fileSize: ProtoField5(5, "uint32"),
      field7: ProtoField5(7, "uint32"),
      field8: ProtoField5(8, "uint32"),
      field9: ProtoField5(9, "uint32"),
      version: ProtoField5(13, "string"),
      field16: ProtoField5(16, "uint32")
    }),
    /** 对应 highway commandId（add 走 cmd=9） */
    commandId: ProtoField5(7, "uint32"),
    extension: ProtoField5(1001, "bytes", "optional")
  });
  Msg2.BDHExpressionRoamResp = ProtoMessage5.of({
    field1: ProtoField5(1, "uint64"),
    field2: ProtoField5(2, "uint32"),
    body: ProtoField5(3, {
      retCode: ProtoField5(1, "uint32"),
      field2: ProtoField5(2, "uint32"),
      field4: ProtoField5(4, "uint32"),
      uploadIps: ProtoField5(6, "uint32", "repeated"),
      uploadPorts: ProtoField5(7, "uint32", "repeated"),
      /** highway upload 用的 ticket */
      uKey: ProtoField5(8, "bytes", "optional"),
      field9: ProtoField5(9, "uint32", "optional"),
      field10: ProtoField5(10, "uint32", "optional"),
      field11: ProtoField5(11, "uint32", "optional"),
      field12: ProtoField5(12, "uint32", "optional"),
      ext: ProtoField5(1018, {
        domain: ProtoField5(1, "string"),
        path1: ProtoField5(2, "string", "optional"),
        path2: ProtoField5(3, "string", "optional"),
        emojiId: ProtoField5(5, "string")
      }, "optional")
    })
  });
  Msg2.InfoSyncPushGroupNode = ProtoMessage5.of({
    groupCode: ProtoField5(1, "uint64"),
    groupSeq: ProtoField5(2, "uint64"),
    readMsgSeq: ProtoField5(3, "uint64", "optional"),
    latestMsgTime: ProtoField5(8, "uint64", "optional")
  });
  Msg2.InfoSyncPush = ProtoMessage5.of({
    groupNodes: ProtoField5(6, Msg2.InfoSyncPushGroupNode, "repeated")
  });
  Msg2.MarkdownExtra = ProtoMessage5.of({
    content: ProtoField5(1, "string")
  });
  Msg2.TextResvAttr = ProtoMessage5.of({
    atType: ProtoField5(3, "uint32"),
    atMemberUin: ProtoField5(4, "uint32", "optional"),
    atMemberTinyid: ProtoField5(5, "uint32", "optional"),
    atMemberUid: ProtoField5(9, "string")
  });
  Msg2.PokeExtra = ProtoMessage5.of({
    type: ProtoField5(1, "uint32"),
    strength: ProtoField5(7, "uint32")
  });
  Msg2.MessageStyleExtra = ProtoMessage5.of({
    field4: ProtoField5(4, "int32"),
    font: ProtoField5(15, "uint64"),
    fontEffectId: ProtoField5(34, "uint32"),
    vipType: ProtoField5(51, "uint64"),
    vipLevel: ProtoField5(52, "uint64"),
    vipNameplate: ProtoField5(56, "uint64"),
    groupMemberLevel: ProtoField5(65, {
      level: ProtoField5(2, "int32")
    }, "optional"),
    groupHonorStyle: ProtoField5(81, "uint64"),
    messageSequence: ProtoField5(107, "uint32")
  });
})(Msg || (Msg = {}));

// src/ntqqapi/proto/misc.ts
import { ProtoField as ProtoField6, ProtoMessage as ProtoMessage6 } from "@saltify/typeproto";
var Misc;
((Misc2) => {
  Misc2.UserInfoLabel = ProtoMessage6.of({
    labels: ProtoField6(1, {
      content: ProtoField6(4, "string")
    }, "repeated")
  });
  Misc2.UserInfoBusiness = ProtoMessage6.of({
    body: ProtoField6(3, {
      msg: ProtoField6(1, "string"),
      lists: ProtoField6(3, {
        type: ProtoField6(1, "uint32"),
        field2: ProtoField6(2, "uint32"),
        isYear: ProtoField6(3, "uint32"),
        level: ProtoField6(4, "uint32"),
        isPro: ProtoField6(5, "uint32"),
        icon1: ProtoField6(6, "string"),
        icon2: ProtoField6(7, "string")
      }, "repeated")
    })
  });
})(Misc || (Misc = {}));

// src/ntqqapi/helper/face_config.json
var face_config_default = {
  sysface: [
    {
      QSid: "419",
      QDes: "/\u706B\u8F66",
      IQLid: "419",
      AQLid: "419",
      EMCode: "10419",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "47"
    },
    {
      QSid: "424",
      QDes: "/\u7EED\u6807\u8BC6",
      IQLid: "424",
      AQLid: "424",
      EMCode: "10424",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "52"
    },
    {
      QSid: "425",
      QDes: "/\u6C42\u653E\u8FC7",
      IQLid: "425",
      AQLid: "425",
      EMCode: "10425",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "53"
    },
    {
      QSid: "426",
      QDes: "/\u73A9\u706B",
      IQLid: "426",
      AQLid: "426",
      EMCode: "10426",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "54"
    },
    {
      QSid: "427",
      QDes: "/\u5077\u611F",
      IQLid: "427",
      AQLid: "427",
      EMCode: "10427",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "55"
    },
    {
      QSid: "428",
      QDes: "/\u6536\u5230",
      IQLid: "428",
      AQLid: "428",
      EMCode: "10428"
    },
    {
      QSid: "429",
      QDes: "/\u86C7\u5E74\u5FEB\u4E50",
      IQLid: "429",
      AQLid: "429",
      EMCode: "10429",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "56"
    },
    {
      QSid: "364",
      QDes: "/\u8D85\u7EA7\u8D5E",
      IQLid: "364",
      AQLid: "364",
      EMCode: "10364",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "1",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "366",
      QDes: "/\u8292\u72D7",
      IQLid: "366",
      AQLid: "366",
      EMCode: "10366",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "2",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "362",
      QDes: "/\u597D\u5144\u5F1F",
      IQLid: "362",
      AQLid: "362",
      EMCode: "10362",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "3",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "397",
      QDes: "/\u629B\u5A9A\u773C",
      IQLid: "397",
      AQLid: "397",
      EMCode: "10397",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "4",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "396",
      QDes: "/\u72FC\u72D7",
      IQLid: "396",
      AQLid: "396",
      EMCode: "10396",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "5",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "360",
      QDes: "/\u4EB2\u4EB2",
      IQLid: "360",
      AQLid: "360",
      EMCode: "10360",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "6",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "361",
      QDes: "/\u72D7\u72D7\u7B11\u54ED",
      IQLid: "361",
      AQLid: "361",
      EMCode: "10361",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "7",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "363",
      QDes: "/\u72D7\u72D7\u53EF\u601C",
      IQLid: "363",
      AQLid: "363",
      EMCode: "10363",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "8",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "365",
      QDes: "/\u72D7\u72D7\u751F\u6C14",
      IQLid: "365",
      AQLid: "365",
      EMCode: "10365",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "9",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "367",
      QDes: "/\u72D7\u72D7\u7591\u95EE",
      IQLid: "367",
      AQLid: "367",
      EMCode: "10367",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "10",
      AniStickerPackId: "2",
      AniStickerPackName: "\u6C6A\u6C6A"
    },
    {
      QSid: "399",
      QDes: "/tui",
      IQLid: "399",
      AQLid: "399",
      EMCode: "10399",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "1",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "398",
      QDes: "/\u8D85\u7EA7ok",
      IQLid: "398",
      AQLid: "398",
      EMCode: "10398",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "2",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "373",
      QDes: "/\u5FD9",
      IQLid: "373",
      AQLid: "373",
      EMCode: "10373",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "3",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "370",
      QDes: "/\u795D\u8D3A",
      IQLid: "370",
      AQLid: "370",
      EMCode: "10370",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "4",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "375",
      QDes: "/\u8D85\u7EA7\u9F13\u638C",
      IQLid: "375",
      AQLid: "375",
      EMCode: "10375",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "5",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "368",
      QDes: "/\u5965\u7279\u7B11\u54ED",
      IQLid: "368",
      AQLid: "368",
      EMCode: "10368",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "6",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "369",
      QDes: "/\u5F69\u8679",
      IQLid: "369",
      AQLid: "369",
      EMCode: "10369",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "7",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "371",
      QDes: "/\u5192\u6CE1",
      IQLid: "371",
      AQLid: "371",
      EMCode: "10371",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "8",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "372",
      QDes: "/\u6C14\u547C\u547C",
      IQLid: "372",
      AQLid: "372",
      EMCode: "10372",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "9",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "374",
      QDes: "/\u6CE2\u6CE2\u6D41\u6CEA",
      IQLid: "374",
      AQLid: "374",
      EMCode: "10374",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "10",
      AniStickerPackId: "6",
      AniStickerPackName: "\u5657\u5657\u661F\u4EBA"
    },
    {
      QSid: "382",
      QDes: "/emo",
      IQLid: "382",
      AQLid: "382",
      EMCode: "10382",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "1",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "383",
      QDes: "/\u4F01\u9E45\u7231\u5FC3",
      IQLid: "383",
      AQLid: "383",
      EMCode: "10383",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "2",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "401",
      QDes: "/\u8D85\u7EA7\u8F6C\u5708",
      IQLid: "401",
      AQLid: "401",
      EMCode: "10401",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "3",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "400",
      QDes: "/\u5FEB\u4E50",
      IQLid: "400",
      AQLid: "400",
      EMCode: "10400",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "4",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "380",
      QDes: "/\u771F\u68D2",
      IQLid: "380",
      AQLid: "380",
      EMCode: "10380",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "5",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "381",
      QDes: "/\u8DEF\u8FC7",
      IQLid: "381",
      AQLid: "381",
      EMCode: "10381",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "6",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "379",
      QDes: "/\u4F01\u9E45\u6D41\u6CEA",
      IQLid: "379",
      AQLid: "379",
      EMCode: "10379",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "7",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "376",
      QDes: "/\u8DFA\u811A",
      IQLid: "376",
      AQLid: "376",
      EMCode: "10376",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "8",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "378",
      QDes: "/\u4F01\u9E45\u7B11\u54ED",
      IQLid: "378",
      AQLid: "378",
      EMCode: "10378",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "9",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "377",
      QDes: "/\u55E8",
      IQLid: "377",
      AQLid: "377",
      EMCode: "10377",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "10",
      AniStickerPackId: "5",
      AniStickerPackName: "\u4F01\u9E45"
    },
    {
      QSid: "403",
      QDes: "/\u51FA\u53BB\u73A9",
      IQLid: "403",
      AQLid: "403",
      EMCode: "10403",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "1",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "402",
      QDes: "/\u522B\u8BF4\u8BDD",
      IQLid: "402",
      AQLid: "402",
      EMCode: "10402",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "2",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "390",
      QDes: "/\u592A\u5934\u79C3",
      IQLid: "390",
      AQLid: "390",
      EMCode: "10390",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "3",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "391",
      QDes: "/\u592A\u6CA7\u6851",
      IQLid: "391",
      AQLid: "391",
      EMCode: "10391",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "4",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "388",
      QDes: "/\u592A\u5934\u75BC",
      IQLid: "388",
      AQLid: "388",
      EMCode: "10388",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "5",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "389",
      QDes: "/\u592A\u8D5E\u4E86",
      IQLid: "389",
      AQLid: "389",
      EMCode: "10389",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "6",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "386",
      QDes: "/\u545C\u545C\u545C",
      IQLid: "386",
      AQLid: "386",
      EMCode: "10386",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "7",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "385",
      QDes: "/\u592A\u6C14\u4E86",
      IQLid: "385",
      AQLid: "385",
      EMCode: "10385",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "8",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "384",
      QDes: "/\u665A\u5B89",
      IQLid: "384",
      AQLid: "384",
      EMCode: "10384",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "9",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "387",
      QDes: "/\u592A\u597D\u7B11",
      IQLid: "387",
      AQLid: "387",
      EMCode: "10387",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "10",
      AniStickerPackId: "4",
      AniStickerPackName: "QQ\u9EC4\u8138"
    },
    {
      QSid: "413",
      QDes: "/\u6447\u8D77\u6765",
      IQLid: "413",
      AQLid: "413",
      EMCode: "10413",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "1",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "405",
      QDes: "/\u597D\u8FD0\u6765",
      IQLid: "405",
      AQLid: "405",
      EMCode: "10405",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "2",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "404",
      QDes: "/\u95EA\u4EAE\u767B\u573A",
      IQLid: "404",
      AQLid: "404",
      EMCode: "10404",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "3",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "406",
      QDes: "/\u59D0\u662F\u5973\u738B",
      IQLid: "406",
      AQLid: "406",
      EMCode: "10406",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "4",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "410",
      QDes: "/\u4E48\u4E48\u54D2",
      IQLid: "410",
      AQLid: "410",
      EMCode: "10410",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "5",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "411",
      QDes: "/\u4E00\u8D77\u55E8",
      IQLid: "411",
      AQLid: "411",
      EMCode: "10411",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "6",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "407",
      QDes: "/\u6211\u542C\u542C",
      IQLid: "407",
      AQLid: "407",
      EMCode: "10407",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "7",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "408",
      QDes: "/\u81ED\u7F8E",
      IQLid: "408",
      AQLid: "408",
      EMCode: "10408",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "8",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "412",
      QDes: "/\u5F00\u5FC3",
      IQLid: "412",
      AQLid: "412",
      EMCode: "10412",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "9",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "409",
      QDes: "/\u9001\u4F60\u82B1\u82B1",
      IQLid: "409",
      AQLid: "409",
      EMCode: "10409",
      QHide: "1",
      AniStickerType: 1,
      AniStickerId: "10",
      AniStickerPackId: "3",
      AniStickerPackName: "\u559C\u82B1\u59AE"
    },
    {
      QSid: "14",
      QDes: "/\u5FAE\u7B11",
      IQLid: "23",
      AQLid: "23",
      EMCode: "100"
    },
    {
      QSid: "1",
      QDes: "/\u6487\u5634",
      IQLid: "40",
      AQLid: "40",
      EMCode: "101"
    },
    {
      QSid: "2",
      QDes: "/\u8272",
      IQLid: "19",
      AQLid: "19",
      EMCode: "102"
    },
    {
      QSid: "3",
      QDes: "/\u53D1\u5446",
      IQLid: "43",
      AQLid: "43",
      EMCode: "103"
    },
    {
      QSid: "4",
      QDes: "/\u5F97\u610F",
      IQLid: "21",
      AQLid: "21",
      EMCode: "104"
    },
    {
      QSid: "6",
      QDes: "/\u5BB3\u7F9E",
      IQLid: "20",
      AQLid: "20",
      EMCode: "106"
    },
    {
      QSid: "7",
      QDes: "/\u95ED\u5634",
      IQLid: "104",
      AQLid: "106",
      EMCode: "107"
    },
    {
      QSid: "8",
      QDes: "/\u7761",
      IQLid: "35",
      AQLid: "35",
      EMCode: "108"
    },
    {
      QSid: "9",
      QDes: "/\u5927\u54ED",
      IQLid: "10",
      AQLid: "10",
      EMCode: "109"
    },
    {
      QSid: "5",
      QDes: "/\u6D41\u6CEA",
      IQLid: "9",
      AQLid: "9",
      EMCode: "105",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "16"
    },
    {
      QSid: "10",
      QDes: "/\u5C34\u5C2C",
      IQLid: "25",
      AQLid: "25",
      EMCode: "110"
    },
    {
      QSid: "11",
      QDes: "/\u53D1\u6012",
      IQLid: "24",
      AQLid: "24",
      EMCode: "111"
    },
    {
      QSid: "12",
      QDes: "/\u8C03\u76AE",
      IQLid: "1",
      AQLid: "1",
      EMCode: "112"
    },
    {
      QSid: "13",
      QDes: "/\u5472\u7259",
      IQLid: "0",
      AQLid: "0",
      EMCode: "113"
    },
    {
      QSid: "0",
      QDes: "/\u60CA\u8BB6",
      IQLid: "33",
      AQLid: "33",
      EMCode: "114"
    },
    {
      QSid: "15",
      QDes: "/\u96BE\u8FC7",
      IQLid: "32",
      AQLid: "32",
      EMCode: "115"
    },
    {
      QSid: "16",
      QDes: "/\u9177",
      IQLid: "12",
      AQLid: "12",
      EMCode: "116"
    },
    {
      QSid: "96",
      QDes: "/\u51B7\u6C57",
      IQLid: "27",
      AQLid: "27",
      EMCode: "117"
    },
    {
      QSid: "18",
      QDes: "/\u6293\u72C2",
      IQLid: "13",
      AQLid: "13",
      EMCode: "118"
    },
    {
      QSid: "19",
      QDes: "/\u5410",
      IQLid: "22",
      AQLid: "22",
      EMCode: "119"
    },
    {
      QSid: "20",
      QDes: "/\u5077\u7B11",
      IQLid: "3",
      AQLid: "3",
      EMCode: "120"
    },
    {
      QSid: "21",
      QDes: "/\u53EF\u7231",
      IQLid: "18",
      AQLid: "18",
      EMCode: "121"
    },
    {
      QSid: "22",
      QDes: "/\u767D\u773C",
      IQLid: "30",
      AQLid: "30",
      EMCode: "122"
    },
    {
      QSid: "23",
      QDes: "/\u50B2\u6162",
      IQLid: "31",
      AQLid: "31",
      EMCode: "123"
    },
    {
      QSid: "24",
      QDes: "/\u9965\u997F",
      IQLid: "79",
      AQLid: "81",
      EMCode: "124"
    },
    {
      QSid: "25",
      QDes: "/\u56F0",
      IQLid: "80",
      AQLid: "82",
      EMCode: "125"
    },
    {
      QSid: "26",
      QDes: "/\u60CA\u6050",
      IQLid: "26",
      AQLid: "26",
      EMCode: "126"
    },
    {
      QSid: "27",
      QDes: "/\u6D41\u6C57",
      IQLid: "2",
      AQLid: "2",
      EMCode: "127"
    },
    {
      QSid: "28",
      QDes: "/\u61A8\u7B11",
      IQLid: "37",
      AQLid: "37",
      EMCode: "128"
    },
    {
      QSid: "29",
      QDes: "/\u60A0\u95F2",
      IQLid: "50",
      AQLid: "50",
      EMCode: "129"
    },
    {
      QSid: "30",
      QDes: "/\u594B\u6597",
      IQLid: "42",
      AQLid: "42",
      EMCode: "130"
    },
    {
      QSid: "31",
      QDes: "/\u5492\u9A82",
      IQLid: "81",
      AQLid: "83",
      EMCode: "131"
    },
    {
      QSid: "32",
      QDes: "/\u7591\u95EE",
      IQLid: "34",
      AQLid: "34",
      EMCode: "132"
    },
    {
      QSid: "33",
      QDes: "/\u5618",
      IQLid: "11",
      AQLid: "11",
      EMCode: "133"
    },
    {
      QSid: "34",
      QDes: "/\u6655",
      IQLid: "49",
      AQLid: "49",
      EMCode: "134"
    },
    {
      QSid: "35",
      QDes: "/\u6298\u78E8",
      IQLid: "82",
      AQLid: "84",
      EMCode: "135"
    },
    {
      QSid: "36",
      QDes: "/\u8870",
      IQLid: "39",
      AQLid: "39",
      EMCode: "136"
    },
    {
      QSid: "37",
      QDes: "/\u9AB7\u9AC5",
      isStatic: "1",
      IQLid: "76",
      AQLid: "78",
      EMCode: "137"
    },
    {
      QSid: "38",
      QDes: "/\u6572\u6253",
      IQLid: "5",
      AQLid: "5",
      EMCode: "138"
    },
    {
      QSid: "39",
      QDes: "/\u518D\u89C1",
      IQLid: "4",
      AQLid: "4",
      EMCode: "139"
    },
    {
      QSid: "97",
      QDes: "/\u64E6\u6C57",
      IQLid: "6",
      AQLid: "6",
      EMCode: "140"
    },
    {
      QSid: "98",
      QDes: "/\u62A0\u9F3B",
      IQLid: "83",
      AQLid: "85",
      EMCode: "141"
    },
    {
      QSid: "99",
      QDes: "/\u9F13\u638C",
      IQLid: "84",
      AQLid: "86",
      EMCode: "142"
    },
    {
      QSid: "100",
      QDes: "/\u7CD7\u5927\u4E86",
      IQLid: "85",
      AQLid: "87",
      EMCode: "143"
    },
    {
      QSid: "101",
      QDes: "/\u574F\u7B11",
      IQLid: "46",
      AQLid: "46",
      EMCode: "144"
    },
    {
      QSid: "102",
      QDes: "/\u5DE6\u54FC\u54FC",
      IQLid: "86",
      AQLid: "88",
      EMCode: "145"
    },
    {
      QSid: "103",
      QDes: "/\u53F3\u54FC\u54FC",
      IQLid: "44",
      AQLid: "44",
      EMCode: "146"
    },
    {
      QSid: "104",
      QDes: "/\u54C8\u6B20",
      IQLid: "87",
      AQLid: "89",
      EMCode: "147"
    },
    {
      QSid: "105",
      QDes: "/\u9119\u89C6",
      IQLid: "48",
      AQLid: "48",
      EMCode: "148"
    },
    {
      QSid: "106",
      QDes: "/\u59D4\u5C48",
      IQLid: "14",
      AQLid: "14",
      EMCode: "149"
    },
    {
      QSid: "107",
      QDes: "/\u5FEB\u54ED\u4E86",
      IQLid: "88",
      AQLid: "90",
      EMCode: "150"
    },
    {
      QSid: "108",
      QDes: "/\u9634\u9669",
      IQLid: "41",
      AQLid: "41",
      EMCode: "151"
    },
    {
      QSid: "305",
      QDes: "/\u53F3\u4EB2\u4EB2",
      IQLid: "305",
      AQLid: "305",
      EMCode: "10305"
    },
    {
      QSid: "109",
      QDes: "/\u5DE6\u4EB2\u4EB2",
      IQLid: "36",
      AQLid: "36",
      EMCode: "152"
    },
    {
      QSid: "110",
      QDes: "/\u5413",
      IQLid: "89",
      AQLid: "91",
      EMCode: "153"
    },
    {
      QSid: "111",
      QDes: "/\u53EF\u601C",
      IQLid: "51",
      AQLid: "51",
      EMCode: "154"
    },
    {
      QSid: "172",
      QDes: "/\u7728\u773C\u775B",
      IQLid: "142",
      AQLid: "164",
      EMCode: "242"
    },
    {
      QSid: "182",
      QDes: "/\u7B11\u54ED",
      IQLid: "152",
      AQLid: "174",
      EMCode: "252"
    },
    {
      QSid: "179",
      QDes: "/doge",
      IQLid: "149",
      AQLid: "171",
      EMCode: "249"
    },
    {
      QSid: "173",
      QDes: "/\u6CEA\u5954",
      IQLid: "143",
      AQLid: "165",
      EMCode: "243"
    },
    {
      QSid: "174",
      QDes: "/\u65E0\u5948",
      IQLid: "144",
      AQLid: "166",
      EMCode: "244"
    },
    {
      QSid: "212",
      QDes: "/\u6258\u816E",
      IQLid: "182",
      AQLid: "161",
      EMCode: "282"
    },
    {
      QSid: "175",
      QDes: "/\u5356\u840C",
      IQLid: "145",
      AQLid: "167",
      EMCode: "245"
    },
    {
      QSid: "178",
      QDes: "/\u659C\u773C\u7B11",
      IQLid: "148",
      AQLid: "170",
      EMCode: "248"
    },
    {
      QSid: "177",
      QDes: "/\u55B7\u8840",
      IQLid: "147",
      AQLid: "169",
      EMCode: "247"
    },
    {
      QSid: "176",
      QDes: "/\u5C0F\u7EA0\u7ED3",
      IQLid: "146",
      AQLid: "168",
      EMCode: "246"
    },
    {
      QSid: "183",
      QDes: "/\u6211\u6700\u7F8E",
      IQLid: "153",
      AQLid: "175",
      EMCode: "253"
    },
    {
      QSid: "262",
      QDes: "/\u8111\u9614\u75BC",
      IQLid: "262",
      AQLid: "262",
      EMCode: "10262"
    },
    {
      QSid: "263",
      QDes: "/\u6CA7\u6851",
      IQLid: "263",
      AQLid: "263",
      EMCode: "10263"
    },
    {
      QSid: "264",
      QDes: "/\u6342\u8138",
      IQLid: "264",
      AQLid: "264",
      EMCode: "10264"
    },
    {
      QSid: "265",
      QDes: "/\u8FA3\u773C\u775B",
      IQLid: "265",
      AQLid: "265",
      EMCode: "10265"
    },
    {
      QSid: "266",
      QDes: "/\u54E6\u54DF",
      IQLid: "266",
      AQLid: "266",
      EMCode: "10266"
    },
    {
      QSid: "267",
      QDes: "/\u5934\u79C3",
      IQLid: "267",
      AQLid: "267",
      EMCode: "10267"
    },
    {
      QSid: "268",
      QDes: "/\u95EE\u53F7\u8138",
      IQLid: "268",
      AQLid: "268",
      EMCode: "10268"
    },
    {
      QSid: "269",
      QDes: "/\u6697\u4E2D\u89C2\u5BDF",
      IQLid: "269",
      AQLid: "269",
      EMCode: "10269"
    },
    {
      QSid: "270",
      QDes: "/emm",
      IQLid: "270",
      AQLid: "270",
      EMCode: "10270"
    },
    {
      QSid: "271",
      QDes: "/\u5403\u74DC",
      IQLid: "271",
      AQLid: "271",
      EMCode: "10271"
    },
    {
      QSid: "272",
      QDes: "/\u5475\u5475\u54D2",
      IQLid: "272",
      AQLid: "272",
      EMCode: "10272"
    },
    {
      QSid: "277",
      QDes: "/\u6C6A\u6C6A",
      IQLid: "277",
      AQLid: "277",
      EMCode: "10277"
    },
    {
      QSid: "307",
      QDes: "/\u55B5\u55B5",
      IQLid: "307",
      AQLid: "307",
      EMCode: "10307"
    },
    {
      QSid: "306",
      QDes: "/\u725B\u6C14\u51B2\u5929",
      isStatic: "1",
      IQLid: "306",
      AQLid: "306",
      EMCode: "10306"
    },
    {
      QSid: "281",
      QDes: "/\u65E0\u773C\u7B11",
      IQLid: "281",
      AQLid: "281",
      EMCode: "10281"
    },
    {
      QSid: "282",
      QDes: "/\u656C\u793C",
      IQLid: "282",
      AQLid: "282",
      EMCode: "10282"
    },
    {
      QSid: "283",
      QDes: "/\u72C2\u7B11",
      IQLid: "283",
      AQLid: "283",
      EMCode: "10283"
    },
    {
      QSid: "284",
      QDes: "/\u9762\u65E0\u8868\u60C5",
      IQLid: "284",
      AQLid: "284",
      EMCode: "10284"
    },
    {
      QSid: "285",
      QDes: "/\u6478\u9C7C",
      IQLid: "285",
      AQLid: "285",
      EMCode: "10285"
    },
    {
      QSid: "293",
      QDes: "/\u6478\u9526\u9CA4",
      IQLid: "293",
      AQLid: "293",
      EMCode: "10293"
    },
    {
      QSid: "286",
      QDes: "/\u9B54\u9B3C\u7B11",
      IQLid: "286",
      AQLid: "286",
      EMCode: "10286"
    },
    {
      QSid: "287",
      QDes: "/\u54E6",
      IQLid: "287",
      AQLid: "287",
      EMCode: "10287"
    },
    {
      QSid: "289",
      QDes: "/\u7741\u773C",
      IQLid: "289",
      AQLid: "289",
      EMCode: "10289"
    },
    {
      QSid: "294",
      QDes: "/\u671F\u5F85",
      IQLid: "294",
      AQLid: "294",
      EMCode: "10294"
    },
    {
      QSid: "297",
      QDes: "/\u62DC\u8C22",
      IQLid: "297",
      AQLid: "297",
      EMCode: "10297"
    },
    {
      QSid: "298",
      QDes: "/\u5143\u5B9D",
      IQLid: "298",
      AQLid: "298",
      EMCode: "10298"
    },
    {
      QSid: "299",
      QDes: "/\u725B\u554A",
      IQLid: "299",
      AQLid: "299",
      EMCode: "10299"
    },
    {
      QSid: "300",
      QDes: "/\u80D6\u4E09\u65A4",
      IQLid: "300",
      AQLid: "300",
      EMCode: "10300"
    },
    {
      QSid: "323",
      QDes: "/\u5ACC\u5F03",
      IQLid: "323",
      AQLid: "323",
      EMCode: "10323"
    },
    {
      QSid: "332",
      QDes: "/\u4E3E\u724C\u724C",
      IQLid: "332",
      AQLid: "332",
      EMCode: "10332"
    },
    {
      QSid: "336",
      QDes: "/\u8C79\u5BCC",
      IQLid: "336",
      AQLid: "336",
      EMCode: "10336"
    },
    {
      QSid: "353",
      QDes: "/\u62DC\u6258",
      IQLid: "353",
      AQLid: "353",
      EMCode: "10353"
    },
    {
      QSid: "355",
      QDes: "/\u8036",
      IQLid: "355",
      AQLid: "355",
      EMCode: "10355"
    },
    {
      QSid: "356",
      QDes: "/666",
      IQLid: "356",
      AQLid: "356",
      EMCode: "10356"
    },
    {
      QSid: "354",
      QDes: "/\u5C0A\u561F\u5047\u561F",
      IQLid: "354",
      AQLid: "354",
      EMCode: "10354"
    },
    {
      QSid: "352",
      QDes: "/\u54A6",
      IQLid: "352",
      AQLid: "352",
      EMCode: "10352"
    },
    {
      QSid: "357",
      QDes: "/\u88C2\u5F00",
      IQLid: "357",
      AQLid: "357",
      EMCode: "10357"
    },
    {
      QSid: "334",
      QDes: "/\u864E\u864E\u751F\u5A01",
      IQLid: "334",
      AQLid: "334",
      EMCode: "10334"
    },
    {
      QSid: "347",
      QDes: "/\u5927\u5C55\u5B8F\u5154",
      IQLid: "347",
      AQLid: "347",
      EMCode: "10347"
    },
    {
      QSid: "303",
      QDes: "/\u53F3\u62DC\u5E74",
      IQLid: "303",
      AQLid: "303",
      EMCode: "10303"
    },
    {
      QSid: "302",
      QDes: "/\u5DE6\u62DC\u5E74",
      IQLid: "302",
      AQLid: "302",
      EMCode: "10302"
    },
    {
      QSid: "295",
      QDes: "/\u62FF\u5230\u7EA2\u5305",
      IQLid: "295",
      AQLid: "295",
      EMCode: "10295"
    },
    {
      QSid: "311",
      QDes: "/\u6253call",
      IQLid: "311",
      AQLid: "311",
      EMCode: "10311",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "1"
    },
    {
      QSid: "312",
      QDes: "/\u53D8\u5F62",
      IQLid: "312",
      AQLid: "312",
      EMCode: "10312",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "2"
    },
    {
      QSid: "314",
      QDes: "/\u4ED4\u7EC6\u5206\u6790",
      IQLid: "314",
      AQLid: "314",
      EMCode: "10314",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "4"
    },
    {
      QSid: "317",
      QDes: "/\u83DC\u6C6A",
      IQLid: "317",
      AQLid: "317",
      EMCode: "10317",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "7"
    },
    {
      QSid: "318",
      QDes: "/\u5D07\u62DC",
      IQLid: "318",
      AQLid: "318",
      EMCode: "10318",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "8"
    },
    {
      QSid: "319",
      QDes: "/\u6BD4\u5FC3",
      IQLid: "319",
      AQLid: "319",
      EMCode: "10319",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "9"
    },
    {
      QSid: "320",
      QDes: "/\u5E86\u795D",
      IQLid: "320",
      AQLid: "320",
      EMCode: "10320",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "10"
    },
    {
      QSid: "324",
      QDes: "/\u5403\u7CD6",
      IQLid: "324",
      AQLid: "324",
      EMCode: "10324",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "12"
    },
    {
      QSid: "325",
      QDes: "/\u60CA\u5413",
      IQLid: "325",
      AQLid: "325",
      EMCode: "10325",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "14"
    },
    {
      QSid: "337",
      QDes: "/\u82B1\u6735\u8138",
      IQLid: "337",
      AQLid: "337",
      EMCode: "10337",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "22"
    },
    {
      QSid: "338",
      QDes: "/\u6211\u60F3\u5F00\u4E86",
      IQLid: "338",
      AQLid: "338",
      EMCode: "10338",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "20"
    },
    {
      QSid: "339",
      QDes: "/\u8214\u5C4F",
      IQLid: "339",
      AQLid: "339",
      EMCode: "10339",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "21"
    },
    {
      QSid: "341",
      QDes: "/\u6253\u62DB\u547C",
      IQLid: "341",
      AQLid: "341",
      EMCode: "10341",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "24"
    },
    {
      QSid: "342",
      QDes: "/\u9178Q",
      IQLid: "342",
      AQLid: "342",
      EMCode: "10342",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "26"
    },
    {
      QSid: "343",
      QDes: "/\u6211\u65B9\u4E86",
      IQLid: "343",
      AQLid: "343",
      EMCode: "10343",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "27"
    },
    {
      QSid: "344",
      QDes: "/\u5927\u6028\u79CD",
      IQLid: "344",
      AQLid: "344",
      EMCode: "10344",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "28"
    },
    {
      QSid: "345",
      QDes: "/\u7EA2\u5305\u591A\u591A",
      IQLid: "345",
      AQLid: "345",
      EMCode: "10345",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "29"
    },
    {
      QSid: "346",
      QDes: "/\u4F60\u771F\u68D2\u68D2",
      IQLid: "346",
      AQLid: "346",
      EMCode: "10346",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "25"
    },
    {
      QSid: "181",
      QDes: "/\u6233\u4E00\u6233",
      IQLid: "151",
      AQLid: "173",
      EMCode: "251",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "37"
    },
    {
      QSid: "74",
      QDes: "/\u592A\u9633",
      isStatic: "1",
      IQLid: "73",
      AQLid: "75",
      EMCode: "176",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "35"
    },
    {
      QSid: "75",
      QDes: "/\u6708\u4EAE",
      isStatic: "1",
      IQLid: "67",
      AQLid: "68",
      EMCode: "175",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "36"
    },
    {
      QSid: "351",
      QDes: "/\u6572\u6572",
      IQLid: "351",
      AQLid: "351",
      EMCode: "10351",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "30"
    },
    {
      QSid: "349",
      QDes: "/\u575A\u5F3A",
      IQLid: "349",
      AQLid: "349",
      EMCode: "10349",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "32"
    },
    {
      QSid: "350",
      QDes: "/\u8D34\u8D34",
      IQLid: "350",
      AQLid: "350",
      EMCode: "10350",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "31"
    },
    {
      QSid: "395",
      QDes: "/\u7565\u7565\u7565",
      IQLid: "395",
      AQLid: "395",
      EMCode: "10395",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "41"
    },
    {
      QSid: "114",
      QDes: "/\u7BEE\u7403",
      IQLid: "90",
      AQLid: "92",
      EMCode: "158",
      AniStickerType: 2,
      AniStickerPackId: "1",
      AniStickerId: "13"
    },
    {
      QSid: "358",
      QDes: "/\u9AB0\u5B50",
      IQLid: "358",
      AQLid: "358",
      QHide: "1",
      EMCode: "10358",
      AniStickerType: 2,
      AniStickerPackId: "1",
      AniStickerId: "33"
    },
    {
      QSid: "359",
      QDes: "/\u5305\u526A\u9524",
      IQLid: "359",
      AQLid: "359",
      QHide: "1",
      EMCode: "10359",
      AniStickerType: 2,
      AniStickerPackId: "1",
      AniStickerId: "34"
    },
    {
      QSid: "326",
      QDes: "/\u751F\u6C14",
      IQLid: "326",
      AQLid: "326",
      EMCode: "10326",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "15"
    },
    {
      QSid: "53",
      QDes: "/\u86CB\u7CD5",
      IQLid: "59",
      AQLid: "59",
      EMCode: "168",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "17"
    },
    {
      QSid: "49",
      QDes: "/\u62E5\u62B1",
      IQLid: "45",
      AQLid: "45",
      EMCode: "178"
    },
    {
      QSid: "66",
      QDes: "/\u7231\u5FC3",
      IQLid: "28",
      AQLid: "28",
      EMCode: "166"
    },
    {
      QSid: "63",
      QDes: "/\u73AB\u7470",
      IQLid: "8",
      AQLid: "8",
      EMCode: "163"
    },
    {
      QSid: "64",
      QDes: "/\u51CB\u8C22",
      IQLid: "57",
      AQLid: "57",
      EMCode: "164"
    },
    {
      QSid: "187",
      QDes: "/\u5E7D\u7075",
      IQLid: "157",
      AQLid: "179",
      EMCode: "257"
    },
    {
      QSid: "146",
      QDes: "/\u7206\u7B4B",
      IQLid: "116",
      AQLid: "118",
      EMCode: "121011"
    },
    {
      QSid: "116",
      QDes: "/\u793A\u7231",
      IQLid: "29",
      AQLid: "29",
      EMCode: "165"
    },
    {
      QSid: "67",
      QDes: "/\u5FC3\u788E",
      IQLid: "72",
      AQLid: "74",
      EMCode: "167"
    },
    {
      QSid: "60",
      QDes: "/\u5496\u5561",
      IQLid: "66",
      AQLid: "66",
      EMCode: "160"
    },
    {
      QSid: "185",
      QDes: "/\u7F8A\u9A7C",
      IQLid: "155",
      AQLid: "177",
      EMCode: "255"
    },
    {
      QSid: "137",
      QDes: "/\u97AD\u70AE",
      isStatic: "1",
      IQLid: "107",
      AQLid: "109",
      EMCode: "121002",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "18"
    },
    {
      QSid: "333",
      QDes: "/\u70DF\u82B1",
      isStatic: "1",
      IQLid: "333",
      AQLid: "333",
      EMCode: "10333",
      AniStickerType: 1,
      AniStickerPackId: "1",
      AniStickerId: "19"
    },
    {
      QSid: "415",
      QDes: "/\u5212\u9F99\u821F",
      IQLid: "415",
      AQLid: "415",
      EMCode: "10415",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "43",
      AniStickerWidth: 192,
      AniStickerHeight: 76
    },
    {
      QSid: "416",
      QDes: "/\u4E2D\u9F99\u821F",
      IQLid: "416",
      AQLid: "416",
      EMCode: "10416",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "44",
      AniStickerWidth: 192,
      AniStickerHeight: 76,
      QHide: "1"
    },
    {
      QSid: "417",
      QDes: "/\u5927\u9F99\u821F",
      IQLid: "417",
      AQLid: "417",
      EMCode: "10417",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "45",
      AniStickerWidth: 192,
      AniStickerHeight: 96,
      QHide: "1"
    },
    {
      QSid: "392",
      QDes: "/\u9F99\u5E74\u5FEB\u4E50",
      IQLid: "392",
      AQLid: "392",
      EMCode: "10392",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "38",
      AniStickerWidth: 129,
      AniStickerHeight: 57
    },
    {
      QSid: "393",
      QDes: "/\u65B0\u5E74\u4E2D\u9F99",
      IQLid: "393",
      AQLid: "393",
      EMCode: "10393",
      QHide: "1",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "39",
      AniStickerWidth: 159,
      AniStickerHeight: 72
    },
    {
      QSid: "394",
      QDes: "/\u65B0\u5E74\u5927\u9F99",
      IQLid: "394",
      AQLid: "394",
      EMCode: "10394",
      QHide: "1",
      AniStickerType: 3,
      AniStickerPackId: "1",
      AniStickerId: "40",
      AniStickerWidth: 220,
      AniStickerHeight: 91
    },
    {
      QSid: "76",
      QDes: "/\u8D5E",
      IQLid: "52",
      AQLid: "52",
      EMCode: "179"
    },
    {
      QSid: "124",
      QDes: "/OK",
      IQLid: "64",
      AQLid: "64",
      EMCode: "189"
    },
    {
      QSid: "118",
      QDes: "/\u62B1\u62F3",
      IQLid: "56",
      AQLid: "56",
      EMCode: "183"
    },
    {
      QSid: "78",
      QDes: "/\u63E1\u624B",
      IQLid: "54",
      AQLid: "54",
      EMCode: "181"
    },
    {
      QSid: "119",
      QDes: "/\u52FE\u5F15",
      IQLid: "63",
      AQLid: "63",
      EMCode: "184"
    },
    {
      QSid: "79",
      QDes: "/\u80DC\u5229",
      IQLid: "55",
      AQLid: "55",
      EMCode: "182"
    },
    {
      QSid: "120",
      QDes: "/\u62F3\u5934",
      IQLid: "71",
      AQLid: "73",
      EMCode: "185"
    },
    {
      QSid: "121",
      QDes: "/\u5DEE\u52B2",
      IQLid: "70",
      AQLid: "72",
      EMCode: "186"
    },
    {
      QSid: "77",
      QDes: "/\u8E29",
      IQLid: "53",
      AQLid: "53",
      EMCode: "180"
    },
    {
      QSid: "123",
      QDes: "/NO",
      IQLid: "92",
      AQLid: "94",
      EMCode: "188"
    },
    {
      QSid: "201",
      QDes: "/\u70B9\u8D5E",
      IQLid: "171",
      AQLid: "150",
      EMCode: "271"
    },
    {
      QSid: "273",
      QDes: "/\u6211\u9178\u4E86",
      isStatic: "1",
      IQLid: "273",
      AQLid: "273",
      EMCode: "10273"
    },
    {
      QSid: "46",
      QDes: "/\u732A\u5934",
      isStatic: "1",
      IQLid: "7",
      AQLid: "7",
      EMCode: "162"
    },
    {
      QSid: "112",
      QDes: "/\u83DC\u5200",
      IQLid: "17",
      AQLid: "17",
      EMCode: "155"
    },
    {
      QSid: "56",
      QDes: "/\u5200",
      IQLid: "68",
      AQLid: "70",
      EMCode: "171"
    },
    {
      QSid: "169",
      QDes: "/\u624B\u67AA",
      isStatic: "1",
      IQLid: "139",
      AQLid: "141",
      EMCode: "121034"
    },
    {
      QSid: "171",
      QDes: "/\u8336",
      IQLid: "141",
      AQLid: "163",
      EMCode: "241"
    },
    {
      QSid: "59",
      QDes: "/\u4FBF\u4FBF",
      IQLid: "15",
      AQLid: "15",
      EMCode: "174"
    },
    {
      QSid: "144",
      QDes: "/\u559D\u5F69",
      isStatic: "1",
      IQLid: "114",
      AQLid: "116",
      EMCode: "121009"
    },
    {
      QSid: "147",
      QDes: "/\u68D2\u68D2\u7CD6",
      isStatic: "1",
      IQLid: "117",
      AQLid: "119",
      EMCode: "121012"
    },
    {
      QSid: "89",
      QDes: "/\u897F\u74DC",
      isStatic: "1",
      IQLid: "60",
      AQLid: "60",
      EMCode: "156"
    },
    {
      QSid: "148",
      QDes: "/\u559D\u5976",
      isStatic: "1",
      IQLid: "118",
      AQLid: "120",
      QHide: "1",
      EMCode: "121013"
    },
    {
      QSid: "55",
      QDes: "/\u70B8\u5F39",
      isStatic: "1",
      IQLid: "16",
      AQLid: "16",
      QHide: "1",
      EMCode: "170"
    },
    {
      QSid: "41",
      QDes: "/\u53D1\u6296",
      isStatic: "1",
      IQLid: "69",
      AQLid: "71",
      EMCode: "193"
    },
    {
      QSid: "125",
      QDes: "/\u8F6C\u5708",
      IQLid: "95",
      AQLid: "97",
      EMCode: "195"
    },
    {
      QSid: "42",
      QDes: "/\u7231\u60C5",
      IQLid: "38",
      AQLid: "38",
      EMCode: "190"
    },
    {
      QSid: "43",
      QDes: "/\u8DF3\u8DF3",
      IQLid: "93",
      AQLid: "95",
      EMCode: "192"
    },
    {
      QSid: "86",
      QDes: "/\u6004\u706B",
      IQLid: "94",
      AQLid: "96",
      EMCode: "194"
    },
    {
      QSid: "129",
      QDes: "/\u6325\u624B",
      IQLid: "77",
      AQLid: "79",
      EMCode: "199"
    },
    {
      QSid: "226",
      QDes: "/\u62CD\u684C",
      IQLid: "196",
      isCMEmoji: "1",
      AQLid: "198",
      QHide: "1",
      EMCode: "297"
    },
    {
      QSid: "85",
      QDes: "/\u98DE\u543B",
      isStatic: "1",
      IQLid: "47",
      AQLid: "47",
      EMCode: "191"
    },
    {
      QSid: "215",
      QDes: "/\u7CCA\u8138",
      IQLid: "185",
      isCMEmoji: "1",
      AQLid: "187",
      QHide: "1",
      EMCode: "285"
    },
    {
      QSid: "214",
      QDes: "/\u5575\u5575",
      IQLid: "184",
      isCMEmoji: "1",
      AQLid: "186",
      QHide: "1",
      EMCode: "284"
    },
    {
      QSid: "222",
      QDes: "/\u62B1\u62B1",
      IQLid: "192",
      isCMEmoji: "1",
      AQLid: "194",
      QHide: "1",
      EMCode: "292"
    },
    {
      QSid: "203",
      QDes: "/\u6258\u8138",
      IQLid: "173",
      AQLid: "152",
      QHide: "1",
      EMCode: "273"
    },
    {
      QSid: "235",
      QDes: "/\u98A4\u6296",
      IQLid: "205",
      isCMEmoji: "1",
      AQLid: "207",
      QHide: "1",
      EMCode: "305"
    },
    {
      QSid: "241",
      QDes: "/\u751F\u65E5\u5FEB\u4E50",
      IQLid: "211",
      isCMEmoji: "1",
      AQLid: "213",
      QHide: "1",
      EMCode: "311"
    },
    {
      QSid: "237",
      QDes: "/\u5077\u770B",
      IQLid: "207",
      isCMEmoji: "1",
      AQLid: "209",
      QHide: "1",
      EMCode: "307"
    },
    {
      QSid: "218",
      QDes: "/\u8214\u4E00\u8214",
      IQLid: "188",
      isCMEmoji: "1",
      AQLid: "190",
      QHide: "1",
      EMCode: "288"
    },
    {
      QSid: "233",
      QDes: "/\u6390\u4E00\u6390",
      IQLid: "203",
      isCMEmoji: "1",
      AQLid: "205",
      QHide: "1",
      EMCode: "303"
    },
    {
      QSid: "232",
      QDes: "/\u4F5B\u7CFB",
      IQLid: "202",
      isCMEmoji: "1",
      AQLid: "204",
      QHide: "1",
      EMCode: "302"
    },
    {
      QSid: "238",
      QDes: "/\u6247\u8138",
      IQLid: "208",
      isCMEmoji: "1",
      AQLid: "210",
      QHide: "1",
      EMCode: "308"
    },
    {
      QSid: "217",
      QDes: "/\u626F\u4E00\u626F",
      IQLid: "187",
      isCMEmoji: "1",
      AQLid: "189",
      QHide: "1",
      EMCode: "287"
    },
    {
      QSid: "225",
      QDes: "/\u64A9\u4E00\u64A9",
      IQLid: "195",
      isCMEmoji: "1",
      AQLid: "197",
      QHide: "1",
      EMCode: "296"
    },
    {
      QSid: "230",
      QDes: "/\u5632\u8BBD",
      IQLid: "200",
      isCMEmoji: "1",
      AQLid: "202",
      QHide: "1",
      EMCode: "300"
    },
    {
      QSid: "194",
      QDes: "/\u4E0D\u5F00\u5FC3",
      IQLid: "164",
      AQLid: "143",
      QHide: "1",
      EMCode: "264"
    },
    {
      QSid: "210",
      QDes: "/\u98D9\u6CEA",
      IQLid: "180",
      AQLid: "159",
      QHide: "1",
      EMCode: "280"
    },
    {
      QSid: "193",
      QDes: "/\u5927\u7B11",
      IQLid: "163",
      AQLid: "185",
      QHide: "1",
      EMCode: "263"
    },
    {
      QSid: "204",
      QDes: "/\u5403",
      IQLid: "174",
      AQLid: "153",
      QHide: "1",
      EMCode: "274"
    },
    {
      QSid: "200",
      QDes: "/\u6C42\u6C42",
      IQLid: "170",
      AQLid: "149",
      QHide: "1",
      EMCode: "270"
    },
    {
      QSid: "290",
      QDes: "/\u6572\u5F00\u5FC3",
      IQLid: "290",
      isCMEmoji: "1",
      AQLid: "290",
      QHide: "1",
      EMCode: "20240"
    },
    {
      QSid: "224",
      QDes: "/\u5F00\u67AA",
      IQLid: "194",
      isCMEmoji: "1",
      AQLid: "196",
      QHide: "1",
      EMCode: "295"
    },
    {
      QSid: "229",
      QDes: "/\u5E72\u676F",
      IQLid: "199",
      isCMEmoji: "1",
      AQLid: "201",
      QHide: "1",
      EMCode: "299"
    },
    {
      QSid: "221",
      QDes: "/\u9876\u5471\u5471",
      IQLid: "191",
      isCMEmoji: "1",
      AQLid: "193",
      QHide: "1",
      EMCode: "291"
    },
    {
      QSid: "219",
      QDes: "/\u8E6D\u4E00\u8E6D",
      IQLid: "189",
      isCMEmoji: "1",
      AQLid: "191",
      QHide: "1",
      EMCode: "289"
    },
    {
      QSid: "227",
      QDes: "/\u62CD\u624B",
      IQLid: "197",
      isCMEmoji: "1",
      AQLid: "199",
      QHide: "1",
      EMCode: "294"
    },
    {
      QSid: "216",
      QDes: "/\u62CD\u5934",
      IQLid: "186",
      isCMEmoji: "1",
      AQLid: "188",
      QHide: "1",
      EMCode: "286"
    },
    {
      QSid: "231",
      QDes: "/\u54FC",
      IQLid: "201",
      isCMEmoji: "1",
      AQLid: "203",
      QHide: "1",
      EMCode: "301"
    },
    {
      QSid: "244",
      QDes: "/\u6254\u72D7",
      IQLid: "214",
      isCMEmoji: "1",
      AQLid: "216",
      QHide: "1",
      EMCode: "312"
    },
    {
      QSid: "223",
      QDes: "/\u66B4\u51FB",
      IQLid: "193",
      isCMEmoji: "1",
      AQLid: "195",
      QHide: "1",
      EMCode: "293"
    },
    {
      QSid: "243",
      QDes: "/\u7529\u5934",
      IQLid: "213",
      isCMEmoji: "1",
      AQLid: "215",
      QHide: "1",
      EMCode: "313"
    },
    {
      QSid: "211",
      QDes: "/\u6211\u4E0D\u770B",
      IQLid: "181",
      AQLid: "160",
      QHide: "1",
      EMCode: "281"
    },
    {
      QSid: "292",
      QDes: "/\u8BA9\u6211\u5EB7\u5EB7",
      IQLid: "292",
      isCMEmoji: "1",
      AQLid: "292",
      QHide: "1",
      EMCode: "20242"
    },
    {
      QSid: "240",
      QDes: "/\u55B7\u8138",
      IQLid: "210",
      isCMEmoji: "1",
      AQLid: "212",
      QHide: "1",
      EMCode: "310"
    },
    {
      QSid: "180",
      QDes: "/\u60CA\u559C",
      IQLid: "150",
      AQLid: "172",
      QHide: "1",
      EMCode: "250"
    },
    {
      QSid: "122",
      QDes: "/\u7231\u4F60",
      IQLid: "65",
      AQLid: "65",
      QHide: "1",
      EMCode: "187"
    },
    {
      QSid: "202",
      QDes: "/\u65E0\u804A",
      IQLid: "172",
      AQLid: "151",
      QHide: "1",
      EMCode: "272"
    },
    {
      QSid: "278",
      QDes: "/\u6C57",
      IQLid: "278",
      isCMEmoji: "1",
      AQLid: "278",
      QHide: "1",
      EMCode: "20237"
    },
    {
      QSid: "301",
      QDes: "/\u597D\u95EA",
      IQLid: "301",
      AQLid: "301",
      QHide: "1",
      EMCode: "10301"
    },
    {
      QSid: "288",
      QDes: "/\u8BF7",
      IQLid: "288",
      AQLid: "288",
      QHide: "1",
      EMCode: "10288"
    },
    {
      QSid: "322",
      QDes: "/\u62D2\u7EDD",
      IQLid: "322",
      AQLid: "322",
      QHide: "1",
      EMCode: "10322"
    },
    {
      QSid: "198",
      QDes: "/\u5443",
      IQLid: "168",
      AQLid: "147",
      QHide: "1",
      EMCode: "268"
    },
    {
      QSid: "348",
      QDes: "/\u798F\u841D\u535C",
      IQLid: "348",
      AQLid: "348",
      QHide: "1",
      EMCode: "10348"
    },
    {
      QSid: "206",
      QDes: "/\u5BB3\u6015",
      IQLid: "176",
      AQLid: "155",
      QHide: "1",
      EMCode: "276"
    },
    {
      QSid: "239",
      QDes: "/\u539F\u8C05",
      IQLid: "209",
      isCMEmoji: "1",
      AQLid: "211",
      QHide: "1",
      EMCode: "309"
    }
  ],
  emoji: [
    {
      QSid: "\u{1F60A}",
      QCid: "128522",
      AQLid: "0",
      QDes: "/\u563F\u563F",
      EMCode: "400832"
    },
    {
      QSid: "\u{1F60C}",
      QCid: "128524",
      AQLid: "1",
      QDes: "/\u7F9E\u6DA9",
      EMCode: "400834"
    },
    {
      QSid: "\u{1F61A}",
      QCid: "128538",
      AQLid: "2",
      QDes: "/\u4EB2\u4EB2",
      EMCode: "400848"
    },
    {
      QSid: "\u{1F613}",
      QCid: "128531",
      AQLid: "3",
      QDes: "/\u6C57",
      EMCode: "400841"
    },
    {
      QSid: "\u{1F630}",
      QCid: "128560",
      AQLid: "4",
      QDes: "/\u7D27\u5F20",
      EMCode: "400870"
    },
    {
      QSid: "\u{1F61D}",
      QCid: "128541",
      AQLid: "5",
      QDes: "/\u5410\u820C",
      EMCode: "400851"
    },
    {
      QSid: "\u{1F601}",
      QCid: "128513",
      AQLid: "6",
      QDes: "/\u5472\u7259",
      EMCode: "400823"
    },
    {
      QSid: "\u{1F61C}",
      QCid: "128540",
      AQLid: "7",
      QDes: "/\u6DD8\u6C14",
      EMCode: "400850"
    },
    {
      QSid: "\u263A",
      QCid: "9786",
      AQLid: "8",
      QDes: "/\u53EF\u7231",
      EMCode: "401181"
    },
    {
      QSid: "\u{1F609}",
      QCid: "128521",
      AQLid: "9",
      QDes: "/\u5A9A\u773C",
      QHide: "1",
      EMCode: "400831"
    },
    {
      QSid: "\u{1F60D}",
      QCid: "128525",
      AQLid: "10",
      QDes: "/\u82B1\u75F4",
      EMCode: "400835"
    },
    {
      QSid: "\u{1F614}",
      QCid: "128532",
      AQLid: "11",
      QDes: "/\u5931\u843D",
      EMCode: "400842"
    },
    {
      QSid: "\u{1F604}",
      QCid: "128516",
      AQLid: "12",
      QDes: "/\u9AD8\u5174",
      EMCode: "400826"
    },
    {
      QSid: "\u{1F60F}",
      QCid: "128527",
      AQLid: "13",
      QDes: "/\u54FC\u54FC",
      EMCode: "400837"
    },
    {
      QSid: "\u{1F612}",
      QCid: "128530",
      AQLid: "14",
      QDes: "/\u4E0D\u5C51",
      EMCode: "400840"
    },
    {
      QSid: "\u{1F633}",
      QCid: "128563",
      AQLid: "15",
      QDes: "/\u77AA\u773C",
      EMCode: "400873"
    },
    {
      QSid: "\u{1F618}",
      QCid: "128536",
      AQLid: "16",
      QDes: "/\u98DE\u543B",
      EMCode: "400846"
    },
    {
      QSid: "\u{1F62D}",
      QCid: "128557",
      AQLid: "17",
      QDes: "/\u5927\u54ED",
      EMCode: "400867"
    },
    {
      QSid: "\u{1F631}",
      QCid: "128561",
      AQLid: "18",
      QDes: "/\u5BB3\u6015",
      EMCode: "400871"
    },
    {
      QSid: "\u{1F602}",
      QCid: "128514",
      AQLid: "19",
      QDes: "/\u6FC0\u52A8",
      EMCode: "400824"
    },
    {
      QSid: "\u{1F4AA}",
      QCid: "128170",
      AQLid: "20",
      QDes: "/\u808C\u8089",
      EMCode: "400644"
    },
    {
      QSid: "\u{1F44A}",
      QCid: "128074",
      AQLid: "21",
      QDes: "/\u62F3\u5934",
      EMCode: "400390"
    },
    {
      QSid: "\u{1F44D}",
      QCid: "128077",
      AQLid: "22",
      QDes: "/\u5389\u5BB3",
      EMCode: "400408"
    },
    {
      QSid: "\u261D",
      QCid: "9757",
      AQLid: "23",
      QDes: "/\u5411\u4E0A",
      QHide: "1",
      EMCode: "401203"
    },
    {
      QSid: "\u{1F44F}",
      QCid: "128079",
      AQLid: "24",
      QDes: "/\u9F13\u638C",
      EMCode: "400420"
    },
    {
      QSid: "\u270C",
      QCid: "9996",
      AQLid: "25",
      QDes: "/\u80DC\u5229",
      QHide: "1",
      EMCode: "401210"
    },
    {
      QSid: "\u{1F44E}",
      QCid: "128078",
      AQLid: "26",
      QDes: "/\u9119\u89C6",
      EMCode: "400414"
    },
    {
      QSid: "\u{1F64F}",
      QCid: "128591",
      AQLid: "27",
      QDes: "/\u5408\u5341",
      EMCode: "400396"
    },
    {
      QSid: "\u{1F44C}",
      QCid: "128076",
      AQLid: "28",
      QDes: "/\u597D\u7684",
      EMCode: "400402"
    },
    {
      QSid: "\u{1F448}",
      QCid: "128072",
      AQLid: "29",
      QDes: "/\u5411\u5DE6",
      QHide: "1",
      EMCode: "400378"
    },
    {
      QSid: "\u{1F449}",
      QCid: "128073",
      AQLid: "30",
      QDes: "/\u5411\u53F3",
      QHide: "1",
      EMCode: "400384"
    },
    {
      QSid: "\u{1F446}",
      QCid: "128070",
      AQLid: "31",
      QDes: "/\u5411\u4E0A",
      EMCode: "400366"
    },
    {
      QSid: "\u{1F447}",
      QCid: "128071",
      AQLid: "32",
      QDes: "/\u5411\u4E0B",
      QHide: "1",
      EMCode: "400372"
    },
    {
      QSid: "\u{1F440}",
      QCid: "128064",
      AQLid: "33",
      QDes: "/\u773C\u775B",
      EMCode: "400351"
    },
    {
      QSid: "\u{1F443}",
      QCid: "128067",
      AQLid: "34",
      QDes: "/\u9F3B\u5B50",
      QHide: "1",
      EMCode: "400358"
    },
    {
      QSid: "\u{1F444}",
      QCid: "128068",
      AQLid: "35",
      QDes: "/\u5634\u5507",
      QHide: "1",
      EMCode: "400364"
    },
    {
      QSid: "\u{1F442}",
      QCid: "128066",
      AQLid: "36",
      QDes: "/\u8033\u6735",
      QHide: "1",
      EMCode: "400352"
    },
    {
      QSid: "\u{1F35A}",
      QCid: "127834",
      AQLid: "37",
      QDes: "/\u7C73\u996D",
      QHide: "1",
      EMCode: "400149"
    },
    {
      QSid: "\u{1F35D}",
      QCid: "127837",
      AQLid: "38",
      QDes: "/\u610F\u9762",
      QHide: "1",
      EMCode: "400152"
    },
    {
      QSid: "\u{1F35C}",
      QCid: "127836",
      AQLid: "39",
      QDes: "/\u62C9\u9762",
      EMCode: "400151"
    },
    {
      QSid: "\u{1F359}",
      QCid: "127833",
      AQLid: "40",
      QDes: "/\u996D\u56E2",
      QHide: "1",
      EMCode: "400148"
    },
    {
      QSid: "\u{1F367}",
      QCid: "127847",
      AQLid: "41",
      QDes: "/\u5228\u51B0",
      EMCode: "400162"
    },
    {
      QSid: "\u{1F363}",
      QCid: "127843",
      AQLid: "42",
      QDes: "/\u5BFF\u53F8",
      QHide: "1",
      EMCode: "400158"
    },
    {
      QSid: "\u{1F382}",
      QCid: "127874",
      AQLid: "43",
      QDes: "/\u86CB\u7CD5",
      QHide: "1",
      EMCode: "400186"
    },
    {
      QSid: "\u{1F35E}",
      QCid: "127838",
      AQLid: "44",
      QDes: "/\u9762\u5305",
      EMCode: "400153"
    },
    {
      QSid: "\u{1F354}",
      QCid: "127828",
      AQLid: "45",
      QDes: "/\u6C49\u5821",
      QHide: "1",
      EMCode: "400143"
    },
    {
      QSid: "\u{1F373}",
      QCid: "127859",
      AQLid: "46",
      QDes: "/\u714E\u86CB",
      QHide: "1",
      EMCode: "400174"
    },
    {
      QSid: "\u{1F35F}",
      QCid: "127839",
      AQLid: "47",
      QDes: "/\u85AF\u6761",
      QHide: "1",
      EMCode: "400154"
    },
    {
      QSid: "\u{1F37A}",
      QCid: "127866",
      AQLid: "48",
      QDes: "/\u5564\u9152",
      EMCode: "400181"
    },
    {
      QSid: "\u{1F37B}",
      QCid: "127867",
      AQLid: "49",
      QDes: "/\u5E72\u676F",
      EMCode: "400182"
    },
    {
      QSid: "\u{1F378}",
      QCid: "127864",
      AQLid: "50",
      QDes: "/\u9AD8\u811A\u676F",
      QHide: "1",
      EMCode: "400179"
    },
    {
      QSid: "\u2615",
      QCid: "9749",
      AQLid: "51",
      QDes: "/\u5496\u5561",
      EMCode: "401262"
    },
    {
      QSid: "\u{1F34E}",
      QCid: "127822",
      AQLid: "52",
      QDes: "/\u82F9\u679C",
      EMCode: "400137"
    },
    {
      QSid: "\u{1F34A}",
      QCid: "127818",
      AQLid: "53",
      QDes: "/\u6A59\u5B50",
      QHide: "1",
      EMCode: "400133"
    },
    {
      QSid: "\u{1F353}",
      QCid: "127827",
      AQLid: "54",
      QDes: "/\u8349\u8393",
      EMCode: "400142"
    },
    {
      QSid: "\u{1F349}",
      QCid: "127817",
      AQLid: "55",
      QDes: "/\u897F\u74DC",
      EMCode: "400132"
    },
    {
      QSid: "\u{1F48A}",
      QCid: "128138",
      AQLid: "56",
      QDes: "/\u836F\u4E38",
      QHide: "1",
      EMCode: "400612"
    },
    {
      QSid: "\u{1F6AC}",
      QCid: "128684",
      AQLid: "57",
      QDes: "/\u5438\u70DF",
      EMCode: "400987"
    },
    {
      QSid: "\u{1F384}",
      QCid: "127876",
      AQLid: "58",
      QDes: "/\u5723\u8BDE\u6811",
      QHide: "1",
      EMCode: "400188"
    },
    {
      QSid: "\u{1F339}",
      QCid: "127801",
      AQLid: "59",
      QDes: "/\u73AB\u7470",
      EMCode: "400116"
    },
    {
      QSid: "\u{1F389}",
      QCid: "127881",
      AQLid: "60",
      QDes: "/\u5E86\u795D",
      EMCode: "400198"
    },
    {
      QSid: "\u{1F334}",
      QCid: "127796",
      AQLid: "61",
      QDes: "/\u6930\u5B50\u6811",
      QHide: "1",
      EMCode: "400112"
    },
    {
      QSid: "\u{1F49D}",
      QCid: "128157",
      AQLid: "62",
      QDes: "/\u793C\u7269",
      EMCode: "400631"
    },
    {
      QSid: "\u{1F380}",
      QCid: "127872",
      AQLid: "63",
      QDes: "/\u8774\u8776\u7ED3",
      QHide: "1",
      EMCode: "400184"
    },
    {
      QSid: "\u{1F388}",
      QCid: "127880",
      AQLid: "64",
      QDes: "/\u6C14\u7403",
      QHide: "1",
      EMCode: "400197"
    },
    {
      QSid: "\u{1F41A}",
      QCid: "128026",
      AQLid: "65",
      QDes: "/\u6D77\u87BA",
      QHide: "1",
      EMCode: "400314"
    },
    {
      QSid: "\u{1F48D}",
      QCid: "128141",
      AQLid: "66",
      QDes: "/\u6212\u6307",
      QHide: "1",
      EMCode: "400615"
    },
    {
      QSid: "\u{1F4A3}",
      QCid: "128163",
      AQLid: "67",
      QDes: "/\u70B8\u5F39",
      EMCode: "400637"
    },
    {
      QSid: "\u{1F451}",
      QCid: "128081",
      AQLid: "68",
      QDes: "/\u7687\u51A0",
      QHide: "1",
      EMCode: "400432"
    },
    {
      QSid: "\u{1F514}",
      QCid: "128276",
      AQLid: "69",
      QDes: "/\u94C3\u94DB",
      QHide: "1",
      EMCode: "400751"
    },
    {
      QSid: "\u2B50",
      QCid: "11088",
      AQLid: "70",
      QDes: "/\u661F\u661F",
      QHide: "1",
      EMCode: "401686"
    },
    {
      QSid: "\u2728",
      QCid: "10024",
      AQLid: "71",
      QDes: "/\u95EA\u5149",
      EMCode: "401137"
    },
    {
      QSid: "\u{1F4A8}",
      QCid: "128168",
      AQLid: "72",
      QDes: "/\u5439\u6C14",
      EMCode: "400642"
    },
    {
      QSid: "\u{1F4A6}",
      QCid: "128166",
      AQLid: "73",
      QDes: "/\u6C34",
      EMCode: "400640"
    },
    {
      QSid: "\u{1F525}",
      QCid: "128293",
      AQLid: "74",
      QDes: "/\u706B",
      EMCode: "400768"
    },
    {
      QSid: "\u{1F3C6}",
      QCid: "127942",
      AQLid: "75",
      QDes: "/\u5956\u676F",
      QHide: "1",
      EMCode: "400256"
    },
    {
      QSid: "\u{1F4B0}",
      QCid: "128176",
      AQLid: "76",
      QDes: "/\u94B1",
      QHide: "1",
      EMCode: "400655"
    },
    {
      QSid: "\u{1F4A4}",
      QCid: "128164",
      AQLid: "77",
      QDes: "/\u7761\u89C9",
      EMCode: "400638"
    },
    {
      QSid: "\u26A1",
      QCid: "9889",
      AQLid: "78",
      QDes: "/\u95EA\u7535",
      QHide: "1",
      EMCode: "401685"
    },
    {
      QSid: "\u{1F463}",
      QCid: "128099",
      AQLid: "79",
      QDes: "/\u811A\u5370",
      QHide: "1",
      EMCode: "400450"
    },
    {
      QSid: "\u{1F4A9}",
      QCid: "128169",
      AQLid: "80",
      QDes: "/\u4FBF\u4FBF",
      EMCode: "400643"
    },
    {
      QSid: "\u{1F489}",
      QCid: "128137",
      AQLid: "81",
      QDes: "/\u6253\u9488",
      EMCode: "400611"
    },
    {
      QSid: "\u2668",
      QCid: "9832",
      AQLid: "82",
      QDes: "/\u70ED",
      QHide: "1",
      EMCode: "401287"
    },
    {
      QSid: "\u{1F4EB}",
      QCid: "128235",
      AQLid: "83",
      QDes: "/\u90AE\u7BB1",
      EMCode: "400714"
    },
    {
      QSid: "\u{1F511}",
      QCid: "128273",
      AQLid: "84",
      QDes: "/\u94A5\u5319",
      QHide: "1",
      EMCode: "400748"
    },
    {
      QSid: "\u{1F512}",
      QCid: "128274",
      AQLid: "85",
      QDes: "/\u9501",
      QHide: "1",
      EMCode: "400749"
    },
    {
      QSid: "\u2708",
      QCid: "9992",
      AQLid: "86",
      QDes: "/\u98DE\u673A",
      QHide: "1",
      EMCode: "401298"
    },
    {
      QSid: "\u{1F684}",
      QCid: "128644",
      AQLid: "87",
      QDes: "/\u5217\u8F66",
      QHide: "1",
      EMCode: "400942"
    },
    {
      QSid: "\u{1F697}",
      QCid: "128663",
      AQLid: "88",
      QDes: "/\u6C7D\u8F66",
      QHide: "1",
      EMCode: "400961"
    },
    {
      QSid: "\u{1F6A4}",
      QCid: "128676",
      AQLid: "89",
      QDes: "/\u5FEB\u8247",
      QHide: "1",
      EMCode: "400979"
    },
    {
      QSid: "\u{1F6B2}",
      QCid: "128690",
      AQLid: "90",
      QDes: "/\u81EA\u884C\u8F66",
      QHide: "1",
      EMCode: "400993"
    },
    {
      QSid: "\u{1F40E}",
      QCid: "128014",
      AQLid: "91",
      QDes: "/\u9A91\u9A6C",
      EMCode: "400302"
    },
    {
      QSid: "\u{1F680}",
      QCid: "128640",
      AQLid: "92",
      QDes: "/\u706B\u7BAD",
      QHide: "1",
      EMCode: "400938"
    },
    {
      QSid: "\u{1F68C}",
      QCid: "128652",
      AQLid: "93",
      QDes: "/\u516C\u4EA4",
      QHide: "1",
      EMCode: "400950"
    },
    {
      QSid: "\u26F5",
      QCid: "9973",
      AQLid: "94",
      QDes: "/\u8239",
      QHide: "1",
      EMCode: "401294"
    },
    {
      QSid: "\u{1F469}",
      QCid: "128105",
      AQLid: "95",
      QDes: "/\u5988\u5988",
      QHide: "1",
      EMCode: "400482"
    },
    {
      QSid: "\u{1F468}",
      QCid: "128104",
      AQLid: "96",
      QDes: "/\u7238\u7238",
      QHide: "1",
      EMCode: "400465"
    },
    {
      QSid: "\u{1F467}",
      QCid: "128103",
      AQLid: "97",
      QDes: "/\u5973\u5B69",
      EMCode: "400459"
    },
    {
      QSid: "\u{1F466}",
      QCid: "128102",
      AQLid: "98",
      QDes: "/\u7537\u5B69",
      EMCode: "400453"
    },
    {
      QSid: "\u{1F435}",
      QCid: "128053",
      AQLid: "99",
      QDes: "/\u7334",
      EMCode: "400341"
    },
    {
      QSid: "\u{1F419}",
      QCid: "128025",
      AQLid: "100",
      QDes: "/\u7AE0\u9C7C",
      QHide: "1",
      EMCode: "400313"
    },
    {
      QSid: "\u{1F437}",
      QCid: "128055",
      AQLid: "101",
      QDes: "/\u732A",
      EMCode: "400343"
    },
    {
      QSid: "\u{1F480}",
      QCid: "128128",
      AQLid: "102",
      QDes: "/\u9AB7\u9AC5",
      QHide: "1",
      EMCode: "400572"
    },
    {
      QSid: "\u{1F424}",
      QCid: "128036",
      AQLid: "103",
      QDes: "/\u5C0F\u9E21",
      QHide: "1",
      EMCode: "400324"
    },
    {
      QSid: "\u{1F428}",
      QCid: "128040",
      AQLid: "104",
      QDes: "/\u6811\u61D2",
      QHide: "1",
      EMCode: "400328"
    },
    {
      QSid: "\u{1F42E}",
      QCid: "128046",
      AQLid: "105",
      QDes: "/\u725B",
      EMCode: "400334"
    },
    {
      QSid: "\u{1F414}",
      QCid: "128020",
      AQLid: "106",
      QDes: "/\u516C\u9E21",
      EMCode: "400308"
    },
    {
      QSid: "\u{1F438}",
      QCid: "128056",
      AQLid: "107",
      QDes: "/\u9752\u86D9",
      EMCode: "400344"
    },
    {
      QSid: "\u{1F47B}",
      QCid: "128123",
      AQLid: "108",
      QDes: "/\u5E7D\u7075",
      EMCode: "400562"
    },
    {
      QSid: "\u{1F41B}",
      QCid: "128027",
      AQLid: "109",
      QDes: "/\u866B",
      EMCode: "400315"
    },
    {
      QSid: "\u{1F420}",
      QCid: "128032",
      AQLid: "110",
      QDes: "/\u9C7C",
      QHide: "1",
      EMCode: "400320"
    },
    {
      QSid: "\u{1F436}",
      QCid: "128054",
      AQLid: "111",
      QDes: "/\u72D7",
      EMCode: "400342"
    },
    {
      QSid: "\u{1F42F}",
      QCid: "128047",
      AQLid: "112",
      QDes: "/\u8001\u864E",
      QHide: "1",
      EMCode: "400335"
    },
    {
      QSid: "\u{1F47C}",
      QCid: "128124",
      AQLid: "113",
      QDes: "/\u5929\u4F7F",
      QHide: "1",
      EMCode: "400563"
    },
    {
      QSid: "\u{1F427}",
      QCid: "128039",
      AQLid: "114",
      QDes: "/\u4F01\u9E45",
      QHide: "1",
      EMCode: "400327"
    },
    {
      QSid: "\u{1F433}",
      QCid: "128051",
      AQLid: "115",
      QDes: "/\u9CB8\u9C7C",
      EMCode: "400339"
    },
    {
      QSid: "\u{1F42D}",
      QCid: "128045",
      AQLid: "116",
      QDes: "/\u8001\u9F20",
      QHide: "1",
      EMCode: "400333"
    },
    {
      QSid: "\u{1F452}",
      QCid: "128082",
      AQLid: "117",
      QDes: "/\u5E3D\u5B50",
      QHide: "1",
      EMCode: "400433"
    },
    {
      QSid: "\u{1F457}",
      QCid: "128087",
      AQLid: "118",
      QDes: "/\u8FDE\u8863\u88D9",
      QHide: "1",
      EMCode: "400438"
    },
    {
      QSid: "\u{1F484}",
      QCid: "128132",
      AQLid: "119",
      QDes: "/\u53E3\u7EA2",
      QHide: "1",
      EMCode: "400591"
    },
    {
      QSid: "\u{1F460}",
      QCid: "128096",
      AQLid: "120",
      QDes: "/\u9AD8\u8DDF\u978B",
      QHide: "1",
      EMCode: "400447"
    },
    {
      QSid: "\u{1F462}",
      QCid: "128098",
      AQLid: "121",
      QDes: "/\u9774\u5B50",
      EMCode: "400449"
    },
    {
      QSid: "\u{1F302}",
      QCid: "127746",
      AQLid: "122",
      QDes: "/\u96E8\u4F1E",
      QHide: "1",
      EMCode: "400077"
    },
    {
      QSid: "\u{1F45C}",
      QCid: "128092",
      AQLid: "123",
      QDes: "/\u5305",
      QHide: "1",
      EMCode: "400443"
    },
    {
      QSid: "\u{1F459}",
      QCid: "128089",
      AQLid: "124",
      QDes: "/\u5185\u8863",
      QHide: "1",
      EMCode: "400440"
    },
    {
      QSid: "\u{1F455}",
      QCid: "128085",
      AQLid: "125",
      QDes: "/\u8863\u670D",
      QHide: "1",
      EMCode: "400436"
    },
    {
      QSid: "\u{1F45F}",
      QCid: "128095",
      AQLid: "126",
      QDes: "/\u978B\u5B50",
      QHide: "1",
      EMCode: "400446"
    },
    {
      QSid: "\u2601",
      QCid: "9729",
      AQLid: "127",
      QDes: "/\u4E91\u6735",
      QHide: "1",
      EMCode: "401329"
    },
    {
      QSid: "\u2600",
      QCid: "9728",
      AQLid: "128",
      QDes: "/\u6674\u5929",
      EMCode: "401328"
    },
    {
      QSid: "\u2614",
      QCid: "9748",
      AQLid: "129",
      QDes: "/\u96E8\u5929",
      QHide: "1",
      EMCode: "401342"
    },
    {
      QSid: "\u{1F319}",
      QCid: "127769",
      AQLid: "130",
      QDes: "/\u6708\u4EAE",
      QHide: "1",
      EMCode: "400100"
    },
    {
      QSid: "\u26C4",
      QCid: "9924",
      AQLid: "131",
      QDes: "/\u96EA\u4EBA",
      QHide: "1",
      EMCode: "401346"
    },
    {
      QSid: "\u2B55",
      QCid: "11093",
      AQLid: "132",
      QDes: "/\u6B63\u786E",
      QHide: "1",
      EMCode: "401687"
    },
    {
      QSid: "\u274C",
      QCid: "10060",
      AQLid: "133",
      QDes: "/\u9519\u8BEF",
      QHide: "1",
      EMCode: "401142"
    },
    {
      QSid: "\u2754",
      QCid: "10068",
      AQLid: "134",
      QDes: "/\u95EE\u53F7",
      EMCode: "401145"
    },
    {
      QSid: "\u2755",
      QCid: "10069",
      AQLid: "135",
      QDes: "/\u53F9\u53F7",
      QHide: "1",
      EMCode: "401146"
    },
    {
      QSid: "\u260E",
      QCid: "9742",
      AQLid: "136",
      QDes: "/\u7535\u8BDD",
      QHide: "1",
      EMCode: "401398"
    },
    {
      QSid: "\u{1F4F7}",
      QCid: "128247",
      AQLid: "137",
      QDes: "/\u76F8\u673A",
      QHide: "1",
      EMCode: "400726"
    },
    {
      QSid: "\u{1F4F1}",
      QCid: "128241",
      AQLid: "138",
      QDes: "/\u624B\u673A",
      QHide: "1",
      EMCode: "400720"
    },
    {
      QSid: "\u{1F4E0}",
      QCid: "128224",
      AQLid: "139",
      QDes: "/\u4F20\u771F",
      QHide: "1",
      EMCode: "400703"
    },
    {
      QSid: "\u{1F4BB}",
      QCid: "128187",
      AQLid: "140",
      QDes: "/\u7535\u8111",
      QHide: "1",
      EMCode: "400666"
    },
    {
      QSid: "\u{1F3A5}",
      QCid: "127909",
      AQLid: "141",
      QDes: "/\u6444\u5F71\u673A",
      QHide: "1",
      EMCode: "400214"
    },
    {
      QSid: "\u{1F3A4}",
      QCid: "127908",
      AQLid: "142",
      QDes: "/\u8BDD\u7B52",
      QHide: "1",
      EMCode: "400213"
    },
    {
      QSid: "\u{1F52B}",
      QCid: "128299",
      AQLid: "143",
      QDes: "/\u624B\u67AA",
      EMCode: "400774"
    },
    {
      QSid: "\u{1F4BF}",
      QCid: "128191",
      AQLid: "144",
      QDes: "/\u5149\u789F",
      QHide: "1",
      EMCode: "400670"
    },
    {
      QSid: "\u{1F493}",
      QCid: "128147",
      AQLid: "145",
      QDes: "/\u7231\u5FC3",
      EMCode: "400621"
    },
    {
      QSid: "\u2663",
      QCid: "9827",
      AQLid: "146",
      QDes: "/\u6251\u514B",
      QHide: "1",
      EMCode: "401385"
    },
    {
      QSid: "\u{1F004}",
      QCid: "126980",
      AQLid: "147",
      QDes: "/\u9EBB\u5C06",
      QHide: "1",
      EMCode: "401386"
    },
    {
      QSid: "\u303D",
      QCid: "12349",
      AQLid: "148",
      QDes: "/\u80A1\u7968",
      QHide: "1",
      EMCode: "401691"
    },
    {
      QSid: "\u{1F3B0}",
      QCid: "127920",
      AQLid: "149",
      QDes: "/\u8001\u864E\u673A",
      QHide: "1",
      EMCode: "400225"
    },
    {
      QSid: "\u{1F6A5}",
      QCid: "128677",
      AQLid: "150",
      QDes: "/\u4FE1\u53F7\u706F",
      QHide: "1",
      EMCode: "400980"
    },
    {
      QSid: "\u{1F6A7}",
      QCid: "128679",
      AQLid: "151",
      QDes: "/\u8DEF\u969C",
      QHide: "1",
      EMCode: "400982"
    },
    {
      QSid: "\u{1F3B8}",
      QCid: "127928",
      AQLid: "152",
      QDes: "/\u5409\u4ED6",
      QHide: "1",
      EMCode: "400233"
    },
    {
      QSid: "\u{1F488}",
      QCid: "128136",
      AQLid: "153",
      QDes: "/\u7406\u53D1\u5385",
      QHide: "1",
      EMCode: "400610"
    },
    {
      QSid: "\u{1F6C0}",
      QCid: "128704",
      AQLid: "154",
      QDes: "/\u6D74\u7F38",
      QHide: "1",
      EMCode: "401022"
    },
    {
      QSid: "\u{1F6BD}",
      QCid: "128701",
      AQLid: "155",
      QDes: "/\u9A6C\u6876",
      QHide: "1",
      EMCode: "401019"
    },
    {
      QSid: "\u{1F3E0}",
      QCid: "127968",
      AQLid: "156",
      QDes: "/\u5BB6",
      QHide: "1",
      EMCode: "400271"
    },
    {
      QSid: "\u26EA",
      QCid: "9962",
      AQLid: "157",
      QDes: "/\u6559\u5802",
      QHide: "1",
      EMCode: "401281"
    },
    {
      QSid: "\u{1F3E6}",
      QCid: "127974",
      AQLid: "158",
      QDes: "/\u94F6\u884C",
      QHide: "1",
      EMCode: "400277"
    },
    {
      QSid: "\u{1F3E5}",
      QCid: "127973",
      AQLid: "159",
      QDes: "/\u533B\u9662",
      QHide: "1",
      EMCode: "400276"
    },
    {
      QSid: "\u{1F3E8}",
      QCid: "127976",
      AQLid: "160",
      QDes: "/\u9152\u5E97",
      QHide: "1",
      EMCode: "400279"
    },
    {
      QSid: "\u{1F3E7}",
      QCid: "127975",
      AQLid: "161",
      QDes: "/\u53D6\u6B3E\u673A",
      QHide: "1",
      EMCode: "400278"
    },
    {
      QSid: "\u{1F3EA}",
      QCid: "127978",
      AQLid: "162",
      QDes: "/\u4FBF\u5229\u5E97",
      EMCode: "400281"
    },
    {
      QSid: "\u{1F6B9}",
      QCid: "128697",
      AQLid: "163",
      QDes: "/\u7537\u6027",
      QHide: "1",
      EMCode: "401015"
    },
    {
      QSid: "\u{1F6BA}",
      QCid: "128698",
      AQLid: "164",
      QDes: "/\u5973\u6027",
      QHide: "1",
      EMCode: "401016"
    }
  ]
};

// src/ntqqapi/entities.ts
import pathLib from "node:path";
import { stat, copyFile, unlink, mkdir } from "node:fs/promises";

// src/support/utils/file.ts
import fs2 from "node:fs";
import fsPromise from "node:fs/promises";
import path3 from "node:path";
import * as fileType from "file-type";

// src/support/image-size/lib/fromFile.ts
import * as fs from "node:fs";
import * as path2 from "node:path";

// src/support/image-size/lib/types/utils.ts
var decoder = new TextDecoder();
var toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
var toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + `0${i.toString(16)}`.slice(-2), "");
var getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
var readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
var readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
var readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
var readUInt24LE = (input, offset = 0) => {
  const view = getView(input, offset);
  return view.getUint16(0, true) + (view.getUint8(2) << 16);
};
var readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
var readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
var readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
var readUInt64 = (input, offset, isBigEndian) => getView(input, offset).getBigUint64(0, !isBigEndian);
var methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset = 0, isBigEndian = false) {
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = `readUInt${bits}${endian}`;
  return methods[methodName](input, offset);
}
function readBox(input, offset) {
  if (input.length - offset < 4) return;
  const boxSize = readUInt32BE(input, offset);
  if (input.length - offset < boxSize) return;
  return {
    name: toUTF8String(input, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(input, boxName, currentOffset) {
  while (currentOffset < input.length) {
    const box = readBox(input, currentOffset);
    if (!box) break;
    if (box.name === boxName) return box;
    currentOffset += box.size > 0 ? box.size : 8;
  }
}

// src/support/image-size/lib/types/bmp.ts
var BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

// src/support/image-size/lib/types/ico.ts
var TYPE_ICON = 1;
var SIZE_HEADER = 2 + 2 + 2;
var SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize(input, imageIndex) {
  const offset = SIZE_HEADER + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
var ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize2 = getImageSize(input, 0);
    if (nbImages === 1) return imageSize2;
    const images = [];
    for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) {
      images.push(getImageSize(input, imageIndex));
    }
    return {
      width: imageSize2.width,
      height: imageSize2.height,
      images
    };
  }
};

// src/support/image-size/lib/types/cur.ts
var TYPE_CURSOR = 2;
var CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

// src/support/image-size/lib/types/dds.ts
var DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

// src/support/image-size/lib/types/gif.ts
var gifRegexp = /^GIF8[79]a/;
var GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

// src/support/image-size/lib/types/heif.ts
var brandMap = {
  avif: "avif",
  mif1: "heif",
  msf1: "heif",
  // heif-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
var HEIF = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "ftyp") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand in brandMap;
  },
  calculate(input) {
    const metaBox = findBox(input, "meta", 0);
    const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
    if (!ipcoBox) {
      throw new TypeError("Invalid HEIF, no ipco box found");
    }
    const type = toUTF8String(input, 8, 12);
    const images = [];
    let currentOffset = ipcoBox.offset + 8;
    while (currentOffset < ipcoBox.offset + ipcoBox.size) {
      const ispeBox = findBox(input, "ispe", currentOffset);
      if (!ispeBox) break;
      const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
      const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
      const clapBox = findBox(input, "clap", currentOffset);
      let width = rawWidth;
      let height = rawHeight;
      if (clapBox && clapBox.offset < ipcoBox.offset + ipcoBox.size) {
        const cropRight = readUInt32BE(input, clapBox.offset + 12);
        width = rawWidth - cropRight;
      }
      images.push({ height, width });
      currentOffset = ispeBox.offset + ispeBox.size;
    }
    if (images.length === 0) {
      throw new TypeError("Invalid HEIF, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      type,
      ...images.length > 1 ? { images } : {}
    };
  }
};

// src/support/image-size/lib/types/icns.ts
var SIZE_HEADER2 = 4 + 4;
var FILE_LENGTH_OFFSET = 4;
var ENTRY_LENGTH_OFFSET = 4;
var ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize2(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
var ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER2;
    const images = [];
    while (imageOffset < fileLength && imageOffset < inputLength) {
      const imageHeader = readImageHeader(input, imageOffset);
      const imageSize2 = getImageSize2(imageHeader[0]);
      images.push(imageSize2);
      imageOffset += imageHeader[1];
    }
    if (images.length === 0) {
      throw new TypeError("Invalid ICNS, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      ...images.length > 1 ? { images } : {}
    };
  }
};

// src/support/image-size/lib/types/j2c.ts
var J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => readUInt32BE(input, 0) === 4283432785,
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

// src/support/image-size/lib/types/jp2.ts
var JP2 = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "jP  ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jp2 ";
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

// src/support/image-size/lib/types/jpg.ts
var EXIF_MARKER = "45786966";
var APP1_DATA_SIZE_BYTES = 2;
var EXIF_HEADER_BYTES = 6;
var TIFF_BYTE_ALIGN_BYTES = 2;
var BIG_ENDIAN_BYTE_ALIGN = "4d4d";
var LITTLE_ENDIAN_BYTE_ALIGN = "4949";
var IDF_ENTRY_BYTES = 12;
var NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    if (block.length < IDF_ENTRY_BYTES) {
      return;
    }
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
var JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(_input) {
    let input = _input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      validateInput(input, i);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

// src/support/image-size/lib/utils/bit-reader.ts
var BitReader = class {
  constructor(input, endianness) {
    this.input = input;
    this.endianness = endianness;
  }
  input;
  endianness;
  // Skip the first 16 bits (2 bytes) of signature
  byteOffset = 2;
  bitOffset = 0;
  /** Reads a specified number of bits, and move the offset */
  getBits(length = 1) {
    let result = 0;
    let bitsRead = 0;
    while (bitsRead < length) {
      if (this.byteOffset >= this.input.length) {
        throw new Error("Reached end of input");
      }
      const currentByte = this.input[this.byteOffset];
      const bitsLeft = 8 - this.bitOffset;
      const bitsToRead = Math.min(length - bitsRead, bitsLeft);
      if (this.endianness === "little-endian") {
        const mask = (1 << bitsToRead) - 1;
        const bits = currentByte >> this.bitOffset & mask;
        result |= bits << bitsRead;
      } else {
        const mask = (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead;
        const bits = (currentByte & mask) >> 8 - this.bitOffset - bitsToRead;
        result = result << bitsToRead | bits;
      }
      bitsRead += bitsToRead;
      this.bitOffset += bitsToRead;
      if (this.bitOffset === 8) {
        this.byteOffset++;
        this.bitOffset = 0;
      }
    }
    return result;
  }
};

// src/support/image-size/lib/types/jxl-stream.ts
function calculateImageDimension(reader, isSmallImage) {
  if (isSmallImage) {
    return 8 * (1 + reader.getBits(5));
  }
  const sizeClass = reader.getBits(2);
  const extraBits = [9, 13, 18, 30][sizeClass];
  return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
  if (isSmallImage && widthMode === 0) {
    return 8 * (1 + reader.getBits(5));
  }
  if (widthMode === 0) {
    return calculateImageDimension(reader, false);
  }
  const aspectRatios = [1, 1.2, 4 / 3, 1.5, 16 / 9, 5 / 4, 2];
  return Math.floor(height * aspectRatios[widthMode - 1]);
}
var JXLStream = {
  validate: (input) => {
    return toHexString(input, 0, 2) === "ff0a";
  },
  calculate(input) {
    const reader = new BitReader(input, "little-endian");
    const isSmallImage = reader.getBits(1) === 1;
    const height = calculateImageDimension(reader, isSmallImage);
    const widthMode = reader.getBits(3);
    const width = calculateImageWidth(reader, isSmallImage, widthMode, height);
    return { width, height };
  }
};

// src/support/image-size/lib/types/jxl.ts
function extractCodestream(input) {
  const jxlcBox = findBox(input, "jxlc", 0);
  if (jxlcBox) {
    return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
  }
  const partialStreams = extractPartialStreams(input);
  if (partialStreams.length > 0) {
    return concatenateCodestreams(partialStreams);
  }
  return void 0;
}
function extractPartialStreams(input) {
  const partialStreams = [];
  let offset = 0;
  while (offset < input.length) {
    const jxlpBox = findBox(input, "jxlp", offset);
    if (!jxlpBox) break;
    partialStreams.push(
      input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size)
    );
    offset = jxlpBox.offset + jxlpBox.size;
  }
  return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
  const totalLength = partialCodestreams.reduce(
    (acc, curr) => acc + curr.length,
    0
  );
  const codestream = new Uint8Array(totalLength);
  let position = 0;
  for (const partial of partialCodestreams) {
    codestream.set(partial, position);
    position += partial.length;
  }
  return codestream;
}
var JXL = {
  validate: (input) => {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "JXL ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jxl ";
  },
  calculate(input) {
    const codestream = extractCodestream(input);
    if (codestream) return JXLStream.calculate(codestream);
    throw new Error("No codestream found in JXL container");
  }
};

// src/support/image-size/lib/types/ktx.ts
var KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

// src/support/image-size/lib/types/png.ts
var pngSignature = "PNG\r\n\n";
var pngImageHeaderChunkName = "IHDR";
var pngFriedChunkName = "CgBI";
var PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

// src/support/image-size/lib/types/pnm.ts
var PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
var handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: Number.parseInt(dimensions[1], 10),
        width: Number.parseInt(dimensions[0], 10)
      };
    }
    throw new TypeError("Invalid PNM");
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = Number.parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    }
    throw new TypeError("Invalid PAM");
  }
};
var PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

// src/support/image-size/lib/types/psd.ts
var PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

// src/support/image-size/lib/types/svg.ts
var svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
var extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
var INCH_CM = 2.54;
var units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
var unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = root.match(extractorRegExps.width);
  const height = root.match(extractorRegExps.height);
  const viewbox = root.match(extractorRegExps.viewbox);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
var SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = toUTF8String(input).match(extractorRegExps.root);
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

// src/support/image-size/lib/types/tga.ts
var TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

// src/support/image-size/lib/types/tiff.ts
var CONSTANTS = {
  TAG: {
    WIDTH: 256,
    HEIGHT: 257,
    COMPRESSION: 259
  },
  TYPE: {
    SHORT: 3,
    LONG: 4,
    LONG8: 16
  },
  ENTRY_SIZE: {
    STANDARD: 12,
    BIG: 20
  },
  COUNT_SIZE: {
    STANDARD: 2,
    BIG: 8
  }
};
function readIFD(input, { isBigEndian, isBigTiff }) {
  const ifdOffset = isBigTiff ? Number(readUInt64(input, 8, isBigEndian)) : readUInt(input, 32, 4, isBigEndian);
  const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
  return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(input, type, offset, isBigEndian) {
  switch (type) {
    case CONSTANTS.TYPE.SHORT:
      return readUInt(input, 16, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG:
      return readUInt(input, 32, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG8: {
      const value = Number(readUInt64(input, offset, isBigEndian));
      if (value > Number.MAX_SAFE_INTEGER) {
        throw new TypeError("Value too large");
      }
      return value;
    }
    default:
      return 0;
  }
}
function nextTag(input, isBigTiff) {
  const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
  if (input.length > entrySize) {
    return input.slice(entrySize);
  }
}
function extractTags(input, { isBigEndian, isBigTiff }) {
  const tags = {};
  let temp = input;
  while (temp?.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = isBigTiff ? Number(readUInt64(temp, 4, isBigEndian)) : readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) {
      const valueOffset = isBigTiff ? 12 : 8;
      tags[code] = readTagValue(temp, type, valueOffset, isBigEndian);
    }
    temp = nextTag(temp, isBigTiff);
  }
  return tags;
}
function determineFormat(input) {
  const signature = toUTF8String(input, 0, 2);
  const version = readUInt(input, 16, 2, signature === "MM");
  return {
    isBigEndian: signature === "MM",
    isBigTiff: version === 43
  };
}
function validateBigTIFFHeader(input, isBigEndian) {
  const byteSize = readUInt(input, 16, 4, isBigEndian);
  const reserved = readUInt(input, 16, 6, isBigEndian);
  if (byteSize !== 8 || reserved !== 0) {
    throw new TypeError("Invalid BigTIFF header");
  }
}
var signatures = /* @__PURE__ */ new Set([
  "49492a00",
  // Little Endian
  "4d4d002a",
  // Big Endian
  "49492b00",
  // BigTIFF Little Endian
  "4d4d002b"
  // BigTIFF Big Endian
]);
var TIFF = {
  validate: (input) => {
    const signature = toHexString(input, 0, 4);
    return signatures.has(signature);
  },
  calculate(input) {
    const format = determineFormat(input);
    if (format.isBigTiff) {
      validateBigTIFFHeader(input, format.isBigEndian);
    }
    const ifdBuffer = readIFD(input, format);
    const tags = extractTags(ifdBuffer, format);
    const info = {
      height: tags[CONSTANTS.TAG.HEIGHT],
      width: tags[CONSTANTS.TAG.WIDTH],
      type: format.isBigTiff ? "bigtiff" : "tiff"
    };
    if (tags[CONSTANTS.TAG.COMPRESSION]) {
      info.compression = tags[CONSTANTS.TAG.COMPRESSION];
    }
    if (!info.width || !info.height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return info;
  }
};

// src/support/image-size/lib/types/webp.ts
function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
var WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(_input) {
    const chunkHeader = toUTF8String(_input, 12, 16);
    const input = _input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      }
      throw new TypeError("Invalid WebP");
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

// src/support/image-size/lib/types/index.ts
var typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["jxl", JXL],
  ["jxl-stream", JXLStream],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
var types = Array.from(typeHandlers.keys());

// src/support/image-size/lib/detector.ts
var firstBytes = /* @__PURE__ */ new Map([
  [0, "heif"],
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((type2) => typeHandlers.get(type2).validate(input));
}

// src/support/image-size/lib/lookup.ts
var globalOptions = {
  disabledTypes: []
};
function imageSize(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.indexOf(type) > -1) {
      throw new TypeError(`disabled file type: ${type}`);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      if (size.images && size.images.length > 1) {
        const largestImage = size.images.reduce((largest, current) => {
          return current.width * current.height > largest.width * largest.height ? current : largest;
        }, size.images[0]);
        size.width = largestImage.width;
        size.height = largestImage.height;
      }
      return size;
    }
  }
  throw new TypeError(`unsupported file type: ${type}`);
}

// src/support/image-size/lib/fromFile.ts
var MaxInputSize = 1024 * 1024;
var queue = [];
var concurrency = 100;
var processQueue = async () => {
  const jobs = queue.splice(0, concurrency);
  const promises2 = jobs.map(async ({ filePath, resolve: resolve3, reject }) => {
    let handle;
    try {
      handle = await fs.promises.open(path2.resolve(filePath), "r");
    } catch (err) {
      return reject(err);
    }
    try {
      const { size } = await handle.stat();
      if (size <= 0) {
        throw new Error("Empty file");
      }
      const inputSize = Math.min(size, MaxInputSize);
      const input = new Uint8Array(inputSize);
      await handle.read(input, 0, inputSize, 0);
      resolve3(imageSize(input));
    } catch (err) {
      reject(err);
    } finally {
      await handle.close();
    }
  });
  await Promise.allSettled(promises2);
  if (queue.length) setTimeout(processQueue, 100);
};
var imageSizeFromFile = async (filePath) => new Promise((resolve3, reject) => {
  queue.push({ filePath, resolve: resolve3, reject });
  processQueue();
});

// src/support/utils/file.ts
import { randomUUID, createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
function checkUriType(uri) {
  if (uri.startsWith("base64://")) {
    return { type: 3 /* OneBotBase64 */ };
  }
  if (uri.startsWith("data:")) {
    return { type: 4 /* DataURL */ };
  }
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return { type: 2 /* RemoteURL */ };
  }
  if (uri.startsWith("file://")) {
    return { type: 1 /* FileURL */ };
  }
  if (fs2.existsSync(uri)) {
    return { type: 5 /* Path */ };
  }
  return { type: 0 /* Unknown */ };
}
async function fetchFile(url, headersInit) {
  const headers = new Headers({
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    "Host": new URL(url).hostname,
    ...headersInit
  });
  let raw = await fetch(url, { headers }).catch((err) => {
    if (err.cause) {
      throw err.cause;
    }
    throw err;
  });
  if (raw.status === 403 && !headers.has("Referer")) {
    headers.set("Referer", url);
    raw = await fetch(url, { headers }).catch((err) => {
      if (err.cause) {
        throw err.cause;
      }
      throw err;
    });
  }
  if (!raw.ok) throw new Error(`statusText: ${raw.statusText}`);
  return {
    data: Buffer.from(await raw.arrayBuffer()),
    url: raw.url
  };
}
async function uri2local(ctx, uri, needExt, fileName) {
  const { type } = checkUriType(uri);
  if (type === 1 /* FileURL */) {
    const filePath = fileURLToPath(uri);
    if (!fs2.existsSync(filePath)) {
      return { success: false, errMsg: "\u8DEF\u5F84\u4E0D\u5B58\u5728", fileName: "", path: "", isLocal: false };
    }
    const fileName2 = path3.basename(filePath);
    return { success: true, errMsg: "", fileName: fileName2, path: filePath, isLocal: true };
  }
  if (type === 5 /* Path */) {
    const fileName2 = path3.basename(uri);
    return { success: true, errMsg: "", fileName: fileName2, path: uri, isLocal: true };
  }
  if (type === 2 /* RemoteURL */) {
    try {
      const res = await fetchFile(uri);
      if (fileName) {
        const filePath = path3.join(TEMP_DIR, randomUUID());
        await fsPromise.writeFile(filePath, res.data);
        return { success: true, errMsg: "", fileName, path: filePath, isLocal: false };
      } else {
        let fileName2 = randomUUID();
        let filePath = path3.join(TEMP_DIR, fileName2);
        await fsPromise.writeFile(filePath, res.data);
        if (needExt) {
          const ext = (await getFileType(filePath)).ext;
          fileName2 += `.${ext}`;
          const newPath = `${filePath}.${ext}`;
          await fsPromise.rename(filePath, newPath);
          filePath = newPath;
        }
        return { success: true, errMsg: "", fileName: fileName2, path: filePath, isLocal: false };
      }
    } catch (e) {
      const errMsg = `${uri} \u4E0B\u8F7D\u5931\u8D25, ${e.message}`;
      return { success: false, errMsg, fileName: "", path: "", isLocal: false };
    }
  }
  if (type === 3 /* OneBotBase64 */) {
    let filename = randomUUID();
    let filePath = path3.join(TEMP_DIR, filename);
    const base64 = uri.replace(/^base64:\/\//, "");
    await fsPromise.writeFile(filePath, base64, "base64");
    if (needExt) {
      const ext = (await getFileType(filePath)).ext;
      filename += `.${ext}`;
      await fsPromise.rename(filePath, `${filePath}.${ext}`);
      filePath = `${filePath}.${ext}`;
    }
    return { success: true, errMsg: "", fileName: filename, path: filePath, isLocal: false };
  }
  if (type === 4 /* DataURL */) {
    const capture = /^data:([\w/.+-]+);base64,(.*)$/.exec(uri);
    if (capture) {
      let filename = randomUUID();
      const [, _type, base64] = capture;
      let filePath = path3.join(TEMP_DIR, filename);
      await fsPromise.writeFile(filePath, base64, "base64");
      if (needExt) {
        const ext = (await getFileType(filePath)).ext;
        filename += `.${ext}`;
        await fsPromise.rename(filePath, `${filePath}.${ext}`);
        filePath = `${filePath}.${ext}`;
      }
      return { success: true, errMsg: "", fileName: filename, path: filePath, isLocal: false };
    }
  }
  if (type === 0 /* Unknown */) {
    let fileName2;
    let fileCache = await ctx.store.getFileCacheById(uri);
    if (!fileCache.length) {
      fileCache = await ctx.store.getFileCacheByName(uri);
      if (fileCache.length) {
        fileName2 = uri;
      }
    }
    if (fileCache.length) {
      const isGroup = fileCache[0].chatType === 2 /* Group */;
      let url;
      if (fileCache[0].elementType === 2 /* Pic */) {
        url = await ctx.ntFileApi.getImageUrl(fileCache[0].originImageUrl, fileCache[0].md5HexStr, {
          fileUuid: fileCache[0].fileUuid,
          isGroup,
          peerUid: fileCache[0].peerUid
        });
      } else if (fileCache[0].elementType === 5 /* Video */) {
        url = await ctx.ntFileApi.getVideoUrl(fileCache[0].fileUuid, isGroup);
      } else if (fileCache[0].elementType === 4 /* Ptt */) {
        url = await ctx.ntFileApi.getPttUrl(fileCache[0].fileUuid, isGroup);
      } else if (fileCache[0].elementType === 3 /* File */) {
        url = (await ctx.ntFileApi.getFileUrl(fileCache[0].fileUuid, isGroup, isGroup ? fileCache[0].peerUid : ctx.qqProtocol.selfInfo.uid)).url;
      }
      if (url) {
        return await uri2local(ctx, url, needExt, fileName2);
      } else {
        return { success: false, errMsg: `\u4E0D\u652F\u6301\u7684\u6587\u4EF6\u7C7B\u578B: ${fileCache[0].elementType}`, fileName: "", path: "", isLocal: false };
      }
    }
  }
  return { success: false, errMsg: `\u672A\u77E5\u6587\u4EF6\u7C7B\u578B\u6216\u8DEF\u5F84\u4E0D\u5B58\u5728: ${uri}`, fileName: "", path: "", isLocal: false };
}
async function getFileType(filePath) {
  try {
    const type = await fileType.fileTypeFromFile(filePath);
    if (!type) {
      return {
        mime: "application/octet-stream",
        ext: path3.extname(filePath).slice(0) || ""
      };
    }
    return {
      mime: type.mime,
      ext: type.ext
    };
  } catch (error) {
    getLogger("file-util").error("Error detecting file type:", error);
    return {
      mime: "",
      ext: ""
    };
  }
}
async function getImageSize3(path6) {
  return await imageSizeFromFile(path6);
}
function getMd5HexFromBuffer(buf) {
  return createHash("md5").update(buf).digest("hex");
}
function getSha1HexFromBuffer(buf) {
  return createHash("sha1").update(buf).digest("hex");
}
async function getMd5HexFromFile(filePath) {
  const hash = createHash("md5");
  const stream = fs2.createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}
async function getSha1HexFromFile(filePath) {
  const hash = createHash("sha1");
  const stream = fs2.createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest("hex");
}
function getMd5BufferFromBuffer(buf) {
  return createHash("md5").update(buf).digest();
}
async function getMd5BufferFromFile(filePath) {
  const hash = createHash("md5");
  const stream = fs2.createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest();
}
async function getSha1BufferFromFile(filePath) {
  const hash = createHash("sha1");
  const stream = fs2.createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.digest();
}
var Sha1Stream = class _Sha1Stream {
  static padding = new Uint8Array([
    128,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0
  ]);
  _state;
  _count;
  _buffer;
  _w;
  constructor() {
    this._state = new Uint32Array(5);
    this._count = new Uint32Array(2);
    this._buffer = new Uint8Array(64);
    this._w = new Uint32Array(80);
    this.reset();
  }
  reset() {
    this._state[0] = 1732584193;
    this._state[1] = 4023233417;
    this._state[2] = 2562383102;
    this._state[3] = 271733878;
    this._state[4] = 3285377520;
    this._count[0] = 0;
    this._count[1] = 0;
  }
  transform(chunk) {
    const w = this._w;
    for (let i = 0; i < 16; i++) {
      const j = i * 4;
      w[i] = chunk[j] << 24 | chunk[j + 1] << 16 | chunk[j + 2] << 8 | chunk[j + 3];
    }
    for (let i = 16; i < 80; i++) {
      const v = w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16];
      w[i] = v << 1 | v >>> 31;
    }
    let a = this._state[0];
    let b = this._state[1];
    let c = this._state[2];
    let d = this._state[3];
    let e = this._state[4];
    const K1 = 1518500249;
    const K2 = 1859775393;
    const K3 = 2400959708;
    const K4 = 3395469782;
    for (let i = 0; i < 20; i++) {
      const t = (a << 5 | a >>> 27) + (b & c | ~b & d) + e + w[i] + K1 >>> 0;
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t;
    }
    for (let i = 20; i < 40; i++) {
      const t = (a << 5 | a >>> 27) + (b ^ c ^ d) + e + w[i] + K2 >>> 0;
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t;
    }
    for (let i = 40; i < 60; i++) {
      const t = (a << 5 | a >>> 27) + (b & c | b & d | c & d) + e + w[i] + K3 >>> 0;
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t;
    }
    for (let i = 60; i < 80; i++) {
      const t = (a << 5 | a >>> 27) + (b ^ c ^ d) + e + w[i] + K4 >>> 0;
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t;
    }
    this._state[0] = this._state[0] + a >>> 0;
    this._state[1] = this._state[1] + b >>> 0;
    this._state[2] = this._state[2] + c >>> 0;
    this._state[3] = this._state[3] + d >>> 0;
    this._state[4] = this._state[4] + e >>> 0;
  }
  update(data) {
    if (!(data instanceof Uint8Array)) {
      data = new Uint8Array(data);
    }
    const len = data.length;
    let index = this._count[0] >>> 3 & 63;
    this._count[0] += len << 3;
    if (this._count[0] < len << 3) this._count[1]++;
    this._count[1] += len >>> 29;
    const partLen = 64 - index;
    let i = 0;
    if (len >= partLen) {
      this._buffer.set(data.subarray(0, partLen), index);
      this.transform(this._buffer);
      for (i = partLen; i + 63 < len; i += 64) {
        this.transform(data.subarray(i, i + 64));
      }
      index = 0;
    }
    this._buffer.set(data.subarray(i), index);
  }
  hash(bigEnding = true) {
    const out = new Uint8Array(20);
    const st = this._state;
    if (bigEnding) {
      out[0] = st[0] >>> 24;
      out[1] = st[0] >>> 16 & 255;
      out[2] = st[0] >>> 8 & 255;
      out[3] = st[0] & 255;
      out[4] = st[1] >>> 24;
      out[5] = st[1] >>> 16 & 255;
      out[6] = st[1] >>> 8 & 255;
      out[7] = st[1] & 255;
      out[8] = st[2] >>> 24;
      out[9] = st[2] >>> 16 & 255;
      out[10] = st[2] >>> 8 & 255;
      out[11] = st[2] & 255;
      out[12] = st[3] >>> 24;
      out[13] = st[3] >>> 16 & 255;
      out[14] = st[3] >>> 8 & 255;
      out[15] = st[3] & 255;
      out[16] = st[4] >>> 24;
      out[17] = st[4] >>> 16 & 255;
      out[18] = st[4] >>> 8 & 255;
      out[19] = st[4] & 255;
    } else {
      out[0] = st[0] & 255;
      out[1] = st[0] >>> 8 & 255;
      out[2] = st[0] >>> 16 & 255;
      out[3] = st[0] >>> 24;
      out[4] = st[1] & 255;
      out[5] = st[1] >>> 8 & 255;
      out[6] = st[1] >>> 16 & 255;
      out[7] = st[1] >>> 24;
      out[8] = st[2] & 255;
      out[9] = st[2] >>> 8 & 255;
      out[10] = st[2] >>> 16 & 255;
      out[11] = st[2] >>> 24;
      out[12] = st[3] & 255;
      out[13] = st[3] >>> 8 & 255;
      out[14] = st[3] >>> 16 & 255;
      out[15] = st[3] >>> 24;
      out[16] = st[4] & 255;
      out[17] = st[4] >>> 8 & 255;
      out[18] = st[4] >>> 16 & 255;
      out[19] = st[4] >>> 24;
    }
    return out;
  }
  final() {
    const digest = new Uint8Array(20);
    const bits = new Uint8Array(8);
    for (let i = 0; i < 8; i++) {
      const byteIndex = i >= 4 ? 0 : 1;
      const shift = (3 - (i & 3)) * 8;
      bits[i] = this._count[byteIndex] >>> shift & 255;
    }
    const index = this._count[0] >>> 3 & 63;
    const padLen = index < 56 ? 56 - index : 120 - index;
    this.update(_Sha1Stream.padding.subarray(0, padLen));
    this.update(bits);
    for (let i = 0; i < 20; i++) {
      const word = this._state[i >> 2];
      const shift = (3 - (i & 3)) * 8;
      digest[i] = word >>> shift & 255;
    }
    return digest;
  }
};
async function calculateSha1StreamBytes(filePath) {
  const sha1 = new Sha1Stream();
  const blockSize = 1024 * 1024;
  let tail = Buffer.alloc(0);
  let bytesRead = 0;
  let nextBlockBoundary = blockSize;
  const byteArrayList = [];
  const readable = fs2.createReadStream(filePath);
  for await (const chunk of readable) {
    let buf;
    if (tail.length > 0) {
      buf = Buffer.concat([tail, chunk]);
      tail = Buffer.alloc(0);
    } else {
      buf = chunk;
    }
    let offset = 0;
    while (buf.length - offset >= 64) {
      sha1.update(buf.subarray(offset, offset + 64));
      offset += 64;
      bytesRead += 64;
      if (bytesRead >= nextBlockBoundary) {
        byteArrayList.push(Buffer.from(sha1.hash(false)));
        nextBlockBoundary += blockSize;
      }
    }
    tail = buf.subarray(offset);
  }
  if (tail.length > 0) {
    sha1.update(tail);
  }
  byteArrayList.push(Buffer.from(sha1.final()));
  return byteArrayList;
}
async function readAndHash10M(filePath) {
  const maxSize = 10002432;
  const fd = await fsPromise.open(filePath, "r");
  const buffer = Buffer.allocUnsafe(maxSize);
  const { bytesRead } = await fd.read(buffer, 0, maxSize, 0);
  await fd.close();
  return getMd5BufferFromBuffer(buffer.subarray(0, bytesRead));
}
var TriSha1 = class {
  hasher = createHash("sha1");
  offset = 0;
  fileSize;
  ranges;
  constructor(fileSize) {
    this.fileSize = fileSize;
    if (fileSize < 30 * 1024 * 1024) {
      this.ranges = [[0, fileSize]];
    } else {
      this.ranges = [
        [0, 10 * 1024 * 1024 - 1],
        [
          (fileSize >> 1) - 5 * 1024 * 1024,
          (fileSize >> 1) + 5 * 1024 * 1024 - 1
        ],
        [fileSize - 10 * 1024 * 1024, fileSize - 1]
      ];
    }
  }
  update(data) {
    const start = this.offset;
    const end = start + data.length;
    for (const [rs, re] of this.ranges) {
      const from = Math.max(start, rs);
      const to = Math.min(end, re + 1);
      if (from < to) {
        const slice = data.subarray(
          from - start,
          to - start
        );
        this.hasher.update(slice);
      }
    }
    this.offset = end;
  }
  finalize() {
    const sizeBytes = Buffer.allocUnsafe(8);
    sizeBytes.writeBigUInt64LE(BigInt(this.fileSize));
    this.hasher.update(sizeBytes);
    return this.hasher.digest();
  }
};
async function calculateTriSha1(filePath, fileSize) {
  const hash = new TriSha1(fileSize);
  const stream = fs2.createReadStream(filePath);
  for await (const chunk of stream) {
    hash.update(chunk);
  }
  return hash.finalize();
}

// src/support/utils/video.ts
import path4 from "node:path";
import { writeFile } from "node:fs/promises";
import { randomUUID as randomUUID2 } from "node:crypto";
var defaultVideoThumbB64 = "/9j/4AAQSkZJRgABAQAAAQABAAD//gAXR2VuZXJhdGVkIGJ5IFNuaXBhc3Rl/9sAhAAKBwcIBwYKCAgICwoKCw4YEA4NDQ4dFRYRGCMfJSQiHyIhJis3LyYpNCkhIjBBMTQ5Oz4+PiUuRElDPEg3PT47AQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAF/APADAREAAhEBAxEB/8QBogAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoLEAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+foBAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKCxEAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDiAayNxwagBwNAC5oAM0xBmgBM0ANJoAjY0AQsaBkTGgCM0DEpAFAC0AFMBaACgAoEJTASgQlACUwCgQ4UAOFADhQA4UAOFADxQIkBqDQUGgBwagBQaBC5pgGaAELUAMLUARs1AETGgBhNAxhoASkAUALQIKYxaBBQAUwEoAQ0CEoASmAUAOoEKKAHCgBwoAeKAHigQ7NZmoZpgLmgBd1Ahd1ABupgNLUAMLUAMY0AMJoAYaAENACUCCgAoAWgAoAWgBKYCUAJQISgApgLQAooEOFACigB4oAeKBDxQAVmaiZpgGaAFzQAbqAE3UAIWpgNJoAYTQIaaAEoAQ0CEoASgBaACgBaACmAUAJQAlAgoAKYC0AKKBCigB4FADgKBDwKAHigBuazNRM0DEzTAM0AJmgAzQAhNAhpNACGmA2gQlACUCEoAKACgBaAFpgFACUAJQAUCCmAUALQIcBQA4CgB4FADgKBDhQA4UAMzWZqNzTGJQAZoATNABmgBKAEoEIaYCUCEoASgQlABQAtABQAtMBKACgAoEFABimAYoEKBQA4CgB4FADwKBDgKAFFADhQBCazNhKAEpgFACUAFACUAFAhDTAbQISgAoEJQAUALQAtMAoAKADFABigQYoAMUALimIUCgBwFAh4FADgKAHUALQAtAENZmwlACUwEoAKAEoAKACgQlMBpoEJQAUCCgBcUAFABTAXFAC4oAMUAGKBBigAxQIKYCigQ8UAOFADhQAtAC0ALQBDWZqJQMSgBKYBQAlABQISgBKYCGgQlAC0CCgBcUAFABTAUCkA7FMAxQAYoEJQAUCCmAooEOFADxQA4UAFAC0ALQBDWZqJQAlACUxhQAlABQIKAEoASmISgBcUCCgBaACgBcUAKBQAuKYC0CEoAQ0AJQISmAooEPFADhQA4UALQAtAC0AQ1maiUAFACUAJTAKAEoAKAEoAMUxBigAxQIWgAoAKAFAoAWgBaYBQIQ0ANNACUCCmIUUAOFADxQA4UALQAtABQBFWZqFACUAFACYpgFACUAFACUAFAgxTEFABQAUALQAooAWgAoAKYDTQIaaAEpiCgQ4UAOFAh4oGOFAC0ALSAKYEdZmglABQAUDDFACUwEoASgAoAKBBQIKYBQAUALQAtAC0AJQAhpgNJoENJoATNMQCgQ8UCHigB4oAWgYtABQAUAMrM0CgAoAKADFACUxiUAJQAlAgoAKYgoAKACgYtAC0AFAhDTAQmgBhNAhpNACZpiFBoEPFAEi0CHigB1ABQAUDEoAbWZoFABQAtABTAQ0ANNAxDQAlAhaAEpiCgAoGFAC0AFABmgBCaYhpNADCaBDSaBBmgABpiJFNAEimgB4NADqAFzQAlACE0AJWZoFAC0AFAC0wEIoAaaAG0AJQAUCCgApjCgAoAKADNABmgBpNMQ0mgBpNAhhNAgzQAoNADwaAHqaAJAaBDgaYC5oATNACZoAWszQKACgBaBDqYCGgBpoAYaBiUCCgBKYBQMKACgAoAM0AITQIaTQA0mmA0mgQ3NAhKAHCgBwNADwaAHg0AOBpiFzQAZoATNAD6zNAoAKAFoEOpgBoAaaAGGmAw0AJmgAzQMM0AGaADNABmgBM0AITQIaTQAhNMQw0AJQIKAFFADhQA4GgBwNADs0xC5oAM0CDNAEtZmoUCCgBaAHUwCgBppgRtQAw0ANzQAZoAM0AGaADNABmgBKAEoAQ0ANNMQhoEJQAlMBaQDgaAFBoAcDTAdmgQuaADNAgzQBPWZqFAgoAWgBaYC0CGmmBG1AyM0ANJoATNACZoAXNABmgAzQAUAJQAhoAQ0xDTQISmAUALQAUgHA0AKDTAdmgQuaBBQAtAFiszQKACgBaAFFMAoEIaYEbUDI2oAYaAEoASgAzQAuaACgAoAKAENMQ00AJTEFAhKACgAoAXNACg0AOBoAWgQtAC0AWazNAoAKACgBaYBQIQ0AMNMYw0AMIoAbQAlMAoAKACgAzSAKYhKAENACUxBQIKACgBKACgBaAHCgQ4UALQAUAWqzNAoAKACgApgFACGgQ00xjTQAwigBCKAG4pgJQAlABQAUCCgBKACgBKYgoEFABQISgAoAWgBRQA4UALQAUCLdZmoUAFABQAlMAoASgBDQA00wENACYoATFMBpFADSKAEoEJQAUAFABQAlMQtAgoASgQUAJQAUAKKAHCgBaBBQBbrM1CgAoAKACmAUAJQAlADaYBQAlACYpgIRQA0igBpFAhtABQAUAFMAoEFABQIKAEoASgQUALQAooAWgQUAW81mbC0CCgApgFACUAIaAEpgJQAUAFABQAhFMBpFADSKAGkUCExQAYoAMUAGKADFMQYoAMUCExSATFABQIKYBQAtABQIt5qDYM0ALmgQtIApgIaAENADaACmAlAC0ALQAUwGkUANIoAaRQAmKBBigAxQAYoAMUAGKBBigBMUAJigQmKAExTAKBC0AFAFnNQaig0AKDQAtAgoASgBDQAlMBKACgAFADhQAtMBCKAGkUAIRQAmKADFABigQmKADFACYoAXFABigQmKAExQAmKBCYpgJigAoAnzUGgZoAcDQAuaBC0AJQAhoASmAlABQAtADhQAtMAoATFACEUAJigAxQAYoATFAhMUAFABQAuKADFABigBpWgBCKBCYpgJigB+ag0DNADgaBDgaAFzQITNACUAJTAKACgBRQAopgOoAWgBKAEoAKACgAoASgBpoEJQAooAWgBaBhigBMUCEIoAQigBMUAJSLCgBQaBDgaQC5oEFACUwCgBKACmAtADhQA4UALQAUAJQAUAJQAUAJQAhoENoAWgBRQAooGLQAUAGKAGkUAIRQIZSKEoGKKBDhQAUCCgAoAKBBQAUwFoGKKAHCgBaACgAoASgAoASgBCaAEoEJmgAoAUGgBQaAHZoGFABQAUANoAjpDEoAWgBaAFoEFACUALQAUCCmAUAOFAxRQAtAC0AJQAUAJQAmaBDSaAEzQAmaYBmgBQaAHA0gFzQAuaBhmgAzQAlAEdIYUALQAtAgoAKAEoEFAC0AFMAoAUUDFFAC0ALQAUAJQAhoENNACE0wEoATNABmgBc0ALmgBc0gDNAC5oATNABmgBKRQlACigB1AgoASgQlABTAWgBKACgBaBi0ALQAZoAM0AFACGgQ00wENACUAJQAUCFzQMM0ALmgAzQAZoAM0AGaQC0igoAUUALQIWgBDQISmAUAFACUAFABQAuaBi5oAM0AGaBBmgBKAEpgIaAG0AJQAUCFoAM0DDNAC5oATNABmgAzQBJUlBQAooAWgQtACGmIaaACgAoASgBKACgBc0DCgQUAGaADNABTASgBDQAlACUAFAgoAKBhQAUAFABQAlAE1SUFAxRQIWgQtMBDQIQ0AJQAlAhKBiUAFABmgBc0AGaADNABTAKACgBKAEoASgQlABQAUAFAC0AFACUAFAE1SaBQAUCHCgQtMBKBCUAJQISgBDQA00DEzQAuaADNMBc0AGaADNABQAUAJQAlABQISgAoAKACgBaACgBKAEoAnqTQSgBRQIcKBC0xCUAJQISgBKAENADDQAmaYwzQAuaADNAC0AFABQAUAFAhKACgBKACgAoAWgAoELQAlAxKAJqk0EoAWgQooELTEFADaBCUABoENNMY00ANNAwzQAZoAXNAC0AFAC0CFoASgAoASgBKACgAoAWgQtABQAUANNAyWpNAoAKBCimIWgQUCEoASmIQ0ANNADTQMaaAEoGLmgAzQAtADhQIWgBaACgQhoASgYlACUALQIWgBaACgBKAENAyWpNBKYBQIcKBC0CEoEJTAKBCUANNADDQMQ0ANoGFAC5oAUGgBwNAhRQIWgBaAENACGgBtAwoAKAFzQIXNABmgAoAQ0DJKRoJQAtAhRQSLQIKYCUCCgBDQA00AMNAxpoGNoAM0AGaAFBoAcDQIcKBDqACgBDQAhoAQ0DEoAKADNAC5oEGaBhmgAoAkpGgUCCgQooELQIKYhKACgBKAGmgBpoGMNAxDQAlAwzQIUUAOFAhwoAcKBC0AJQAhoGNNACUAFABQAZoAXNABQAUAS0ixKACgQoNAhaYgoEFACUABoAaaAGmgYw0DENAxtABQAooEOFADhQIcKAFoASgBDQAhoGJQAUAFACUALQIKBi0CJDSLEoATNAhc0CHZpiCgQUAJQIKBjTQAhoGNNAxpoATFABigBQKAHCgBwoAWgAoAKACgBKAEoASgAoASgBaAAUAOoEONIoaTQAZoAUGmIUGgQtAgzQISgAoAQ0DGmgYlAxKACgAxQAtACigBRQAtAxaACgAoATFABigBCKAG0CEoAWgBRTAUUAf//Z";
var defaultVideoThumb = Buffer.from(defaultVideoThumbB64, "base64");
async function getVideoInfo(filePath, ctx) {
  const metadata = await getFFmpegAddon(ctx).probe(filePath);
  return {
    width: metadata.width,
    height: metadata.height,
    time: metadata.duration,
    format: metadata.format,
    size: metadata.size,
    filePath
  };
}
async function createThumb(ctx, videoFilePath) {
  ctx.logger.info("\u5F00\u59CB\u751F\u6210\u89C6\u9891\u7F29\u7565\u56FE", videoFilePath);
  let timeout;
  let thumbnail;
  try {
    thumbnail = await Promise.race([
      getFFmpegAddon(ctx).thumbnail(videoFilePath, { time: 0 }),
      new Promise((resolve3) => {
        timeout = setTimeout(() => resolve3(void 0), 5e3);
      })
    ]);
  } catch (error) {
    ctx.logger.warn("FFmpeg \u751F\u6210\u7F29\u7565\u56FE\u5931\u8D25:", error);
  } finally {
    clearTimeout(timeout);
  }
  if (!thumbnail) ctx.logger.info("\u83B7\u53D6\u89C6\u9891\u5C01\u9762\u5931\u8D25\uFF0C\u4F7F\u7528\u9ED8\u8BA4\u5C01\u9762");
  const thumbPath = path4.join(TEMP_DIR, randomUUID2() + (thumbnail ? ".png" : ".jpg"));
  await writeFile(thumbPath, thumbnail ?? defaultVideoThumb);
  return thumbPath;
}

// src/support/utils/audio.ts
import path5 from "node:path";

// src/support/utils/audioFormat.ts
var SILK_HEADER = Buffer.from("#!SILK_V3");
function isSilk(data) {
  const offset = data[0] === 2 ? 1 : 0;
  return data.subarray(offset, offset + SILK_HEADER.length).equals(SILK_HEADER);
}
function isWav(data) {
  return data.length >= 12 && data.toString("ascii", 0, 4) === "RIFF" && data.toString("ascii", 8, 12) === "WAVE";
}

// src/support/utils/audio.ts
import fsPromise2 from "node:fs/promises";
import { randomUUID as randomUUID3 } from "node:crypto";
function getSilkAddon(ctx) {
  const native = getFFmpegAddon(ctx);
  if (typeof native.silkVersion !== "function") {
    throw new FFmpegUnavailableError(`\u5F53\u524D FFmpeg \u63D2\u4EF6\u4E0D\u652F\u6301 SILK\uFF0C\u8BF7\u66F4\u65B0\u5E76\u542F\u7528 ${FFMPEG_PLUGIN}\uFF081.1.0 \u6216\u66F4\u65B0\u7248\u672C\uFF09\u540E\u91CD\u8BD5`);
  }
  return native;
}
async function encodeSilk(ctx, filePath) {
  const file = await fsPromise2.readFile(filePath);
  if (isSilk(file)) {
    let duration = 1;
    const native2 = tryGetFFmpegAddon(ctx);
    if (typeof native2?.silkVersion === "function") {
      try {
        duration = (await native2.probe(filePath)).duration;
      } catch (error) {
        ctx.logger.warn("\u83B7\u53D6\u8BED\u97F3\u6587\u4EF6\u65F6\u957F\u5931\u8D25\uFF0C\u9ED8\u8BA4\u4E3A 1 \u79D2", filePath, error);
      }
    } else {
      ctx.logger.warn(`SILK \u6587\u4EF6\u76F4\u63A5\u53D1\u9001\uFF0C\u65F6\u957F\u9ED8\u8BA4\u4E3A 1 \u79D2\uFF1B\u5B89\u88C5\u6216\u66F4\u65B0\u5E76\u542F\u7528 ${FFMPEG_PLUGIN} \u53EF\u8BFB\u53D6\u51C6\u786E\u65F6\u957F`);
    }
    return { converted: false, path: filePath, duration };
  }
  const native = getSilkAddon(ctx);
  const output = path5.join(TEMP_DIR, randomUUID3() + ".silk");
  ctx.logger.info(`\u8BED\u97F3\u6587\u4EF6 ${filePath} \u9700\u8981\u8F6C\u6362\u6210 SILK`);
  try {
    await native.transcodeAudio(filePath, output, { format: "silk" });
    const { duration } = await native.probe(output);
    return { converted: true, path: output, duration };
  } catch (error) {
    await fsPromise2.unlink(output).catch(() => {
    });
    throw error;
  }
}
async function decodeSilk(ctx, inputFilePath, outFormat) {
  const native = getSilkAddon(ctx);
  const output = path5.join(TEMP_DIR, randomUUID3() + "." + outFormat);
  try {
    await native.transcodeAudio(inputFilePath, output, { format: outFormat });
    return output;
  } catch (error) {
    await fsPromise2.unlink(output).catch(() => {
    });
    ctx.logger.error("SILK \u539F\u751F\u8F6C\u6362\u5931\u8D25\uFF1A", error);
    throw error;
  }
}

// src/ntqqapi/entities.ts
import { isNullable, noop } from "cosmokit";
var SendElement;
((SendElement2) => {
  function text(content) {
    return {
      elementType: 1 /* Text */,
      textElement: {
        content,
        atType: 0 /* Unknown */,
        atUin: 0
      }
    };
  }
  SendElement2.text = text;
  function at(atUin, atType, display) {
    return {
      elementType: 1 /* Text */,
      textElement: {
        content: display,
        atType,
        atUin
      }
    };
  }
  SendElement2.at = at;
  function reply(msgSeq, senderUin, senderUid, msgTime, clientSeq, srcMsg) {
    return {
      elementType: 7 /* Reply */,
      replyElement: {
        replyMsgSeq: msgSeq,
        senderUin,
        senderUid,
        replyMsgTime: msgTime,
        replyMsgClientSeq: clientSeq,
        srcMsg
      }
    };
  }
  SendElement2.reply = reply;
  async function pic(ctx, picPath, summary = "", subType = 0) {
    const fileSize = (await stat(picPath)).size;
    if (fileSize === 0) {
      throw new Error(`\u6587\u4EF6\u5F02\u5E38\uFF0C\u5927\u5C0F\u4E3A 0: ${picPath}`);
    }
    const size = await getImageSize3(picPath);
    return {
      elementType: 2 /* Pic */,
      picElement: {
        picWidth: size.width,
        picHeight: size.height,
        sourcePath: picPath,
        picSubType: subType,
        summary
      }
    };
  }
  SendElement2.pic = pic;
  async function video(ctx, filePath, diyThumbPath) {
    const fileSize = (await stat(filePath)).size;
    if (fileSize === 0) {
      throw new Error(`\u6587\u4EF6\u5F02\u5E38\uFF0C\u5927\u5C0F\u4E3A 0: ${filePath}`);
    }
    const maxMB = 1024;
    if (fileSize > 1024 * 1024 * maxMB) {
      throw new Error(`\u89C6\u9891\u8FC7\u5927\uFF0C\u6700\u5927\u652F\u6301${maxMB}MB\uFF0C\u5F53\u524D\u6587\u4EF6\u5927\u5C0F${fileSize}B`);
    }
    let videoInfo = {
      width: 1920,
      height: 1080,
      time: 15,
      format: "mp4",
      size: fileSize,
      filePath
    };
    try {
      videoInfo = await getVideoInfo(filePath, ctx);
      ctx.logger.info("\u89C6\u9891\u4FE1\u606F", videoInfo);
    } catch (e) {
      ctx.logger.info("\u83B7\u53D6\u89C6\u9891\u4FE1\u606F\u5931\u8D25", e);
    }
    const md5 = await getMd5HexFromFile(filePath);
    const thumbDir = TEMP_DIR;
    const thumbFilePath = pathLib.join(thumbDir, `${md5}_0.png`);
    await mkdir(thumbDir, { recursive: true });
    if (diyThumbPath) {
      await copyFile(diyThumbPath, thumbFilePath);
    } else {
      const path6 = await createThumb(ctx, videoInfo.filePath);
      await copyFile(path6, thumbFilePath);
      unlink(path6).catch(noop);
    }
    const element = {
      elementType: 5 /* Video */,
      videoElement: {
        filePath,
        fileTime: Math.trunc(videoInfo.time),
        thumbPath: thumbFilePath,
        thumbWidth: videoInfo.width,
        thumbHeight: videoInfo.height
      }
    };
    ctx.logger.info("videoElement", element);
    return element;
  }
  SendElement2.video = video;
  async function ptt(ctx, pttPath) {
    const { converted, path: silkPath, duration } = await encodeSilk(ctx, pttPath);
    const fileSize = (await stat(silkPath)).size;
    if (fileSize === 0) {
      throw new Error(`\u6587\u4EF6\u5F02\u5E38\uFF0C\u5927\u5C0F\u4E3A 0: ${silkPath}`);
    }
    return {
      elementType: 4 /* Ptt */,
      pttElement: {
        filePath: silkPath,
        duration
      }
    };
  }
  SendElement2.ptt = ptt;
  function face(faceId, faceType) {
    const sysFaces = face_config_default.sysface;
    const face2 = sysFaces.find((face3) => face3.QSid === String(faceId));
    if (!faceType) {
      if (faceId < 222) {
        faceType = 1;
      } else if (faceId < 1e5) {
        faceType = 2;
      } else {
        faceType = 4;
      }
      if (face2?.AniStickerType) {
        faceType = 3;
      }
    }
    return {
      elementType: 6 /* Face */,
      faceElement: {
        faceIndex: faceId,
        faceType,
        faceText: face2?.QDes ?? "",
        stickerId: face2?.AniStickerId,
        stickerType: face2?.AniStickerType,
        packId: face2?.AniStickerPackId
      }
    };
  }
  SendElement2.face = face;
  function mface(emojiPackageId, emojiId, key, summary) {
    return {
      elementType: 11 /* MarketFace */,
      marketFaceElement: {
        imageWidth: 300,
        imageHeight: 300,
        emojiPackageId,
        emojiId,
        key,
        faceName: summary || "[\u5546\u57CE\u8868\u60C5]"
      }
    };
  }
  SendElement2.mface = mface;
  function dice(resultId) {
    if (isNullable(resultId)) resultId = Math.floor(Math.random() * 6) + 1;
    return {
      elementType: 6 /* Face */,
      faceElement: {
        faceIndex: 358 /* Dice */,
        faceType: 3,
        faceText: "[\u9AB0\u5B50]",
        packId: "1",
        stickerId: "33",
        stickerType: 2,
        resultId: resultId.toString()
      }
    };
  }
  SendElement2.dice = dice;
  function rps(resultId) {
    if (isNullable(resultId)) resultId = Math.floor(Math.random() * 3) + 1;
    return {
      elementType: 6 /* Face */,
      faceElement: {
        faceIndex: 359 /* RPS */,
        faceText: "[\u5305\u526A\u9524]",
        faceType: 3,
        packId: "1",
        stickerId: "34",
        stickerType: 2,
        resultId: resultId.toString()
      }
    };
  }
  SendElement2.rps = rps;
  function ark(data) {
    return {
      elementType: 10 /* Ark */,
      arkElement: {
        bytesData: data
      }
    };
  }
  SendElement2.ark = ark;
  function shake() {
    return {
      elementType: 6 /* Face */,
      faceElement: {
        faceIndex: 1,
        faceType: 5,
        faceText: "",
        pokeType: 1
      }
    };
  }
  SendElement2.shake = shake;
  function forward(nodes, title, preview, summary, prompt) {
    return {
      elementType: 16 /* MultiForward */,
      multiForwardMsgElement: {
        nodes,
        title,
        preview,
        summary,
        prompt
      }
    };
  }
  SendElement2.forward = forward;
  async function file(ctx, filePath, fileName) {
    const fileSize = (await stat(filePath)).size;
    if (fileSize === 0) {
      throw new Error("\u6587\u4EF6\u5F02\u5E38\uFF0C\u5927\u5C0F\u4E3A 0");
    }
    const element = {
      elementType: 3 /* File */,
      fileElement: {
        fileName,
        filePath,
        fileSize
      }
    };
    return element;
  }
  SendElement2.file = file;
})(SendElement || (SendElement = {}));

// src/ntqqapi/helper/forwardMsg.ts
import { XMLParser } from "fast-xml-parser";

// src/support/utils/misc.ts
import { isNonNullable } from "cosmokit";
import { defineProperty } from "cosmokit";
function isNumeric(str) {
  return /^\d+$/.test(str);
}
function filterNullable(array) {
  return array.filter((e) => isNonNullable(e));
}
function parseBool(value) {
  if (["", "true", "1"].includes(value)) {
    return true;
  }
  return false;
}
function uint32ToIPV4Addr(value) {
  return [
    value & 255,
    value >> 8 & 255,
    value >> 16 & 255,
    value >> 24 & 255
  ].join(".");
}
function sleep(ms = 0) {
  return new Promise((resolve3) => setTimeout(resolve3, ms));
}
async function mapWithConcurrency(items, concurrency2, fn, shouldStop) {
  const results = new Array(items.length);
  if (items.length === 0) return results;
  const limit = Math.max(1, Math.min(concurrency2, items.length));
  let cursor = 0;
  let stopped = false;
  async function worker() {
    while (!stopped && cursor < items.length) {
      const i = cursor++;
      const r = await fn(items[i], i);
      results[i] = r;
      if (shouldStop?.(r, i)) {
        stopped = true;
        break;
      }
    }
  }
  await Promise.all(Array.from({ length: limit }, () => worker()));
  return results;
}
function isHttpUrl(str) {
  return /^https?:\/\/.+/.test(str);
}
function formatYYYYMMDD(date = /* @__PURE__ */ new Date()) {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}
function moveElement(arr, from, to) {
  if (arr.length === 0) return arr;
  if (from === to) return arr;
  const [item] = arr.splice(from, 1);
  arr.splice(to, 0, item);
  return arr;
}

// src/support/utils/group.ts
function groupCodeToGroupUin(groupCode) {
  let left = Math.floor(groupCode / 1e6);
  if (left >= 0 && left <= 10) left += 202;
  else if (left >= 11 && left <= 19) left += 480 - 11;
  else if (left >= 20 && left <= 66) left += 2100 - 20;
  else if (left >= 67 && left <= 156) left += 2010 - 67;
  else if (left >= 157 && left <= 209) left += 2147 - 157;
  else if (left >= 210 && left <= 309) left += 4100 - 210;
  else if (left >= 310 && left <= 499) left += 3800 - 310;
  return left * 1e6 + groupCode % 1e6;
}

// src/ntqqapi/helper/forwardMsg.ts
async function rawElementsToSend(ctx, elements, fromPeer) {
  const isGroup = fromPeer.chatType === 2 /* Group */;
  const selfUid = ctx.qqProtocol.selfInfo.uid;
  const out = [];
  const deleteAfterSentFiles = [];
  const fetchFile2 = async (url) => {
    const res = await uri2local(ctx, url);
    if (!res.success) {
      ctx.logger.error(res.errMsg);
      throw new Error(res.errMsg);
    }
    if (!res.isLocal) {
      deleteAfterSentFiles.push(res.path);
    }
    return res.path;
  };
  for (const e of elements) {
    if (e.textElement) {
      out.push(e);
    } else if (e.faceElement) {
      out.push(e);
    } else if (e.picElement) {
      const url = await ctx.ntFileApi.getImageUrl(e.picElement.originImageUrl, e.picElement.md5HexStr, {
        fileUuid: e.picElement.fileUuid,
        isGroup,
        peerUid: fromPeer.peerUid
      });
      const path6 = await fetchFile2(url);
      out.push(await SendElement.pic(ctx, path6));
    } else if (e.videoElement) {
      const url = await ctx.ntFileApi.getVideoUrl(e.videoElement.fileUuid, isGroup);
      const path6 = await fetchFile2(url);
      out.push(await SendElement.video(ctx, path6));
    } else if (e.pttElement) {
      const url = await ctx.ntFileApi.getPttUrl(e.pttElement.fileUuid, isGroup);
      const path6 = await fetchFile2(url);
      out.push(await SendElement.ptt(ctx, path6));
    } else if (e.fileElement) {
      const { url } = await ctx.ntFileApi.getFileUrl(
        e.fileElement.fileUuid,
        isGroup,
        isGroup ? fromPeer.peerUid : selfUid
      );
      const path6 = await fetchFile2(url);
      out.push(await SendElement.file(ctx, path6, e.fileElement.fileName));
    } else if (e.arkElement) {
      out.push(e);
    } else if (e.replyElement) {
      out.push(e);
    } else if (e.marketFaceElement) {
      out.push(e);
    } else if (e.multiForwardMsgElement) {
      const parser = new XMLParser();
      const content = parser.parse(e.multiForwardMsgElement.xmlContent);
      const uuid = e.multiForwardMsgElement.fileName;
      const prompt = e.multiForwardMsgElement.xmlContent.match(/brief="([^"]*)"/)?.[1] ?? "[\u804A\u5929\u8BB0\u5F55]";
      const json = JSON.stringify({
        app: "com.tencent.multimsg",
        config: {
          autosize: 1,
          forward: 1,
          round: 1,
          type: "normal",
          width: 300
        },
        desc: prompt,
        extra: JSON.stringify({
          filename: uuid,
          tsum: 0
        }),
        meta: {
          detail: {
            news: content.msg.item.title.slice(1).map((e2) => ({ text: e2 })),
            resid: e.multiForwardMsgElement.resId,
            source: content.msg.item.title[0],
            summary: content.msg.item.summary,
            uniseq: uuid
          }
        },
        prompt,
        ver: "0.0.0.5",
        view: "contact"
      });
      out.push(SendElement.ark(json));
    }
  }
  return { elements: out, deleteAfterSentFiles };
}

export {
  DATA_DIR,
  TEMP_DIR,
  dbDir,
  ensureRuntimeDirectories,
  isDebugEnabled,
  setConfigLogLevel,
  bindLoggerFactory,
  getLogger,
  installFFmpegBridge,
  getFFmpegAddon,
  setFFMpegPath,
  Action,
  Notify,
  Media,
  Oidb,
  Msg,
  Misc,
  face_config_default,
  fetchFile,
  uri2local,
  getFileType,
  getImageSize3 as getImageSize,
  getMd5HexFromBuffer,
  getSha1HexFromBuffer,
  getMd5HexFromFile,
  getSha1HexFromFile,
  getMd5BufferFromBuffer,
  getMd5BufferFromFile,
  getSha1BufferFromFile,
  calculateSha1StreamBytes,
  readAndHash10M,
  calculateTriSha1,
  isNumeric,
  filterNullable,
  parseBool,
  uint32ToIPV4Addr,
  sleep,
  mapWithConcurrency,
  isHttpUrl,
  formatYYYYMMDD,
  moveElement,
  groupCodeToGroupUin,
  createThumb,
  isSilk,
  isWav,
  decodeSilk,
  SendElement,
  rawElementsToSend
};

