var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/ntqqapi/types/user.ts
var Sex = /* @__PURE__ */ ((Sex2) => {
  Sex2[Sex2["Unknown"] = 0] = "Unknown";
  Sex2[Sex2["Male"] = 1] = "Male";
  Sex2[Sex2["Female"] = 2] = "Female";
  Sex2[Sex2["Hidden"] = 255] = "Hidden";
  return Sex2;
})(Sex || {});

// src/ntqqapi/types/group.ts
var GroupMsgMask = /* @__PURE__ */ ((GroupMsgMask2) => {
  GroupMsgMask2[GroupMsgMask2["AllowNotify"] = 1] = "AllowNotify";
  GroupMsgMask2[GroupMsgMask2["AllowNotNotify"] = 4] = "AllowNotNotify";
  GroupMsgMask2[GroupMsgMask2["BoxNotNotify"] = 2] = "BoxNotNotify";
  GroupMsgMask2[GroupMsgMask2["NotAllow"] = 3] = "NotAllow";
  return GroupMsgMask2;
})(GroupMsgMask || {});
var GroupMemberRole = /* @__PURE__ */ ((GroupMemberRole2) => {
  GroupMemberRole2[GroupMemberRole2["NotApplicable"] = 0] = "NotApplicable";
  GroupMemberRole2[GroupMemberRole2["Normal"] = 2] = "Normal";
  GroupMemberRole2[GroupMemberRole2["Admin"] = 3] = "Admin";
  GroupMemberRole2[GroupMemberRole2["Owner"] = 4] = "Owner";
  return GroupMemberRole2;
})(GroupMemberRole || {});

// src/ntqqapi/types/msg.ts
var ElementType = /* @__PURE__ */ ((ElementType2) => {
  ElementType2[ElementType2["Text"] = 1] = "Text";
  ElementType2[ElementType2["Pic"] = 2] = "Pic";
  ElementType2[ElementType2["File"] = 3] = "File";
  ElementType2[ElementType2["Ptt"] = 4] = "Ptt";
  ElementType2[ElementType2["Video"] = 5] = "Video";
  ElementType2[ElementType2["Face"] = 6] = "Face";
  ElementType2[ElementType2["Reply"] = 7] = "Reply";
  ElementType2[ElementType2["GrayTip"] = 8] = "GrayTip";
  ElementType2[ElementType2["Ark"] = 10] = "Ark";
  ElementType2[ElementType2["MarketFace"] = 11] = "MarketFace";
  ElementType2[ElementType2["LiveGift"] = 12] = "LiveGift";
  ElementType2[ElementType2["StructLongMsg"] = 13] = "StructLongMsg";
  ElementType2[ElementType2["Markdown"] = 14] = "Markdown";
  ElementType2[ElementType2["Giphy"] = 15] = "Giphy";
  ElementType2[ElementType2["MultiForward"] = 16] = "MultiForward";
  ElementType2[ElementType2["InlineKeyboard"] = 17] = "InlineKeyboard";
  ElementType2[ElementType2["Calendar"] = 19] = "Calendar";
  ElementType2[ElementType2["YoloGameResult"] = 20] = "YoloGameResult";
  ElementType2[ElementType2["AvRecord"] = 21] = "AvRecord";
  ElementType2[ElementType2["TofuRecord"] = 23] = "TofuRecord";
  ElementType2[ElementType2["FaceBubble"] = 27] = "FaceBubble";
  ElementType2[ElementType2["ShareLocation"] = 28] = "ShareLocation";
  ElementType2[ElementType2["TaskTopMsg"] = 29] = "TaskTopMsg";
  ElementType2[ElementType2["RecommendedMsg"] = 43] = "RecommendedMsg";
  ElementType2[ElementType2["ActionBar"] = 44] = "ActionBar";
  return ElementType2;
})(ElementType || {});
var AtType = /* @__PURE__ */ ((AtType2) => {
  AtType2[AtType2["Unknown"] = 0] = "Unknown";
  AtType2[AtType2["All"] = 1] = "All";
  AtType2[AtType2["One"] = 2] = "One";
  return AtType2;
})(AtType || {});
var IMAGE_HTTP_HOST = "https://gchat.qpic.cn";
var IMAGE_HTTP_HOST_NT = "https://multimedia.nt.qq.com.cn";
var PicType = /* @__PURE__ */ ((PicType2) => {
  PicType2[PicType2["GIF"] = 2e3] = "GIF";
  PicType2[PicType2["JPEG"] = 1e3] = "JPEG";
  return PicType2;
})(PicType || {});
var PicSubType = /* @__PURE__ */ ((PicSubType2) => {
  PicSubType2[PicSubType2["Normal"] = 0] = "Normal";
  PicSubType2[PicSubType2["Face"] = 1] = "Face";
  return PicSubType2;
})(PicSubType || {});
var FaceIndex = /* @__PURE__ */ ((FaceIndex2) => {
  FaceIndex2[FaceIndex2["Dice"] = 358] = "Dice";
  FaceIndex2[FaceIndex2["RPS"] = 359] = "RPS";
  return FaceIndex2;
})(FaceIndex || {});
var FaceType = /* @__PURE__ */ ((FaceType2) => {
  FaceType2[FaceType2["Old"] = 1] = "Old";
  FaceType2[FaceType2["Normal"] = 2] = "Normal";
  FaceType2[FaceType2["Super"] = 3] = "Super";
  FaceType2[FaceType2["Poke"] = 5] = "Poke";
  return FaceType2;
})(FaceType || {});
var ChatType = /* @__PURE__ */ ((ChatType2) => {
  ChatType2[ChatType2["C2C"] = 1] = "C2C";
  ChatType2[ChatType2["Group"] = 2] = "Group";
  ChatType2[ChatType2["TempC2CFromGroup"] = 100] = "TempC2CFromGroup";
  return ChatType2;
})(ChatType || {});

