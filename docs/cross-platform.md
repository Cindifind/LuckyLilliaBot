# 跨平台与平台接口

## 跨平台写法

### 通用元素与扩展元素

文本、at、quote、img、audio、video、file、p、br、message forward 等使用 Satori 元素形状。媒体格式、上传和合并转发仍由平台决定。四种扩展元素有统一能力声明和默认降级：

| 元素 | 写法 | 默认降级 |
|---|---|---|
| Markdown | `h('markdown', {}, '# 标题\n**粗体**')` | 转成通用文字、格式和图片元素 |
| 按钮 | `h('button', { text: '/sign' }, '签到')` | 指令提示或链接；回调按钮丢弃 |
| 卡片 | `h('card', { title, url, desc, image, prompt })` | 带链接的标题、描述和图片 |
| QQ 表情 | `h('face', { id: '13', name: '呲牙' })` | `[呲牙]`；未写 `name` 时为 `[表情]` |

**平台支持。** 官方机器人支持 Markdown 和按钮。卡片在官方群聊、单聊中转换为 Markdown（加粗的标题链接、描述和图片，原生 ark 需申请权限），在频道中使用 ark。QQ 账号和官方频道支持原生 QQ 表情。

**Markdown 降级。** 去掉 Markdown 标记后，粗体、链接、代码和图片仍保留为通用元素；列表使用“• ”，引用使用“｜”。

**按钮写法。** 一行按钮使用 `h('button-group', {}, [...])` 包裹，按钮类型决定点击行为：

| `type` | 相关字段 | 点击行为与降级 |
|---|---|---|
| 未指定或 `input` | `text`，缺省为按钮文字 | 点击发送指令；降级为“签到（发送「/sign」）”，文字与指令相同时为“「签到」” |
| `link` | `href` | 打开链接；降级为链接 |
| `action` | `id` | 产生 `interaction/button`，从 `session.event.button` 读取；没有通用降级行为，默认丢弃 |

官方专用按钮字段可通过 `action` 设置，优先于通用属性，详见 SDK 的 `ButtonAttrs`。

### 能力与流式回复

`bot.features` 中的 `message.markdown`、`message.button`、`message.card`、`message.face` 控制上述降级。其它能力只提供决策依据：

| 能力 | 含义 |
|---|---|
| `message.forward` | 合并转发 |
| `message.stream` | markdown stream 流式回复 |
| `message.proactive` | 支持主动发送，仍受平台额度和授权限制 |
| `guild.plain` | 群没有独立子频道，群 ID 同时作为会话 ID |

对同一回复使用相同 Session：

```ts
await session.send(h('markdown', { stream: true }, '第一部分。'))
await session.send(h('markdown', { stream: 'end' }, '\n最后一部分。'))
```

官方单聊把片段追加成一个气泡，群聊先缓冲、结束后合并。最终片段用 `stream: 'end'`，否则最后片段后 10 秒自动结束。缓冲期间发送结果可能没有 ID。不支持 `message.stream` 的 Bot 会逐片发送独立消息，应先判断能力决定逐片还是汇总发送。

Session 带回 `referrer`，能区分同一频道内并行生成的不同回复；仅使用频道最近消息可能关联错误。

### 自定义降级

`bot/fallback` 在 `bot/before-send` 后运行。宿主对不支持的 markdown/card/face 和每行按钮询问监听器，首个返回内容者生效；`undefined` 继续尝试或采用默认降级，空字符串丢弃。返回结果直接发送，不再递归降级。

```ts
ctx.on('bot/fallback', (bot, channelId, element) => {
  if (element.type !== 'face') return
  return h.text('表情：' + (element.attrs.name || element.attrs.id || '未知'))
})
```

渲染插件可调用自己的服务将 markdown 变为图片，再返回 h.image(png, 'image/png')。可选渲染服务用局部 `ctx.inject` 挂监听。不要返回目标平台仍不能处理的扩展元素。

### QQ 平台差异

#### 账号与资源 ID