// src/ntqqapi/types/notify.ts
var FriendReqType = /* @__PURE__ */ ((FriendReqType2) => {
  FriendReqType2[FriendReqType2["MeInitiator"] = 0] = "MeInitiator";
  FriendReqType2[FriendReqType2["PeerInitiator"] = 1] = "PeerInitiator";
  FriendReqType2[FriendReqType2["MeAgreed"] = 2] = "MeAgreed";
  FriendReqType2[FriendReqType2["MeAgreedAndAdded"] = 3] = "MeAgreedAndAdded";
  FriendReqType2[FriendReqType2["PeerAgreed"] = 4] = "PeerAgreed";
  FriendReqType2[FriendReqType2["PeerAgreedAndAdded"] = 5] = "PeerAgreedAndAdded";
  FriendReqType2[FriendReqType2["PeerRefused"] = 6] = "PeerRefused";
  FriendReqType2[FriendReqType2["MeRefused"] = 7] = "MeRefused";
  FriendReqType2[FriendReqType2["MeIgnored"] = 8] = "MeIgnored";
  FriendReqType2[FriendReqType2["MeAgreeAnyone"] = 9] = "MeAgreeAnyone";
  FriendReqType2[FriendReqType2["MeSetQuestion"] = 10] = "MeSetQuestion";
  FriendReqType2[FriendReqType2["MeAgreeAndAddFailed"] = 11] = "MeAgreeAndAddFailed";
  FriendReqType2[FriendReqType2["MsgInfo"] = 12] = "MsgInfo";
  FriendReqType2[FriendReqType2["MeInitiatorWaitPeerConfirm"] = 13] = "MeInitiatorWaitPeerConfirm";
  return FriendReqType2;
})(FriendReqType || {});
var GroupNotificationType = /* @__PURE__ */ ((GroupNotificationType2) => {
  GroupNotificationType2[GroupNotificationType2["JoinRequest"] = 1] = "JoinRequest";
  GroupNotificationType2[GroupNotificationType2["Invitation"] = 2] = "Invitation";
  GroupNotificationType2[GroupNotificationType2["SetAdmin"] = 3] = "SetAdmin";
  GroupNotificationType2[GroupNotificationType2["Kick"] = 6] = "Kick";
  GroupNotificationType2[GroupNotificationType2["Quit"] = 13] = "Quit";
  GroupNotificationType2[GroupNotificationType2["UnsetAdmin"] = 16] = "UnsetAdmin";
  GroupNotificationType2[GroupNotificationType2["InvitedJoinRequest"] = 22] = "InvitedJoinRequest";
  return GroupNotificationType2;
})(GroupNotificationType || {});
var RequestState = /* @__PURE__ */ ((RequestState2) => {
  RequestState2[RequestState2["Init"] = 0] = "Init";
  RequestState2[RequestState2["Unhandle"] = 1] = "Unhandle";
  RequestState2[RequestState2["Agreed"] = 2] = "Agreed";
  RequestState2[RequestState2["Refused"] = 3] = "Refused";
  RequestState2[RequestState2["Ignored"] = 4] = "Ignored";
  return RequestState2;
})(RequestState || {});

// src/ntqqapi/types/flashfile.ts
var FlashFileUploadStatus = /* @__PURE__ */ ((FlashFileUploadStatus2) => {
  FlashFileUploadStatus2[FlashFileUploadStatus2["UPLOADED"] = 4] = "UPLOADED";
  return FlashFileUploadStatus2;
})(FlashFileUploadStatus || {});

export {
  __export,
  Sex,
  GroupMsgMask,
  GroupMemberRole,
  ElementType,
  AtType,
  IMAGE_HTTP_HOST,
  IMAGE_HTTP_HOST_NT,
  PicType,
  PicSubType,
  FaceIndex,
  FaceType,
  ChatType,
  FriendReqType,
  GroupNotificationType,
  RequestState,
  FlashFileUploadStatus
};