NTQQ 的 `platform` 为 `ntqq`，提供普通 QQ 身份；官方机器人的 `platform` 为 `qq`，每个 AppID 只提供 `qq:<AppID>` 一个 Bot，统一承载群聊、单聊和频道。频道资源 ID 带 `qqguild:` 前缀，与群聊的数据空间隔离；它不是单独的 Bot 或平台。中立层允许同平台不同 `selfId`；可配置的账号数量由具体消息源插件决定。

官方机器人的 ID 约定如下，Bot 方法和会话使用同一套 ID：

| 对象 | ID 示例 |
|---|---|
| 群聊及其用户 | 群 openid、用户 openid，保持原值 |
| 单聊会话 | `private:<openid>` |
| 频道、子频道、频道用户、频道消息 | `qqguild:<腾讯原始 ID>` |
| 频道私信会话 | `private:qqguild:<私信 guild ID>_<私信 channel ID>` |
| 频道私信事件中的 `guildId` | `qqguild:<来源频道 ID>_<私信 guild ID>` |
| Bot 自身用户及对它的 @ | AppID，与 `bot.selfId` 一致 |

将 Session 或 Bot 返回的资源 ID 原样传给 Bot 方法；频道消息里的 `at`、`sharp`、`quote` 也使用对应的 ID。分页的 `next`、事件的 `referrer`、按钮 ID 和按钮数据都是不透明值，原样传回，不自行添加前缀。Satori 客户端同样只看到一个 `qq` login，频道消息通过这套资源 ID 区分。

OneBot、Milky、Satori 是对外传输协议，多开一个连接不等于多登录一个 QQ。OneBot 11 和 Milky 是依赖 NTQQ 账号服务的独立插件；Satori 是宿主内置适配器，可把中立层多个 Bot 作为不同 login 提供给外部客户端。

#### 消息与回复限制

- 官方群通常投递 @ Bot 的消息；全量群消息需要相应权限和订阅条件。匹配指令统一用 `stripped.content`，不假设原始内容以指令文本开头。
- 当前被动回复记账采用群消息 5 分钟 5 条、单聊 60 分钟 4 条，实际以平台响应为准。流式另有处理。没有可用被动目标时可能转主动发送，主动发送受每用户或群每月 4 条等限制和授权约束。`message.proactive` 不代表无限额度。
- send/reply 优先带回触发事件的 `referrer`；延时任务仍可能超过有效期，应处理失败。
- qq:ark24、qq:markdown、qq:rawmarkdown 等是平台专有元素；NT 商城表情和原始卡片是 ntqq:market-face、ntqq:ark。其它平台通常仅保留其子内容，不保证原样转发。
- 收到的 QQ 表情可转换为 face，NT 收到官方 markdown/按钮也会解为扩展元素，原始 ark 保留平台前缀。

## 管理操作与平台接口

### 通用管理方法

Bot 只保证 `sendMessage`，标准管理方法均为可选。调用前检查接口和所需 ID：

```ts
if (session.guildId && session.userId && session.bot.muteGuildMember) {
  await session.bot.muteGuildMember(session.guildId, session.userId, 60_000)
}
```

| 功能 | 方法 |
|---|---|
| 消息查询和删除 | `getMessage`、`getMessageList`、`deleteMessage` |
| 用户好友 | `getUser`、`getFriendList`、`deleteFriend`、`handleFriendRequest` |
| 群和频道 | `getGuild`、`getGuildList`、`getChannel`、`getChannelList`、`createChannel`、`updateChannel`、`deleteChannel`、`createDirectChannel` |
| 群成员管理 | `getGuildMember`、`getGuildMemberList`、`muteGuildMember`、`kickGuildMember`、`muteChannel` |
| 申请和角色 | `handleGuildRequest`、`handleGuildMemberRequest`、`getGuildRoleList`、`setGuildMemberRole`、`unsetGuildMemberRole` |
| 表情回应和菜单 | `createReaction`、`deleteReaction`、`getReactionList`、`updateCommands` |

列表通常返回 `{ data, next? }`，将 `next` 用于下一页；禁言时长为毫秒。方法存在不代表当前 Bot 有平台权限。完整参数见 [Bot 类型](../packages/plugin-sdk/src/universal.ts)。

### 平台独有的接口：bot.internal

没有通用方法的能力走 `bot.internal`，推荐 `internalOf(bot, platform)` 获得对应类型，平台不匹配时返回 `undefined`：

#### NTQQ

以下片段中的 `session` 来自消息或事件回调：

```ts
import { internalOf } from '@luckylillia/plugin-sdk'

const internal = internalOf(session.bot, 'ntqq')
if (internal && session.guildId && session.userId) {
  await internal.setGroupCard({
    group_id: session.guildId,
    user_id: session.userId,
    card: '新名片',
  })
}
```

NT internal 使用 NTQQ 插件提供的 OneBot 11 账号 action，含 go-cqhttp/LLOneBot 扩展。名称转为驼峰，`set_group_card` 对应 `setGroupCard`，`_send_group_notice` 对应 `sendGroupNotice`；参数仍是一个 OneBot 字段对象。返回 action 的 data，失败抛异常。消息 ID 参数可接收 `session.messageId`，但 OneBot 响应中的 message_id 仍可能是数字。需要已启用并登录的 NTQQ 协议，不需要安装或开启 OneBot 对外传输插件；普通插件使用 SDK 的 `internalOf()`，不要引用协议仓库的私有 action 文件。

下面列出常用入口。代码中使用驼峰方法名，全部接口和参数见 [SDK internal](../packages/plugin-sdk/src/internal.ts)。

| 用途 | 方法示例 |
|---|---|
| 戳一戳、合并转发、OCR | `sendPoke`、`getForwardMsg`、`ocrImage` |
| 群名片、头衔和群资料 | `setGroupCard`、`setGroupSpecialTitle`、`getGroupHonorInfo` |
| 群公告和精华消息 | `sendGroupNotice`、`getGroupNotice`、`setEssenceMsg` |
| 群文件和相册 | `uploadGroupFile`、`getGroupRootFiles`、`getGroupAlbumList` |
| 好友资料和自身状态 | `sendLike`、`setFriendRemark`、`setOnlineStatus` |
| 私聊文件和闪传 | `uploadPrivateFile`、`getFlashFileInfo`、`downloadFlashFile` |
| 凭据和扫码 | `getCookies`、`getCredentials`、`scanQrcode` |

已有标准方法的 action、版本、状态、缓存和配置等辅助接口也在 internal 中；仅连接专用 .handle_quick_operation/get_event 不提供。可用标准方法时优先使用，完整类型见 [SDK internal](../packages/plugin-sdk/src/internal.ts)，不依赖固定的 action 总数。

#### 官方机器人

官方 qq 的 internal 合并群聊、单聊和频道 REST API，参数仍使用腾讯原始 ID，按方法签名传位置参数，与 NT 的 OneBot 对象参数不同。`sendMessage/deleteMessage` 是群聊接口，频道用 `sendGuildMessage/deleteGuildMessage`；`internalOf(bot, 'qq')` 包含全部接口，不再有 qqguild 平台。原始平台事件通过 `bot/event` 的 internal 类型提供，`event._type` 是平台事件名，`event._data` 为原始数据。

标准 Bot 方法使用上面的资源 ID；只有调用原始 `internal` 接口时才去掉 `qqguild:` 前缀。例如查询频道的接口权限：

```ts
import { internalOf } from '@luckylillia/plugin-sdk'

const qq = internalOf(session.bot, 'qq')
if (qq && session.guildId?.startsWith('qqguild:')) {
  const guildId = session.guildId.slice('qqguild:'.length).split('_')[0]
  const permissions = await qq.getGuildApiPermissions(guildId)
}
```

SDK 的 `QQInternal` 包含全部官方接口；`QQGuildInternal` 仅作为已弃用的旧类型导出保留，不能再用 `internalOf(bot, 'qqguild')` 获取接口。
