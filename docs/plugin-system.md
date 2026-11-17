# 插件系统（host 侧）

Bot 进程本身就是一个 cordis 4 应用，插件运行时只是在根 `Context` 上多挂了一个服务：`PluginService`（`ctx.plugins`）。它负责扫描本地目录、读写插件条目与配置（当前实例的 `data/instances/<实例>/plugins.json`）、把每个启用的条目 `ctx.plugin()` 成一个 fiber，以及热重载。

作者视角的写法见 [plugin-authoring.md](plugin-authoring.md)。

## 代码位置

| 文件 | 作用 |
|---|---|
| `src/plugin/host/index.ts` | `PluginService`：条目状态机、enable / disable / updateConfig / reload / describe |
| `src/plugin/host/manifest.ts` | 扫描插件根目录、解析 `package.json` 的 `llbot` 字段、SDK 版本比对 |
| `src/plugin/host/store.ts` | 条目文件的读写（底层是 `src/common/jsonFile.ts`） |
| `src/common/schema/` | schemastery 线格式模型（`model.ts`）与按 schema 的差异 / 合并（`diff.ts`），前后端共用 |
| `src/plugin/host/resolve-hook.ts` | `module.registerHooks` 解析钩子 |
| `src/plugin/host/watcher.ts` | 目录监听（热重载） |
| `src/main/startupPlugins.ts` | 解析 `--plugin`，用 Market 安装器补齐缺失 npm 插件并在当前实例信任、启用 |
| `src/plugin/host/scope.ts` | 条目的生效范围（`EntryScope`）：规整，判断一个地方在不在范围里 |
| `src/universal/commands.ts` | 指令系统 `CommandService`（`ctx.commands` / `ctx.command()`），由内置条目 `builtin:commands` 挂载 |
| `src/universal/testing.ts` | `@luckylillia/plugin-sdk/testing` 的实现，`packages/plugin-sdk/scripts/build-testing.mjs` 打包成 SDK 的 `lib/testing.js` |
| `scripts/gen-sdk-internal.mts` | 从 `src/ntqq/onebot-actions.json` 的 NTQQ action 名称快照和官方机器人接口生成 SDK 的 `src/internal.ts`（`internalOf()` 与各平台 `bot.internal` 类型），`--check` 查是否过期 |
| `src/ntqq/`、`scripts/sync-ntqq-api.mjs` | 独立 NTQQ 插件的公开 API、类型声明和 action 名称快照；只包含消息帮助函数与契约，不包含登录、原生引擎或账号服务实现。先构建 NTQQ 插件，再用脚本刷新 |
| `src/plugin/internal/index.ts` | 内置插件的列表，条目定义在各自目录的 `builtin.ts`（见下文"内置插件"） |
| `packages/plugin-sdk/` | `@luckylillia/plugin-sdk`，yarn workspace，单独发 npm |
| `packages/plugin-sdk/template/`、`bin/luckylillia-plugin.mjs` | 插件模板和脚手架（`npx -p @luckylillia/plugin-sdk luckylillia-plugin create <dir>`：复制模板、填包名，`gitignore` 改名成 `.gitignore`，因为 npm 发布时会丢掉 `.gitignore`），随 SDK 发布。在 Bot 仓库中也可用 `node packages/plugin-sdk/bin/luckylillia-plugin.mjs create <dir>`。模板带自己的 `vitest.config.ts`：生成在别的项目里（Bot 仓库的 `data/plugins/`、monorepo）时，vitest 不会套上那个项目的配置、找不到插件的测试 |
| `test/fixtures/plugins/` | echo / hello 测试夹具（不进 dist）；开发示例见作者指南 |
| `../LuckyLillia.Plugins/lucky-lillia-aiprovider/` | 独立的 AI 服务插件 `aiprovider`，提供 `ctx.ai`；测试、构建和发布步骤见 [ai-plugins.md](ai-plugins.md) |
| `../LuckyLillia.Plugins/lucky-lillia-plugin-aiimgdetector/` | 独立的 AI 图片检测插件 `aiimgdetector`；测试、构建和发布步骤见 [ai-plugins.md](ai-plugins.md) |

`PluginService` 在 `src/main/main.ts` 里紧跟 `ConfigService` 挂载。NTQQ 扫码协议由独立可选包 `@luckylillia/plugin-nt-protocol` 提供，通过普通插件扫描、安装与信任流程加载；OneBot 11 和 Milky 也已提取为独立包（见下文“可选协议与适配器”）。`main.ts` 负责日志、配置、计时器、HTTP、`bots` 和插件服务；WebUI 自己仍是内置条目 `builtin:webui`。插件需要登录后才有的服务就自己 `inject`，没就绪时 fiber 停在 PENDING，cordis 会在服务出现后自动拉起。没有安装 NTQQ 时宿主、WebUI、数据库、官方机器人和 Satori 仍可启动。

**启动依赖就绪**：`main.ts` 先等待 `TimerService` ACTIVE，再挂载依赖它的 `PluginService`。Cordis 对 PENDING fiber 的 `await()` 会立即返回，不能把它当作依赖就绪屏障；否则启动 `--plugin` 可能抢在扫描、配置恢复和共享目录登记之前运行。

**登录后的资源**由 NT 协议自己的 `loginResources.ts` 管理，不再提供公共 `account` 服务。首次取得完整 UIN / UID 后创建按身份绑定的数据库、Store、Core 和 NT API；同一身份短暂断线保持这些资源，明确退出、换号或停用时销毁，后续登录重新创建。NTQQBot、OneBot、Milky、WebQQ 依赖实际使用的 `app` / `store` / NT API，自然等待登录完成。协议内部读取 `qqProtocol.selfInfo`，通用插件读取 `session.bot` / `ctx.bots`。配置在实例启动时选定，登录不切换配置；`main.ts` 启动时首播 `llob/config-updated`。NT 的 `<uin>.v3.db` 在隔离的 `database` / `model` 上，只供协议内部使用；插件的 `ctx.database` 是 `builtin:database` 提供的实例级 `data/instances/<实例>/database.db`，不依赖登录。

## 中立层（Satori）

插件只看到平台无关的一层：`ctx.bots`、`Session` 和 `bot/*` 事件，类型定义在 SDK 的 `packages/plugin-sdk/src/universal.ts`。数据模型直接用 `@satorijs/protocol` / `@satorijs/element`（不依赖 cordis）；`@satorijs/core` 还停在 cordis 3，不能用，`Bot` / `Session` 是自己实现的。

```
qq/raw ─► dispatcher ─► nt/*（28 个，平台原生层）
                         ├─► Core / OneBot11 / Milky / WebQQ / 邮件通知     各自直接订阅
                         └─► NTQQ 插件内的 NTQQBot（platform ntqq）─┐
开放平台网关 ─► qq-official 解码（统一为 qq）────────────────────┤
                                                                  ▼
                                                   ctx.bots.dispatch(bot, event)
                                                     ├─ 全部事件    ─► bot/session（parallel 旁路）─► Satori 适配器（所有 bot）
                                                     ├─ 别人的消息  ─► bot/message（waterfall 中间件链）
                                                     └─ 其余事件    ─► bot/event（parallel）
```

- **`nt/*` 永久保留**，不是过渡态：`nt/pin-changed`、`nt/ptt-trans-result`、`nt/profile-like`、`nt/group-essence-message-changed` 在 Satori 里没有对应事件，OneBot / Milky 依赖这些细节
- `src/universal/bots.ts`：`BotsService`（`ctx.bots`）。`register(bot)` 用调用方的 `ctx.effect` 登记，调用方插件卸载时 bot 自动注销 —— 靠的是 cordis 的 tracker：经 `ctx.bots` 访问时方法里的 `this.ctx` 是调用方的 ctx。这些方法跑在实例的 shadow 上，只能改字段内容、不能重新赋值字段
- **`bot/session` 是不受中间件影响的旁路**：每个事件路由前先广播一次，监听器出错只记日志、不影响路由。Satori 适配器只订阅它 —— 若挂在 `bot/message` 上，本地插件的中间件（比如黑名单）就能决定 Satori 客户端看到什么，而 OneBot 仍直接订阅 `nt/*`，两边会不一致
- **Satori 适配器只是 `ctx.bots` 上的一层传输**，不碰任何 NT 服务，见下文"Satori 适配器"。中立层不再迁就它的线上格式（`id` 兼容字段、`login` 的形状、`llonebot` 这个名字都是适配器在出口加的）。NT 账号由独立 NTQQ 协议插件的 `src/universal/` 注册到 `ctx.bots`，随该插件和登录资源一起启停；宿主不再有 `builtin:ntqq-universal` 内置条目
- **bot 自己发出的消息不进 `bot/message`**，走 `bot/event`：中间件只看它能回应的消息，避免回复自己造成循环（Koishi 也是这么做的）
- `bot/before-send` 只覆盖经 `bot.sendMessage` 发出的消息。OneBot / Milky 的 `send_msg` 直接调 `ctx.app.sendMessage`，刻意不拦：否则插件能悄悄改写下游客户端的消息。真有需要时在 `Core.sendMessage` 加钩子，按 breaking change 处理
- `src/universal/session.ts`：`Session` 的驼峰字段都是从 snake_case 的 Satori 事件里读的；`elements` 是对 `content` 的懒 `h.parse()`
- **插件的监听器经 `ListenerPolicy` 分发**（`BotsService.usePolicy()`；`PluginService` 在 init 里设，依赖方向是 host → universal）：`owner(ctx)` 用 `entryOfFiber` 找监听器属于哪个条目，`accepts(id, place)` 按条目的生效范围过滤 `bot/session` / `bot/message` / `bot/event` / `bot/before-send` 的监听器（`place` 是 Session，发送时由目标频道拼出来），`rank(id)` 是 `plugins.json` 的 `messageOrder` 里的位置（排过的在前，没排的按注册顺序在后，`prepend` 只在没排的里面起作用），`failed(id, error)` 把监听器抛的错记到条目上（`PluginStatus.listenerError`，同一条目每秒最多通知一次 WebUI，条目重新 ACTIVE 或用户点「知道了」清掉）。`global` 监听器和不属于任何条目的代码不过滤、不排序。没有 policy（单测、测试工具）时就是 cordis 原来的行为
- `bot/message` 和 `bot/before-send` 是自己实现的 waterfall（`chain()`），`bot/session` / `bot/event` 是 `fanOut()`：一个监听器抛错只跳过它 —— 在 `next()` 之前抛的，链照常往后走；之后抛的，已经做的算数。原来用 cordis 的 waterfall / parallel，一个插件抛错整条链中止，后面的插件都收不到
- `session.prompt()`：`BotsService.prompt()` 按 `平台 + selfId + channelId + userId` 记一个等待，`dispatch` 先看有没有人在等这条消息，有就交给它、不进 `bot/message`；同一处再问一次，前一个等待得到 undefined；服务卸载时全部 undefined。`sendQueued()` 按 `sid + channelId` 排队，每条发完再空 `delay`（默认 1 秒）
- **指令权限**：内置「指令」页在指令表的“谁能用”中编辑权限，和前缀等设置一起通过 `usePluginConfig()` 保存。`builtin:commands.config.permissions` 是 `{ owner, command, authority }[]`，按插件条目 id 和不区分大小写的指令原名匹配，空 owner 表示宿主指令；原名和所有别名共用，同名的其他条目独立。没有覆盖时使用插件的 `CommandConfig.authority`，再默认 `everyone`。`CommandInfo.authority` 返回生效值，`defaultAuthority` 返回声明值；选“默认”删除对应覆盖。停用或重载插件保留覆盖，配置更新仍走 `internal/update`，不重启指令服务或依赖它的插件。行为测试见 `test/unit/universal/commandPermissions.test.ts`。
- **指令与消息元素**：匹配时只在 `session.stripped.content` 的首个文本元素里找前缀和命令名，因此真实图片、@ 等元素也可紧接命令名或别名，剩余的元素标记完整交给参数解析；转义后的标签仍算普通文字。action 的 `argv.next()` 可显式继续后续消息中间件（最多一次），直接返回 undefined 则结束处理。aiimgdetector 据此注册 `ai吗`，支持统一前缀并保留直接带图、引用取图及按会话冷却；没图或冷却中主动 `next()`
- **指令**（`src/universal/commands.ts`，内置条目 `builtin:commands`）：`CommandService` 是 `ctx.commands`，`ctx.command()` 是 mixin，注册在调用方的 `ctx.effect` 上。它在 `bot/message` 上挂一个 `prepend` 的中间件，属于 `builtin:commands`，所以在「消息处理顺序」设置页里就是「指令」那一行。匹配：前缀（设置的 `prefixes`，`bare` 时再加空前缀）+ 最长的指令名或别名，候选只取注册它的条目 `accepts` 这个 Session 的；然后权限（主人在设置页逐行选择平台、填写用户 ID，落盘为 `平台:id` 或裸 id；群管理员看 `event.member.roles`，没有再问 `bot.getGuildMember`）、冷却、参数解析（`tokenize` 用私用区字符占住引号里的空白），解析错误和自己的提示都用 `h.text()` 发，免得用法里的 `<user:user>` 被当成元素。action 抛错 `bots.reportFailure()` 记到条目上。同名指令都注册，`list()` 标出重名（`/api/commands`）。**不带 help**（owner 2026-11-03）：原来有 `help` / `帮助` 指令和设置里的开关，连同只给它用的 `.usage()` / `.example()` 一起去掉了；要的插件自己注册（同名就是普通指令）。`bot/status` 和指令增删（2 秒内合并）时把非 hidden 的指令经 `bot.updateCommands()` 同步给有菜单的平台，同一个 bot 的同一份菜单不重复写。QQ 官方机器人（`platform=qq`）不参与指令插件的自动菜单同步，上线、指令增删和重连均不注册到 QQ 单聊菜单 / 群聊面板；消息里的指令与别名仍照常执行
- `../LuckyLillia.Plugins/lucky-lillia-plugin-ntqq-protocol/src/universal/`：NTQQ 协议插件内部的消息接入模块和 `NTQQBot`，由协议入口挂在登录资源分支下；依赖 `app` / `store` 等账号服务以及宿主的 `bots`。首次登录注册 Bot，同身份断线保留 Bot 并更新状态，换号、退出或停用协议时注销，登录恢复后重新注册。`NTQQBot.platform` 是 `ntqq`（owner 2026-11-12），sid `ntqq:<QQ号>`，它自己的元素是 `ntqq:market-face` / `ntqq:ark`。Satori 客户端一直看到的是 `llonebot`，名字由 Satori 适配器在出口换（`wire.ts`），插件看到的是 `ntqq`

**NT → 通用消息模型的转换由 NTQQ 协议插件提供**（该包的 `src/universal/`）：

| 能力 | 位置 |
|---|---|
| NT 消息 → `h[]` / Satori 资源 | `utils.ts` 的 `decodeElement()` / `decodeMessage()` 等，消息 id 的编解码 |
| 12 种 `nt/*` → Satori 事件 | `event/*.ts` 的 `parseXxx(host, data)`，`host` 是 NTQQ 插件 `src/universal/types.ts` 的结构性接口 `NormalizeHost`（只要 `ctx` 和 `event()`），现在只有 `NTQQBot` 调用 |
| `h[]` → NT 发送元素 → 发出 | `message.ts` 的 `MessageEncoder` |
| Bot 的可选能力 | `api.ts`：消息的读、删、列表，用户、好友（列表、删除、通过申请），群（列表、信息、改名、全员禁言、退群、通过邀请），成员（信息、列表、禁言、踢、通过申请），角色（列表、设置 / 取消管理员），表态（加、删、列表）。`NTQQBot` 按 Satori 的方法名和参数顺序包一层（NTQQ 插件的 `test/universal/ntqq.test.ts`） |
| 平台独有的接口 `bot.internal` | `internal.ts` 从 NTQQ 插件提供的 `ctx.ntOnebot.actionMap` 构造接口；action 实现位于该插件的 `src/onebot/`，独立 OneBot 传输插件未安装或已停用也能使用。名字驼峰化，参数是 OneBot 的对象，`retcode` 非 0 时抛错；参数里的 `message_id` 是中立层的 id（含 `\|`）时先换成 OneBot 的数字（`store.createMsgShortId`）。OneBot 连接专用的 `.handle_quick_operation`、`get_event` 不放。`NTQQUniversal.inject` 声明 `ntOnebot` 和 action 访问的账号服务 |

这些实现曾从 Satori 适配器迁到宿主中立层。2026-11-16 随 NTQQ 协议独立，消息编码、事件解码、Bot 能力和内部 action 映射一并迁入协议包；宿主只保留通用 Bot、Session、分发与指令。`NTQQUniversal.inject` 必须覆盖转换器、`MessageEncoder` 和 `api.ts` 经 `ctx` 访问的全部服务，否则 cordis 严格模式下会抛 `cannot get property without inject`。

**Satori 适配器**（`src/plugin/internal/adapter/satori/`，owner 2026-10-31：它只是中立层上的一层转换）：

- `inject` 只有 `bots`，条目也不等 NT 登录：`ctx.bots` 里的每个 bot 都是一个 Satori login，官方机器人统一为 `qq:<AppID>`，群聊、单聊和频道共用一个 login
- 事件：订阅 `bot/session`，经 `wire.ts` 的 `toWire()` 换成对外的名字（`platform`、消息 `content` 里的 `ntqq:` 元素换成 `llonebot:`，NT 的表情补回 `platform="llonebot"`，去掉值为 undefined 的字段），再补上线上格式：适配器自己数的 `sn` 和同值的 `id`，`login` 只带 `sn` / `user` / `platform`。login 的 `sn` 按首次出现的顺序递增分配。`bot/status` 发 `login-added`（第一次）/ `login-updated`；注销 Bot 时注册表先删除它，再广播 `bot/status`，适配器据此发 `login-removed` 并清除该 login 的映射。重新注册会得到新的 login 编号；短暂断线仍保留注册，只发 `login-updated`。通用监听器用 `ctx.bots.get(bot.sid) === bot` 判断该 Bot 是否仍注册
- API：按 `Satori-Platform`（对外的名字；内部名 `ntqq` 不认）+ `Satori-User-ID` 找到 bot，按 `@satorijs/protocol` 的 `Methods` 查方法名，参数按它的字段顺序传给 bot 同名的方法，结果同样 `toWire()`。bot 没有的方法回 404。`login.get` 和 READY 的 `logins` 用 `adapter.login(bot)`，`features` 是 bot 有的方法加 `bot.features`
- `message.create` 调 `bot.sendMessage(..., { relay: true, referrer })`：内容先把 `llonebot:` 换回 `ntqq:`，不经过 `bot/before-send` 和 `bot/fallback`（插件不能改写下游客户端的消息），只做内置降级；客户端从事件里拿到的 `referrer` 原样传给 bot（官方机器人靠它被动回复）
- `/v1/internal/onebot11/:action` 优先转给当前 `ctx.onebot.actionMap`，没有对外 OneBot 适配器时使用 `ctx.ntOnebot.actionMap`；不 import 独立包的私有源码，也不要求它的传输服务启动
- 搬过来时修掉的：`channel.mute` 读的是 `duration` 而 Satori 传的是 `enable`，一调用就全员禁言；角色列表的 id（1 / 2 / 0）和成员身上的（NT 的 4 / 3 / 2）对不上，拿成员的 3 去设置管理员反而会撤掉管理员，现在统一用 NT 的值；`message.list` 的 `next` 是消息 id 却被当数字用，翻第二页是 NaN

第二个消息源 QQ 官方机器人就是这样接的（`src/plugin/internal/protocol/qq-official/`，见 [official-qq-bot.md](official-qq-bot.md)）：实现 `Bot`（`sendMessage` 必须，其它按平台能力挑），发送前调 `ctx.bots.beforeSend()`，收到的事件转成 Satori 事件后 `ctx.bots.dispatch()`，在 apply 里 `ctx.bots.register(bot)`。不需要碰任何 `nt/*`。

**扩展元素和降级**（owner 2026-10-30：不另起协议，在 Satori 上加一层；NT 上 markdown 默认降级成文字、留口子给插件渲染成图片，回调按钮丢掉）。插件作者的用法见 [plugin-authoring.md](plugin-authoring.md)"跨平台写法"：

- Satori 标准之外的四种元素 `markdown`、`button` / `button-group`、`card`、`face`，任何 bot 都收。`Bot.features`（SDK 的 `Feature`，对应 Satori 的 `Login.features`）列出 bot 原生能发的；没列的，`ctx.bots.beforeSend()` 在 `bot/before-send` 跑完后换成降级内容（`src/universal/fallback.ts` 的 `applyFallbacks()`）：先问 `bot/fallback`（cordis 的 `serial`，第一个返回非空的监听者生效，返回值原样发出），没人接再用 `fallback()` 的默认降级（只产出标准元素）。相邻的散按钮先拼成一个 `button-group`，所以钩子和默认降级拿到的都是整行。适配器只实现自己声明的元素
- 现在：NT（`NTQQBot`）是 `message.face` / `forward` / `proactive` 和 `guild.plain`，官方 `qq` 是 `markdown` / `button` / `card` / `face` / `stream` / `proactive` 和 `guild.plain`，能力按全部目标合并；`face` 在频道原生发送，群聊和单聊仍降级。NT 配了 `CARD_SIGN_URL` 能签链接分享卡片（[card-message-sign.md](card-message-sign.md)），但还没有拼这种卡片的代码，所以 `card` 在 NT 上走降级
- 默认降级里的 markdown 解析是自己写的一小段（标题、粗斜体、删除线、行内代码、代码块、链接、图片、列表、引用、分隔线），不引依赖；不认识的语法原样当文字
- 按钮按官方适配器的读法分类（`qq-official/elements.ts` 的 `decodeButton`）：`link` / 平台 `action.type` 0 是跳转，`action` / 平台类型 1 是回调，其余是指令（发出 `data`，没有就是 `text`、按钮上的字、`id`）
- 经 `bot.sendMessage` 发的消息都走这里，Satori 客户端发的（`relay`）只做内置降级；OneBot / Milky 不用 Satori 元素，不经过中立层
- SDK 主要是类型（`Feature`、`CardAttrs` / `FaceAttrs` / `ButtonAttrs`、`Session.stripped`、`bot/fallback`、`SendOptions.relay` / `referrer`、`Bot.user` 和 Satori 的那些可选方法，`EventName`、`NeutralEvent` 的常用字段，`Account`，指令）。运行时代码只有 `internalOf()`（平台对得上时给出带类型的 `bot.internal`）和测试工具 `@luckylillia/plugin-sdk/testing`（打包了中立层，见上表）
- `Session.send()` / `reply()` 把事件的 `referrer`（Satori 的被动回复信息，消息源自己定的不透明值）传给 `sendMessage`：只能被动回复的平台（QQ 官方）据此回复触发它的那条消息，而不是频道里最近一条；NT 不用它。流式回复（`<markdown stream>`、`stream="end"`）的约定在 SDK `Feature` 的 `message.stream` 上
- 收消息也归一到这套元素：NT 收到的 markdown（别的官方机器人发的）解成 `markdown`、按钮键盘解成 `button-group` / `button`（0 → `link`，1 → `action`，2 → `input`），卡片的 `ntqq:ark` 带上 JSON 里的 `prompt` 当子元素，表情带上名字（`face_config.json` 的 `QDes`），不再带 `platform` 属性（表情 id 两边是同一套）；官方的表情见 official-qq-bot.md §5
- `Session.stripped`（`src/universal/session.ts`）：去掉开头的 `quote`、对 `selfId` 的 `at` 和其后的空白，给按前缀匹配指令的插件用

## 插件包与条目

**包**：插件根目录（默认 `data/plugins/`，外加任意个 `--plugin-dir <path>`）下的子目录，`package.json` 里有 `llbot` 字段才算。`@scope/` 目录会再往下找一层。入口按 `exports`（`import` / `default` / `node` 条件）→ `main` → `index.js` 解析。宿主从 TypeScript 源码跑（tsx、vitest：`manifest.ts` 自己的 `import.meta.url` 是 `.ts`）时先看 `exports` 的 `development` 条件，文件在就用它，插件不用先编译；发布版不理它（`resolveMain()`）。同名包只认第一个，其余打 warn。

**条目**（当前实例的 `data/instances/<实例>/plugins.json`；旧位置由启动迁移搬过来，见 config-storage.md §9）：

```json
{
  "version": 1,
  "hmr": false,
  "entries": [
    { "id": "7f3a9c21", "name": "luckylillia-plugin-echo", "config": { "prefix": "echo " } },
    { "id": "b1d4e880", "name": "luckylillia-plugin-echo", "disabled": true }
  ]
}
```

- `id` 是 8 位 hex，落盘后不变。同一个包可以开多个实例，所以不能用包名当主键
- 形状对齐官方 `@cordisjs/plugin-loader` 的 `EntryOptions`（少了 `group` / `inject`），将来换官方 loader 不用迁移文件
- 单独成文件、每个实例一份（`data/instances/<实例>/`），见 [config-storage.md](config-storage.md)。读写都经 `JsonFile`：读用 JSON5（允许手写注释），写先写临时文件再 rename
- 解析失败时**文件原样留着**，以空条目 + 内置条目启动；启动时补内置条目的那次保存在读失败时跳过，所以坏文件不会被覆盖，用户改好后下次启动生效（原来是改名成 `.broken-<ts>`）
- 扫描到从没见过的包，会自动建一个 `disabled: true` 的条目，让它出现在 WebUI 里，但不会自动执行
- 条目可以带 `scope`（生效范围，`src/plugin/host/scope.ts`）：`platforms`、`bots`（sid）、`guilds` / `users`（`{ mode: 'allow' | 'deny', ids }`，id 可以写 `平台:id` 只对一个平台算）、`direct: false` 不收私聊。`deny` 的 ids 为空等于没设，`allow` 为空就是一个群都不收；群的过滤只看有群或频道的非私聊场合，没有用户的事件不按用户过滤。`PUT /api/plugins/:id/scope` 写，立刻生效，不重启插件。旧 `luckylillia` 平台及 `luckylillia:` 前缀在读取和保存时规整为 `ntqq` / `ntqq:`，保留原来的平台限制和 allow / deny 语义；指令的 `owners` 同样兼容旧前缀，裸 ID 仍匹配所有平台
- 可选顶层 `retained: PluginEntry[]`：卸载时选择保留的条目配置，包含原 `id` / `name`、原始 `config` 和可选 `scope`，统一为 `disabled: true`；与 `entries` 分开存放，不作为已安装条目显示。重新扫描到同名包时恢复条目并移除对应归档，保持停用且需重新信任。具体存储规则见 [config-storage.md](config-storage.md) §5。
- 顶层 `messageOrder`：处理消息的条目顺序（`PUT /api/plugins/order`，空数组恢复默认），删条目时顺带去掉
- 顶层 `trusted`：用户信任过的第三方包名。`PluginService.Config.trust`（`main.ts` 打开，单测默认关）为真时，没信任过的包 `enable` / `add` 抛 `PluginTrustRequiredError`（路由回 428，`data.package`），前端弹信任框（列出它要用的服务）后带 `trust: true` 重试，记下来以后不再问。文件里第一次没有这个字段时（从旧版本升级），已启用的第三方包都算信任过。`forget(name)` 和市场卸载调用的 `removePackage(name, options)` 都会删掉信任和这个包的界面偏好，保留配置也不保留这些授权

### 插件包依赖

`llbot.dependencies` 是 `Record<完整 npm 包名, semver 范围>`，例如 `"dependencies": { "lucky-lillia-aiprovider": "^1.0.0" }`。这是插件包之间的必需依赖，扫描清单时由 `parsePluginDependencies()` 读取，包名、字段形状或版本范围非法就报错，不静默丢弃；版本匹配共用 `matchesPluginVersion()` 的 npm semver 规则。普通 npm 库仍在包顶层的 `dependencies`，SDK / 插件 API 的兼容声明仍放 `peerDependencies`。`llbot.service` 与代码的 `inject` 继续描述服务：包已安装且版本匹配之后，运行仍需等待对应服务就绪。

宿主按扫描到的插件包名和版本判断包依赖，不从某个同名服务反推包名，也不把 `node_modules` 里的库当已安装插件。依赖报告和前端分别展示要求的版本、已安装版本以及提供者是否启用 / 运行；缺包或版本不匹配的消费者不会运行。兼容包已安装但停用时通过包检查，服务是否可用仍由 `inject` 决定。扫描或重载发现依赖包被移除、版本不兼容时停掉消费者，恢复兼容包后重新挂载原本已启用的消费者。市场如何复用、补装及检查依赖图见下文"插件市场"。

### 名字、作者、图标和详情

owner 2026-11-03：插件可以自己定 WebUI 里的名字、作者、图标（图片），可选的详情和演示图片（写法见 [plugin-authoring.md](plugin-authoring.md) "名字、作者、图标和详情"）。

- **简介**：`llbot.description` 可以直接是字符串，SDK 脚手架默认生成字符串；也支持按 `zh` / `zh-CN` / `en` 取值的多语言对象。WebUI 优先显示它，未填写时使用包顶层的 `description`。
- **扫描**（`manifest.ts`）：`author` 由 `parseAuthor()` 读（`"名字 <邮箱> (网址)"` 或对象，网址只留 http(s)，WebUI 会做成链接）；`llbot.icon` 以图片扩展名（`IMAGE_EXTENSIONS`）结尾才当图片，记成 `iconFile`，否则还是 lucide 名；`llbot.details` 要 `.md` / `.markdown`；`llbot.screenshots` 每项是路径或 `{ src, caption }`。这几个都经 `packageFile()`：在包里、扫描时文件在、扩展名对，否则一条警告、这一项丢掉，存的是相对包根、正斜杠的路径
- **状态**包含展示字段：`author`、`repository`、`iconUrl`（`/plugin-assets/<key>/<version>/<file>`）、`hasDetails`（有 `details` 或 `screenshots` 时为真，用于决定是否读取本地详情；Info 入口始终显示）。`repository` 从 `package.json` 顶层的 `repository` 读取，规范化为安全的 HTTP(S) 网页地址，不能转换的值不生成链接。名字在前端：`pluginTitle()` 先内置条目的 `title`，再 `llbot.title`（按语言的取 `zh`），最后去掉前缀的包名
- **统一卡片**：已安装条目、没有条目的已安装包和未安装目录包都由 `components/plugins/PluginCard.tsx` 渲染。底部共用 `PluginMetaRow.tsx`，依次显示分类标签、作者、npm 和仓库链接；Info 紧挨 GitHub/仓库图标，与包链接成组，手机换行不拆开；操作行依次排列设置、重载和卸载按钮。已安装项读取宿主状态，未安装项读取已加载的目录；同包多个条目分别保留实例卡片，不再重复添加对应目录卡片。Info 始终提供，只有已安装条目的 `hasDetails` 为真时才请求本地详情。未安装卡片显示安装按钮，没有开关和设置；已安装卡片保留状态、配置、更新和重载操作。
- **详情** `GET /api/plugins/:id/details`（`PluginService.details()`）：`{ markdown?, base, screenshots: [{ url, caption? }] }`。Markdown 每次请求现读，改了不用扫描；`base` 是这份文件所在目录的 URL，相对路径的图片据此拼。没有更新包详情的内置条目回 `{ base: '', screenshots: [] }`
- **图片** `/plugin-assets/<key>/<version>/<file>`（`servePluginImage()` → `PluginService.asset()`）：包里任何图片都发，别的文件一律 404；跟 `/plugin-webui` 共用 `servePackageFile()`（登录 cookie、锁定）。URL 里的版本号只为换版本时不吃缓存，回 `Cache-Control: no-cache` 加弱 ETag（大小和修改时间），没变就 304，演示图片不用每次重下。响应带 `Content-Security-Policy: sandbox` 和 `nosniff`：SVG 单独打开时是个文档，不加的话它的脚本会以 WebUI 的源运行
- **重新扫描**：版本、入口没变、只改了展示用的字段（清单、说明、作者、图标、详情、演示图片）时，不算 `changed`（不重载模块），但也发一次 `plugins/changed`，插件页马上就是新的
- **前端**：图标统一走 `components/plugins/PluginIcon.tsx`（插件卡片、配置弹框、`SchemaSettings` 的标题、消息处理顺序）：图片铺满方块，没运行时变灰，加载失败退回 lucide 图标。已安装和未安装卡片的 Info 统一由宿主的 `PluginDetailsDialog.tsx` 展示，接收 `PluginDetailsSource` 的元数据和可选异步 `load()`。主标题使用 `llbot.title`（未安装项使用目录的 `title`），与作者等信息固定在弹框顶部，不随正文滚动；其下依次显示 `description` 简介、截图。简介立即展示，不等待详情加载，也不因有 Markdown 而隐藏。不提供 `load()` 时不显示加载动画；插件列表仅在 `hasDetails` 为真时提供加载函数，从本地插件包读取详情；没有详情素材时直接展示已有元数据。有非空 Markdown 时放在截图之后的「完整说明」中，默认折叠，用户可展开阅读。详情渲染时，若 Markdown 的第一个内容块是一级标题，则省略该块，避免在正文中重复展示主标题；后续标题、二级及以下标题和其他内容保留，源文件不变。异步读取失败保留元数据和已知截图，并提供重试，切换或关闭弹框后忽略旧请求结果。Markdown 由 `components/common/Markdown.tsx` 的 `renderMarkdown()` 直接生成 React 元素，不走 `dangerouslySetInnerHTML`，HTML 原样当文字，链接只认 http(s) / mailto，一行一换行（中文习惯一句一行）；详情里的截图和 Markdown 图片点击后用 `components/common/Lightbox.tsx` 放大，它在 window 的捕获阶段处理 Esc 并 `stopPropagation`，所以 Esc 先关大图、不连带关掉详情。未安装卡片显示目录里的 `title`、`author.name` 和可选的 `author.url`，仓库链接取目录的 `repository`
- **dev 下**：Vite 转发 `/plugin-webui` 和 `/plugin-assets` 时要 `changeOrigin: false`。登录 cookie 按浏览器用的端口命名（`webui_token_<port>`），后端从 Host 头里取端口；`changeOrigin: true` 会把 Host 改成后端的端口，这两个路径在 dev 下就一直 401（cookie 改按端口命名以后第三方插件的界面在 dev 下其实一直加载不了，2026-11-03 发现）

### 配置的读写

每个实例只有这一份插件配置，没有按账号的覆盖层：要让另一个号用不同的插件配置，用另一个实例跑它（config-storage.md §4）。

- **落盘存差异，差异由服务端算**：`updateConfig` 收完整值（也兼容已剥默认值的差异），先补成生效值、校验生效值（单独校验差异会被 `required` 拒掉），再只存相对 schema 默认值的差异。差异规则见 `src/common/schema/diff.ts`：只有 object（和全是 object 的 intersect）逐 key 递归，dict / array / union / 标量整体替换
- 交给 cordis 的是存下来的差异，schema 默认值由 cordis 自己补
- **并发**：`describe` 返回 `rev`（存下来的配置的哈希），`PUT` 带回 `ifRev`，在条目锁内比对，不一致返回 409，前端提示后重新载入

### 插件数据目录（`ctx.storage` / `ctx.baseUrl`）

`src/plugin/host/storage.ts` 的 `PluginDataDirs`，根目录是 `PluginService.Config.dataDir`（`main.ts` 传当前实例的 `data/instances/<实例>/plugin-data`；不传就两样都不提供，单测默认如此）。

- **目录名**：`dataKey()` 把包名的 `/` 换 `+`、内置条目 `builtin:x` 换成 `_builtin+x`（冒号在 Windows 路径里非法），并拒绝任何不是单段合法路径的名字（`..`、多个斜杠、结尾 `.`、Windows 保留名）。`baseUrl()` 对这种名字返回 undefined，不让条目因此挂载失败
- **`ctx.storage` 是根上注册的 accessor**，不是条目 ctx 上的自有属性：服务的方法被别的条目调用时，cordis 给的 `this.ctx` 是"调用方 ctx + `symbols.shadow` 指向服务自己的 ctx"，自有属性会沿调用方那条原型链解析，拿到调用方的目录。accessor 里取 `this[symbols.shadow] ?? this` 作为定义处，再沿 `fiber.parent.fiber` 走到 `mount()` 时 `register()` 过的条目 fiber
- **`ctx.baseUrl` 只能是自有属性**：根 Context 自己就有 `baseUrl` 属性（值为 undefined），属性访问在走到 accessor 之前就命中了。所以 `mount()` 用 `this.home.extend({ baseUrl })` 当父 ctx，插件的 ctx 从它继承；`fiber.parent.fiber` 仍是 PluginService 的 fiber，`entryOfFiber()` 等不受影响。代价是服务方法被别人调用时读到的 `baseUrl` 是调用方的，作者文档写了"在 apply 里读"
- **按 Bot 的目录**：`ctx.storage.dir('bot', bot)` 接受 Bot 或 `platform:selfId`，无需登录，通常返回 `<包>/bots/<platform>+<selfId>/`。`dir()` / `dir('global')` 返回共享目录。旧的 `dir('account')` 已删除；对于 `ntqq:<QQ号>`，优先使用 `<包>/bots/ntqq+<QQ号>/`，不存在时依次沿用 `<包>/bots/luckylillia+<QQ号>/`、更早的 `<包>/<QQ号>/`；旧 `luckylillia:<QQ号>` 入参归一到同一套路径。不会移动、合并或删除旧数据。宿主不再读取任何协议账号服务。
- 插件数据在实例目录下、不在插件代码目录 `data/plugins/` 里，热重载 watcher 只看插件根目录，dev 下 `tsx watch --exclude "./data/**"` 也覆盖了它

## 可选协议与适配器

NTQQ 消息接入随协议包提供，不再是可单独管理的内置插件。启动迁移 `migrateNTQQMessaging()` 清理旧 `builtin:ntqq-universal` 的活动或保留条目及其布局、消息顺序引用，不创建或启用协议条目，也不授予信任。`bot.internal` 的方法名由协议构建导出 `onebot-internal.json`，宿主通过 `scripts/sync-ntqq-api.mjs` 同步公开快照后生成 SDK 类型，不再导入 NTQQ 转换实现。

NTQQ、OneBot 11 和 Milky 是独立的普通插件。Bot 不随附其实现，默认也不自动安装；可以在 WebUI 安装、信任并启用，或通过下面的 `--plugin` 显式请求。更新走普通插件更新流程。以下描述的是当前源码和本地构建边界，不代表包已发布到 npm 或市场。

| 包名 | 工程目录（相对 Bot） | 内容与界面 |
|---|---|---|
| `@luckylillia/plugin-nt-protocol` | `../LuckyLillia.Plugins/lucky-lillia-plugin-ntqq-protocol/` | 纯协议与 NativeQQ 桥接、原生包、登录和 Auth Token、账号数据库 / Core / Store、NT API、`ntOnebot` action 服务；`src/client/` 提供 NTQQ 设置页与状态卡片 |
| `@luckylillia/plugin-onebot11` | `../LuckyLillia.Plugins/lucky-lillia-plugin-onebot11/` | OneBot HTTP / WebSocket / HTTP POST 传输与连接设置页；账号 action 由 NTQQ 插件提供 |
| `@luckylillia/plugin-milky` | `../LuckyLillia.Plugins/lucky-lillia-plugin-milky/` | Milky HTTP / WebSocket / SSE / Webhook 与设置页 |

两个适配器通过 `llbot.dependencies` 声明 NTQQ 包版本，通过 `inject` 等待其账号服务。Satori、WebQQ、中立层、QQ 官方机器人仍在 Bot 中。NTQQ 未安装、未启用或尚未登录时，依赖其服务的功能等待；Satori 可继续服务官方机器人。第三方页面由 `llbot.webui` 加载，地址使用包名命名空间，通过 `ctx.pageHref()` 生成，不再把旧的 `#ntqq` / `#onebot` / `#milky` 当作宿主固定路由。

启动迁移 `migrateExtractedPlugins()` 把旧 `builtin:nt-protocol` / `builtin:onebot11` / `builtin:milky` 名称改为上述包名，保留条目 ID、配置、开关、生效范围与消息顺序，迁移界面偏好；迁移本身不下载代码，也不授予新包信任。未安装时条目显示缺失，安装后仍须确认信任。

### NTQQ掉线邮件通知

独立包 `@luckylillia/plugin-ntqq-offline-email`，工作区在 `../LuckyLillia.Plugins/lucky-lillia-plugin-ntqq-offline-email/`。它声明 NTQQ 插件包依赖，只通过公开类型契约和注入的 `qqProtocol` 监听掉线，不包含登录或原生实现，也不适用于 QQ 官方机器人。宿主不随附、不自动安装，升级安装和信任走普通插件流程。

插件入口的协议监控和 WebUI 路由是两个局部 inject 分支：启用插件后即可在未登录 QQ 时测试 SMTP；NTQQ 协议暂时停用时测试分支仍可用。首次登录前、主动退出或停用协议不发通知；同一次掉线和发送中的重复事件去重，重新登录后重新布防。关闭插件时监听、断网回调和 `POST /api/ntqq-offline-email/test` 一起卸载，不保留 standby。

页面显示“NTQQ掉线邮件通知”，设置页键为 `@luckylillia/plugin-ntqq-offline-email:email`，停用时仍可填写并保存草稿，测试按钮明确要求先启用插件。密码通过普通插件 schema 的 `role('secret')` 打码；测试邮件使用入口收到的本条目真实配置补回密码，不读取宿主私有插件接口。SMTP 参数在实际发送或测试时校验，缺少参数可以先保存。

启动迁移将旧 `builtin:email-notification` 和保留配置改为新包名，保留 ID、配置、密码、开关、scope、messageOrder 和布局；`email.json` 同样迁入新包条目。迁移不安装或自动信任该包。通知、SMTP、本地投递和测试路由的测试位于独立包的 `test/`，宿主仅保留配置迁移和无插件启动测试。

### 独立 WebQQ

WebQQ 位于 `../LuckyLillia.Plugins/lucky-lillia-plugin-webqq/`，包名为 `@luckylillia/plugin-webqq`，不随 Bot 分发或自动安装。它通过公开 `@luckylillia/plugin-nt-protocol/api`、`types`、`contracts` 使用 NTQQ，声明包依赖并通过 inject 等待账号服务。后端路由、SSE、上传与完整聊天前端均由该包提供；宿主只保留 WebUI SDK 中供扩展插件使用的 WebQQ 插槽类型，不导入其私有源码。

功能页地址为 `#@luckylillia/plugin-webqq:webqq`，全屏入口通过 `ctx.pageHref('webqq', { fullscreen: true })` 生成。设置从普通插件卡片进入。`autoHideSidebar`、`fullscreenButton`、条目 ID、开关、scope 与布局通过 `EXTRACTED_PLUGINS` 从旧 `builtin:webqq` 迁移；不自动安装或授予信任。浏览器聊天缓存仍按 QQ 账号分桶，数据库名称和持久化键不变。上传目录使用实例内的 `ctx.storage.dir()/uploads`；临时媒体文件由请求清理。

前端继续声明 `webqq.chat.actions`、`webqq.message.element`、`webqq.message.bubble` 三个插槽，第三方贡献不需要更换槽名。React 与 WebUI SDK external，NTQQ 类型和浏览器安全枚举从公共包导入，其余前端依赖随包构建；懒加载聊天 chunk 和独立 Tailwind utilities 随前端入口提供。

插件停用或账号服务卸载时移除所有 `/api/webqq` 路由、NT 事件监听并结束 SSE；仅修改布局设置不重启后端、不打断聊天流。可选媒体服务直接使用 `ctx.get('ffmpeg')`，无需 FFmpeg 也可运行；已有 WAV 直接播放，需要转码时缺插件返回 `FFMPEG_PLUGIN_MISSING`。原 WebQQ 路由、账号恢复、存储与语音用例迁入该包 `test/`，只使用公开 SDK/NTQQ 包和模拟服务，不登录 QQ。

### 启动时安装并启用插件

`--plugin <npm包名>` 与 `--plugin=<npm包名>` 等价，可重复，也可用逗号列出多个包。只接受包名，不接受版本号、标签、URL 或文件路径；本地开发目录仍用 `--plugin-dir`。例如：

```sh
node llbot.js --plugin @luckylillia/plugin-nt-protocol --plugin @luckylillia/plugin-onebot11
node llbot.js --instance second --plugin=@luckylillia/plugin-nt-protocol,@luckylillia/plugin-milky
```

这些参数是当前实例的安装、信任和启用请求，包含 `llbot.dependencies` 声明的必需插件。缺少的包直接从市场设置的 npm 源解析兼容版本，不要求收录到市场目录，也不拉取目录；市场插件停用时仍可使用其保存的源设置。包和依赖都已安装时不访问 npm、不升级代码。无 `--plugin` 时不执行这条安装流程。普通 npm 库依赖继续由现有安装器处理，安装脚本不会执行。

宿主先规划依赖，再通过共用安装锁与多实例协调器写包；启用只影响发起请求的实例。保留已有条目 ID 和配置：有已启用条目时沿用全部已启用条目，不打开额外停用副本；全部停用时启用第一个条目；没有条目时创建一个。重新安装会先按正常扫描流程恢复卸载时保留的配置。只读插件目录可以启用已有且依赖齐全的包，但不能补装缺少的包。

安装、信任或初始化失败会记录包名及原因，独立的其他请求仍会尝试，随后卸载宿主并以退出码 1 结束，避免留下半启动的进程。需要 QQ 登录等服务的 `pending` 状态属于已启用、等待服务，不视为安装失败。参数产生的信任和开关会保存；后续移除参数不会撤销它们。

Docker 镜像以 `/startup.sh` 为入口，直接把参数放在镜像名之后，无需再写 `node`。例如，将 `<镜像>` 换成实际镜像：

```sh
docker run --rm -p 3080:3080 -v llbot-data:/app/llbot/data <镜像> --plugin @luckylillia/plugin-nt-protocol --plugin @luckylillia/plugin-onebot11
```

Compose 使用 `command: ["--plugin", "@luckylillia/plugin-nt-protocol", "--plugin", "@luckylillia/plugin-milky"]`。启动脚本在纯协议、自动登录和 NativeQQ 分支均透传参数；Dockerfile 清空基础镜像继承的 CMD。原有协议模式、`-q`、`--instance`、端口等参数继续生效。首次下载安装要求所选 npm 源已有对应包；本地构建包可先放入插件目录再使用同样参数。

验证在 `test/unit/bootstrap/startupPlugins.test.ts` 与 `test/unit/plugin/market.test.ts`：使用本地假 npm 源覆盖未收录的多包和依赖、保留配置、多条目、零网络复用、兼容版本、只读目录、失败报告和共享目录并发。`startupPluginsProcess.test.ts` 启动隔离的真实 Node 子进程，验证失败时释放已启用插件并以退出码 1 结束。

## 内置插件

媒体转换由外部可选插件 `lucky-lillia-plugin-ffmpeg` 提供 `ctx.ffmpeg`，Bot 不内置、不自动安装，也不将其列为协议或适配器的必需依赖。新插件通过局部 `ctx.inject(['ffmpeg'], ...)` 使用可选能力；SDK 只定义 `FFmpegAPI` 等类型，不包含原生引擎。`main.ts` 的 `installFFmpegBridge()` 通过局部注入把当前服务接给已有 `common/utils/ffmpeg.ts` 媒体工具，`ctx.effect` 在服务停用或替换时撤销引用，兼容独立更新的旧内置包调用签名。视频沿用默认信息和封面；已有 SILK 可直接发送（缺少时长探测时默认 1 秒），已有 WAV 可直接播放；SILK 编解码统一由插件中的原生 SDK 完成；必须转码时抛带安装提示的 `FFMPEG_PLUGIN_MISSING`。旧 `ffmpeg` 路径和 `setFFMpegPath()` 仅保留兼容。原生资产随外部插件安装和更新，构建说明见 [native-ffmpeg.md](native-ffmpeg.md)。

**npm 包与独立更新**：当前随 Bot 分发的内置插件各有 `package.json`，包名为 `@luckylillia/plugin-<条目名>`；实例里仍使用 `builtin:*` 名称和 id。`npm run build:builtins` 生成 `output/builtin-packages/@luckylillia/plugin-*`，Bot 构建把这些 npm 产物放到 `dist/builtin-plugins`，同时保留随 Bot 编译的实现作为默认值和回退。NTQQ、OneBot 11、Milky、WebQQ、NTQQ掉线邮件通知和旧 NTQQ 消息服务不再进入该列表或构建产物；构建会清理旧的内置包输出，避免残留包随下一次发布带回。包内 `llbot.builtin = { entry, abi }` 是内置实现的私有约定，普通插件不能靠声明该字段取得内置身份。发布 npm 包及更新市场目录需另外进行，构建不会自动发布。修改内置标题或 manifest 后运行 `node scripts/sync-builtin-manifests.mjs` 同步清单，`--check` 用于检查；正式发布时单独提升对应包版本。

- `host/builtin-packages.ts` 管理官方包名、随包版本、当前运行版本和已下载版本。市场只接受目录指定的更高兼容版本；安装完成后 `approveBuiltinPackage()` 为完整包及依赖生成摘要，保存到插件根的 `.builtin-packages/` 快照，并用 `.builtin-updates.json` 记录选中的版本。任意扫描到的同名目录不自动获得执行资格。
- 所有内置更新在下次 Bot 启动时生效，包括 WebUI 和带 standby 的内置插件。下载期间继续使用当前代码和同版本前端资源；启动时先校验快照，再选择新实现，保留原条目 id、配置和 core 限制。校验、兼容性或模块导入失败时继续使用随包实现并记录原因。主插件或 standby 的初始化失败（包括依赖稍后就绪的子服务）会先卸载更新版的两部分，再统一恢复随包实现；条目停用时也恢复 standby。新 Bot 随附版本已达到或超过更新包时，优先用新随包版本。
- 内置包通过 `@luckylillia/bot-runtime/*` 导入宿主共享模块，`runtime-imports.ts` 由构建生成，解析钩子返回宿主已持有的对象，避免重复创建 Cordis、原生模块和宿主状态。声明官方内置包依赖时，宿主按其实际运行版本和稳定条目检查；消费者需要已下载但尚未启用的新版本时，等待重启后满足要求。这是由 `BUILTIN_ABI` 约束的私有接口；修改导出约定时须同步 ABI 与内置包，不把内部模块当第三方 SDK 使用。
- `/api/plugins` 的 `packageName` 是 npm 身份，`version` 是正在运行的版本；`GET /api/market/installed` 另有 `builtin`（稳定条目名）、`activeVersion`、`restartRequired` 和 `error`。内置包可以更新，不能卸载或由本地上传覆盖。普通「重载」只重启当前选定实现。

**目录**：`src/plugin/host/` 是插件系统本身，`src/plugin/internal/` 是随 Bot 分发的内置插件；`host/` 不 import 内置实现。每个内置插件一个目录 `src/plugin/internal/<分类>/<条目名去掉 builtin:>/`，分类与 manifest 一致：`protocol/` 保留 `qq-official`，`adapter/` 保留 `satori`，`tool/` 包含状态面板、日志、市场、消息处理顺序，`service/` 包含 WebUI、中立层、指令、数据库、代理。后端、路由和 `client/` 同目录；`builtin.ts` 导出条目定义，有配置时另有 `settings.ts`。`src/plugin/internal/index.ts` 是列表，`main.ts` 从这里拿 `builtinPlugins`。WebUI 前端独立 npm 包仍在 `src/plugin/internal/service/webui/FE`。

NTQQ 实现位于 `../LuckyLillia.Plugins/lucky-lillia-plugin-ntqq-protocol/src/`：`qqProtocol/` 是纯协议和 NativeQQ 桥接，`ntqqapi/` 是 NT API、Core 和消息帮助函数，`loginResources.ts` / `store.ts` 管理身份资源，`onebot/` 提供账号 action 服务；原生资产在同一插件的 `native/`。OneBot 传输与 Milky 分别位于 `../LuckyLillia.Plugins/lucky-lillia-plugin-onebot11/`、`../LuckyLillia.Plugins/lucky-lillia-plugin-milky/`。宿主中立层和 WebQQ 使用 `src/ntqq/api.ts` 的公开契约与帮助函数快照，通过 `ctx` 调用已安装插件提供的账号服务；快照不包含协议实现，也不让宿主自动安装协议。Satori 的通用方法只依赖 `ctx.bots`，兼容 action 路由通过服务查找。新加跨插件依赖应声明服务和包关系，不能 import 另一个仓库的私有路径。

**挪目录时 import 以外要改的路径**（2026-10-30 拆 commit 时逐个踩到）：这些写错了不报错。前端 `plugin-host/builtins.tsx` 的 `import.meta.glob` 和 `index.css` 的 `@source`（匹配不到只是少了内置插件的页面和样式）；FE `tsconfig.json` / `vite.config.ts` 的别名、`outDir`、`fs.allow`，`BE/server.ts` 的 `feDistPath`；根 `package.json` 的 `--prefix`、CI、`docker/Dockerfile.local`、`.dockerignore`、`.vscode/launch.json`；`test/*-api-test/` 自己的 `@llbot/*` 别名（各自的 `tsconfig.json`，onebot11 还有 `jest.config.js` 的 `moduleNameMapper`，直接指 `src/*`，不走根 tsconfig）；注释里写的路径。根 `.gitignore` 的日志规则必须是 `/logs/`（只管根目录的 `nohup` 输出）：写成 `logs/` 会把 `tool/logs/` 下新建的文件一起忽略，`git add -A` 静默漏掉，提交出来的代码编译不过

`src/plugin/internal/index.ts` 把原来写死在 `main.ts` 里的几个模块登记成内置条目，交给 `PluginService`（`Config.builtins`）装载，在 WebUI 插件页和第三方插件同列、同一套开关：

| 条目 | 内容 | WebUI 页面（插件自己的 `client/`，见下文"内置插件的界面"） |
|---|---|---|
| `builtin:webui` | 显示名称「页面设置」，WebUI 本身，**core**：`WebuiServer`（HTTP 服务、登录校验、路由表）和 `PluginRoutes`（`/api/plugins`、`/plugin-webui`），`src/plugin/internal/service/webui/BE/index.ts` 的 `WebUI` | 核心页面 `#plugins`（插件页）、`#webui`（页面设置）、`#about`；bot 设置在各自对应的页面，见下文"外壳和核心页面"，代码在外壳里（`src/plugin/internal/service/webui/FE/core/`），见下文"外壳和核心页面" |
| `builtin:dashboard` | `/api/dashboard/stats`（bot 进程和机器的资源，带版本号），`src/plugin/internal/tool/dashboard/` | 功能页「状态面板」`#dashboard`：声明 `dashboard.header` / `dashboard.cards`，自己的三张卡（运行时间、LLBot 资源、系统资源）也是贡献（`src/plugin/internal/tool/dashboard/client/`） |
| `builtin:logs` | `/api/logs/stream`（日志的 SSE，每次连接先发整份缓存），`src/plugin/internal/tool/logs/` | 功能页 `#logs`（`src/plugin/internal/tool/logs/client/`）：每次 `connected` 后来的那批当作完整快照，暂停时重连就在继续时换掉；暂停不断开连接（原来暂停 / 继续、浏览器自己重连都会把缓存再追加一遍） |
| `builtin:satori` | 支持全部协议端的 Satori 适配器 | 设置页 `#satori`：按 schema 渲染（`SchemaSettings`） |
| `builtin:qq-official` | QQ 官方机器人（AppID 登录，不依赖扫码账号，默认关闭），见 [official-qq-bot.md](official-qq-bot.md) | 设置页 `#qqofficial`：按 schema 渲染，订阅事件是插件注册的字段控件 |
| `builtin:commands` | 指令系统（`src/plugin/internal/service/commands/`，挂 `src/universal/commands.ts` 的 `CommandService`），**core**：用指令的插件都 inject `commands`，停掉或重启它会连带重启它们，所以设置（前缀、不写前缀也算、主人）改了用 `internal/update` 就地生效；`/api/commands` 列出全部指令和重名 | 设置页 `#commands`：设置加指令表；`client/OwnerEditor.tsx` 把主人编辑为平台下拉框和用户 ID 输入行，可增删；预置全部平台、NTQQ、QQ 官方机器人，并补充已登录或已有配置中的其他平台。保存仍是 `owners: string[]`，复用整页的配置草稿和 rev；`plugins.card.actions` 插槽给有重名指令的卡片加「指令重名」 |
| `builtin:message-order` | 消息处理顺序（`src/plugin/internal/tool/message-order/`）：独立的工具插件，编辑宿主 `plugins.json.messageOrder`；停用编辑器不改变已保存顺序的执行 | 设置页 `#message-order`，调整顺序后保存立即生效；从侧边栏或该插件卡片齿轮进入，插件页不再提供消息处理入口 |
| `builtin:database` | 插件用的数据库（`src/plugin/internal/service/database/`）：`@cordisjs/plugin-database` + SQLite，实例目录的 `database.db`，不等登录。**core**（owner 2026-11-03）：存数据的插件都 inject `database`，停掉它们就全停了。原来不是 core，留着给实现 `database` 的插件（MySQL 之类）替换；现在别的插件再实现 `database` 会跟它冲突 | — |
| `builtin:market` | 插件市场（`src/plugin/internal/tool/market/`）：从 npm 目录包提供收录信息和安装、更新、卸载操作，见下文"插件市场" | 通过 `plugins.catalog` 向统一插件页提供数据，通过 `plugins.install` 提供本地上传控件；不另画市场页面或卡片。npm 下载源和目录包名在它的卡片齿轮中配置 |
| `builtin:proxy` | 插件访问外网用的代理（`src/plugin/internal/service/proxy/`）：给 `ctx.http` 的请求挂代理，见下文"HTTP 和代理"。默认开，地址留空什么都不做 | 没有侧边栏页面（owner 2026-11-03：就一个地址，不常改，不值得占一栏）：插件卡片的齿轮打开配置弹框，`ctx.config()` 换掉通用表单，`SchemaForm` 加一个"测试"（用表单里填的代理地址访问一个地址，不用先保存，默认 `https://www.google.com/generate_204`；测试接口是条目的 standby 部分，代理插件停用时也能测） |

- 条目照样存在实例的 `plugins.json` 里（随机 id），只是 `name` 带 `builtin:` 前缀（npm 包名不能含冒号，不会撞）。启动时每个内置插件保证恰好一个条目：没有就按它的 `initial()` 建一个（没有 `initial` 的建成启用），手写出来的重复条目丢掉，core 条目上的 `disabled` 忽略
- 内置插件只有一个条目：它们提供具名服务（如 `satori`），两个条目会抢同一个名字。`add` / `remove` 对内置条目、`disable` 对 core 条目都抛 `PluginForbiddenError`（HTTP 403）；`updateConfig` / `describe` 对没有配置的内置条目抛 403。外部包不靠此规则限制实例数，提供单个账号或具名服务的包须自行约束。
- `reload` 对内置条目是重启当前进程选定的实现（dispose + 重新挂载），会读到最新配置。npm 更新必须重启 Bot 才切换新代码，普通条目重载不会切换已下载的内置包
- **standby 部分**（`BuiltinPlugin.standby`）：一个不随条目开关启停的小插件，`PluginService` 启动时挂在自己下面，跟插件服务同生共死。用于内置插件停用时也要用的接口，如代理测试 `ProxyTestRoutes`。它没有单独条目、设置或数据目录。第三方插件没有这个口子：用户停用的插件后端代码不运行。NTQQ 提取后，原来的 `LoginInfoRoutes` 已进入外部协议插件的生命周期；停用协议时该路由一起卸载。
- **停用要真能停下来**：适配器的 `[Service.init]` 返回关闭服务器的 disposer，cordis 卸载时 await，之后才能在同端口重新启用。OneBot 和 Milky 的资源清理由各自独立包维护，Satori 留在宿主。Satori 的兼容 action 路由每次读取当前 `onebot` 或 `ntOnebot` 服务，不缓存已卸载实例的 action。
- **统一插件页**（`components/plugins/PluginsPage.tsx`、`unifiedListing.ts`）：顶部直接使用紧凑筛选栏，不再显示额外的插件标题/说明大卡或市场双层标签。安装状态为「已安装」（每次进入时默认）/「未安装」/「全部插件」，安装、来源、状态、分类依次排列为四行相同样式的紧凑点击标签，左侧行名对齐；搜索框位于整个筛选区最底部，旁边是「只看可更新」。未安装模式隐藏状态行和更新筛选。搜索匹配标题、包名、简介和作者，来源按内置映射判断，分类沿用 manifest 的 `category` 或目录分类，未知值归入「其他」。类别内先内置、再已安装，按包名及条目 ID 排序；同包多实例保留各自卡片，已安装包不会重复作为未安装目录项出现。统一网格每页 12 项，筛选变化回第一页；搜索、来源、状态和分类偏好保存在 sessionStorage，重新进入时回到已安装第一页。筛选栏右侧是「检查更新」「本地安装」和扩展工具入口；扫描目录移入本地安装弹框，扩展视图从工具按钮打开并提供返回入口。「消息处理顺序」由独立内置插件提供设置页，插件页不再保留该工具入口。所有项使用同一个 `PluginCard.tsx`。内置卡片有"内置 / 核心"徽章，core 的开关置灰。内置插件的界面和第三方插件走同一套 `ctx.page()`（见下文"内置插件的界面"）：适配器、指令和日志注册的是**设置页**（插件启用就在侧边栏，停用后从侧边栏消失，但卡片上的"前往设置"仍能打开；日志页上有"写入日志文件"的开关，所以也算），WebQQ 注册的是**功能页**（插件启用就在侧边栏，没运行时页面换成原因）。卡片上的齿轮（`PluginsPage.tsx` 的 `configure()`，owner 2026-11-03）：内置插件注册了设置页就跳过去（"前往设置"），没有设置页、有配置的打开配置弹框（"配置"：代理、插件市场）；WebUI 的齿轮同样跳到 `#webui` 设置页，和侧边栏「页面设置」入口一致（主题、侧边栏、监听地址、端口、访问密码和退出 WebUI）；第三方插件总是打开配置弹框，因为生效范围和已有实例的管理只在那里，它注册了设置页的话弹框里不画表单，换成一行「打开设置页」。弹框里的通用表单可以用 `ctx.config()` 换掉。统一卡片在标题下显示已有的 `v版本号`；包名在详情弹框中查看。作者移入底部共用的元数据行，与分类、npm 和仓库链接排列，Info 紧挨 GitHub/仓库图标，与包链接成组；状态和更新插槽另行显示，该操作行右侧按设置、重载、卸载的顺序排列按钮。卡片整张不能点（owner 2026-11-03：容易误触），通过开关、按钮和链接操作
- 内置设置页读写配置都用 SDK 的 `usePluginConfig()`（`SchemaSettings` 也是它）：经 `/api/plugins/:id/schema` 读、`PUT /:id/config` 带 `ifRev` 写，服务端按 schema 和内置规则校验；在别处（`set_config`、另一个标签页）改过之后再保存会 409 并重新载入，不会悄悄覆盖。独立 NTQQ掉线邮件通知可在停用时保存配置，启用后不登录 QQ 也可通过它自己的测试接口发测试邮件。bot 设置（`settings.json`）走 `POST /api/config`，每处只提交自己那一项，`ConfigService.patch()` 深合并进去，再发 `llob/config-updated` 当场生效；保存 bot 设置不会重启适配器、不踢客户端。原来的 `BotConfigContext` 已删除
- **WebQQ 插件**（`@luckylillia/plugin-webqq`）：路由、上传目录、`/api/webqq/events` 的 SSE 连接，以及往 SSE 推消息的 4 个 `nt/*` 监听（`events.ts`）都在插件里，`inject` 列出路由代码直接访问的全部服务，登录后才挂载。停用时主动 `abort()` 还开着的 SSE 连接，否则页面会一直挂在一条没人写的流上。整个插件在 `../LuckyLillia.Plugins/lucky-lillia-plugin-webqq/src/`（原来在 `src/webui/BE/routes/webqq/`），序列化函数在它自己的 `utils.ts`（原来借 WebUI 后端的）；页面要的账号是它自己的 `/api/webqq/self`（原来借 NTQQ 页的 `/api/login-info`）。WebQQ 通过 SDK `useBots()` 跟随 NTQQ 账号和在线状态变化，再用自己的 `/self` 确认完整 UIN/UID；首次未登录、身份尚未齐全或请求失败时每 2 秒重试，确认在线后停止重试并清除旧提示。离开页面或状态变化会取消旧请求，迟到的响应不能改写当前身份。聊天页按 UIN 重建，缓存按账号恢复；store 的异步操作以账号切换代次隔离，旧账号的联系人、群成员、通知和置顶请求不能覆盖新账号。重复确认同一账号保留缓存和有效请求。回归见 独立 WebQQ 插件的 `test/stores/webqqAccount.test.ts`、`webqqStore.test.ts`
- 插件只需要 `inject` 自己**直接**访问的服务：经 `ctx.xxx` 调到别的服务的方法时，cordis 按那个服务自己的 fiber 做严格检查（`createShadow` 的 `defSite` 是服务本身的 ctx），调用方 ctx 只决定方法里注册的副作用挂在谁身上。但像 `Core.sendMessage(ctx, ...)` 这种把 ctx 当参数传进去的，参数 ctx 访问的服务要算在调用方头上
- 登录后才提供的 `app` / `store` 由 NT 协议 manifest 声明并标注「NTQQ 账号登录」。等待它们的插件显示该原因及协议设置页入口；协议停用时提示先启用协议。

### 内置插件的设置（`BuiltinConfig`）

Satori、QQ 官方机器人等内置插件的设置和第三方插件一样存在实例 `plugins.json` 的条目里，经同一套 `describe` / `updateConfig` / rev / 409 读写，开关就是条目的开关。schema 是插件自己的 `Config`（如 `src/plugin/internal/adapter/satori/settings.ts` 的 `SatoriSchema`）。NTQQ、OneBot 11 和 Milky 的 schema 则位于各自独立插件的 `src/settings.ts`，走普通插件路径，不再使用 `BuiltinConfig`。`BuiltinPlugin.config` 只补内置 schema 表达不了的：

- `check(value, enabled)`：内置插件的跨字段规则，`enabled` 是条目是否正在运行或准备启用。保存时按当前开关校验；Satori 声明 `checkOnEnable`，启用时再检查公开监听地址的 token。QQ 官方机器人也不声明：未填 AppID / AppSecret 时可先启用，再从设置页填写。`checkOnEnable` 只给启用安全校验使用。独立适配器的校验由它自己的 Config 和入口承担。
- `notice(value)`：启用的条目按当前设置给卡片的一句话（`PluginStatus.notice`），用于"没配完也能启动、等着配"的插件：插件本身照常运行但什么都不做，卡片显示琥珀色的"待配置"和这句话，设置页顶部也提示。QQ 官方机器人用它说"还没有填写 AppID 和 AppSecret"，插件见没填就只记一行 info 返回。别让这种插件在启动时抛错（owner 2026-10-28：缺配置应该在保存时检测，不是一启动就报错）；真正只有运行时才知道的错（AppID / secret 不对）照旧让条目失败
- `normalize`：内置插件校验前的值规整；第三方包应通过自己的 schema 或入口处理。
- `secrets`：`describe` 把非空的 secret 换成 `SECRET_MASK`；写回时发来掩码或空串就保留原值，`PUT` 带 `clear: [路径]` 才清空，发来新值以新值为准（先点"清空"再输入新密码，存的是新密码）。内置插件只有官方机器人的 AppSecret 显式声明，独立 NTQQ掉线邮件通知按 schema 的 secret role 自动处理：适配器的 token 页面本来就显示，不打码，所以内置插件不按 `role('secret')` 自动打码。rev 加了进程内随机盐，因为配置里可能有密码
- **第三方插件的密码**（`src/plugin/host/secrets.ts`，2026-11-02）：没有 `BuiltinConfig`，按 schema 里的 `role('secret')` 自动找（`secretPaths()`，`*` 表示列表的每一项、dict 的每个值；`Schema.lazy()` 递归的 schema 只找到第一次重复为止），`describe` 返回的 `secrets` 就是它们。固定位置的规则同上；**列表里的**（AI 服务每个 AI 的 Key）掩码是 `********#<token>`，token 是密码的 HMAC（进程内随机盐，取 8 位）：表单里的项会被调整顺序、删掉、新增，按下标还原会把 Key 对错项，所以写回时按 token 找回原值，找不到（期间被改过，或重启换了盐）就报 issue 让用户重填，不猜；列表里发来空串就是清空，不看 `clear`；没带 token 的裸掩码按同一位置找。前端认两种掩码（`inputs.tsx` 的 `isSecretMask()`），手动删空后失焦恢复掩码，只有点「清空」才会发出空串
- 保存默认会让条目整个重启（`fiber.update`）。不需要重启的改动由插件自己拦：NTQQ 协议用 `ctx.on('internal/update')` 只在换登录模式（或桥接换 NativeQQ 配置）时放行，只改协议不会把已登录的账号踢下线
- `initial()`：内置条目第一次出现时的开关和配置；Satori 取宿主 `default_config.json` 的对应段（`enable` 变成条目开关），外部 NTQQ、OneBot 11、Milky、NTQQ掉线邮件通知不会因此被自动创建或安装；已有配置由启动迁移保留。

宿主的 Satori 经 `adapterEntry()`（`src/plugin/internal/adapter/adapterEntry.ts`）包一层：`inject` 声明 `config` 和适配器自己的依赖，`apply` 把条目配置加上 `enable: true` 后挂载并 await；失败由条目报告。修改条目配置会重启 Satori，修改无关 Bot 设置不应断开客户端。`test/unit/bootstrap/builtins.test.ts` 使用真实端口验证启动、换端口、停用释放与重启。OneBot 11 / Milky 的装载和配置测试在各自插件仓库维护。

- **旧形状的兼容**（`src/main/config/legacyConfig.ts`）：OneBot `get_config` / `set_config` 和 `POST /api/config` 仍收发 `{ ...bot 设置, ob11, satori, milky }`。读时三段由条目拼回，`enable` 就是条目开关；写时三段交给插件服务（按 key 合并，`enable` 转成启用 / 停用，先停用再改），其余进 `settings.json`。`set_config` 按 owner 的决定不加 token 校验（`rules: false`，schema 照查），并且在回复发出之后才应用：改 ob11 段会重启承载这次请求的 OneBot 连接，等它会把回复卡在自己服务器的关闭上
- OneBot 11 / Milky 独立安装后，兼容段通过 `ADAPTER_ENTRIES` 对应 `@luckylillia/plugin-onebot11` / `@luckylillia/plugin-milky`，Satori 仍对应 `builtin:satori`。`PluginService.entrySettings()` 是同步只读视图：只使用已载入的 schema 或磁盘条目配置，不能因读取配置而加载未信任、停用或缺失的包；同包有多个条目时旧接口只映射第一个。外部适配器经 `ctx.config.getLegacy()` / `patchLegacy()` 使用同一兼容逻辑。写入配置或启用前仍需显式信任，`rules: false` 不能绕过信任；WebUI 返回 428 和包名。`builtinSettings()` 保留给仍在宿主中的内置插件使用。
- **启动时接管**：`liftBuiltinSettings()`（`src/main/config/migrate.ts`，在实例锁之后）把实例 `settings.json` 里还在的 `ob11` / `satori` / `milky` 段和实例下的 `email.json` 搬进条目（老格式的 ob11 先转换），没升级的桌面端或手改写进 `settings.json` 的段也就跟着接管了；`plugins.json` 读不出来时不搬，等修好

## 状态

`PluginStatus.state` 由 fiber 状态加几种 fiber 之外的情况组成：

| state | 含义 |
|---|---|
| `missing` | 条目引用的包不在任何插件根目录里 |
| `incompatible` | SDK peer 版本不满足 host，或 `llbot.dependencies` 要求的插件包已安装但版本不匹配；不加载，`error` 说明原因 |
| `loading` | 正在 import 模块，或 fiber LOADING / UNLOADING |
| `pending` | 缺少 `llbot.dependencies` 要求的插件包（`error` 写包名和范围），或 fiber PENDING、`inject` 的服务还没就绪（`missingDeps` 只列服务名） |
| `active` | fiber ACTIVE |
| `failed` | import 失败、`apply` 抛错，或配置没通过 schema 校验；`error` 是原因 |
| `disposed` | 停用 |

状态变化订阅的是 cordis 内置的 `internal/status` 事件，再以 `plugins/changed(id?)`（`@mode emit`，`id` 为空表示条目列表本身变了）转发出去，WebUI 的 SSE 只听后者。

几个 cordis 4.0.0-rc.11 的行为直接决定了实现（细节见 [cordis-upgrade-notes.md](cordis-upgrade-notes.md)）：

- `ctx.plugin()` 返回的是 `Object.create(fiber)` 包了一层 `then`，不是 fiber 本体；`internal/status` 传的是本体，所以要用 `.ctx.fiber` 取回来做映射
- `fiber.await()` 只等进行中的加载 / 卸载，对 PENDING 的 fiber 立刻返回；FAILED 时会把错误重新抛出 —— 这也是拿到失败原因的唯一公开途径
- `fiber.update(config)` 只在 fiber 已加载时同步校验配置，PENDING 时不校验。`updateConfig()` 因此先自己校验合并后的生效值，失败抛 `PluginConfigError`，不动正在运行的实例、不写盘

## WebUI 管理面

**运行时路由表**：`WebuiServer.route(prefix, handler)` 让插件在 WebUI 下挂 HTTP 接口，返回的 disposer 挂在调用方的 `ctx.effect` 上，插件卸载时自动摘除。Hono 本身不能注销路由，所以 `initServer()` 在所有内置路由之后、静态文件之前挂了一个 `/api/*` 分发中间件，按前缀查一张可变的表 —— 内置路由先注册，永远优先命中；鉴权中间件在更前面，挂上来的路由自动受保护。`handler` 只要有 `fetch(request, env)`，收到的是完整 URL（Hono 子应用用 `basePath(prefix)` 或 `route(prefix, ...)`），请求体原样转发，multipart 也没问题。

**WebUI 的路由都按依赖挂载**：`WebuiServer` 由核心内置条目 `builtin:webui` 挂载，只 inject `config`，不依赖协议；内建配置、`bots` 与文件选择路由，其余接口由各插件经 `webuiServer.route()` 注册。`builtin:webui` 不能停用或重载，避免关闭正在承载该请求的 HTTP 服务。`GET /api/config` 只返回 Bot 设置，不带账号状态；`/api/bots` 列出 `ctx.bots` 的账号，供侧边栏、状态提示和 `useBots()` 使用。

NTQQ 的登录、快速登录、退出、Auth Token、`/api/login-info` 和 `/api/ntqq/stats` 均在独立 NTQQ 包的 `src/` 下注册，停用插件时一起卸载，不再有宿主 standby 路由。状态面板、日志、插件管理仍由各自内置条目提供路由；WebQQ 路由由独立插件提供；NTQQ掉线邮件通知的测试接口由独立包提供；只有代理测试使用内置 standby。没有命中的 `/api/*`（包括插件未安装、停用或等待依赖）统一返回 JSON 404 `{ success: false, message }`。

**`/api/plugins`**（`src/plugin/internal/service/webui/BE/routes/plugins.ts`）本身就是经路由表挂上的插件 `PluginRoutes`（`inject: ['webuiServer', 'plugins']`）：

| 方法 | 路径 | 作用 |
|---|---|---|
| GET | `/` | 条目列表（过滤掉 `manifest.hidden`） |
| GET | `/stream` | SSE：`changed` 事件，`{ type: 'status', data }`、`{ type: 'list' }` 或 `{ type: 'ui', data }`（用户偏好变了，见"插件前端"的用户偏好；鉴权走 `?token=`） |
| POST | `/scan` | 重新扫描 |
| GET | `/directories` | `{ roots: string[] }`，当前配置的插件扫描根目录，转换为绝对路径；供本地安装弹框展示，不依赖市场插件 |
| GET · PATCH | `/ui` | 用户对插件界面的隐藏 / 排序（`plugins.json` 的 `ui`）；PATCH 的 body 是增量 |
| POST · DELETE | `/` · `/:id` | 新建实例（`{ name, config?, trust? }`）· 删除条目 |
| POST | `/:id/uninstall` | 删除这个包的已扫描目录或链接，body 必须明确给出 `{ keepConfig: boolean }`；不依赖市场服务，也支持额外扫描根目录和目录名不同于包名的本地插件。服务端从条目查路径，不接受前端指定路径 |
| POST | `/:id/remove-missing` | 包文件缺失时移除当前 Bot 实例的该包全部条目，body `{ keepConfig?: boolean }`；操作前重新扫描，文件已恢复则拒绝 |
| POST | `/:id/enable` · `/:id/disable` · `/:id/reload` | `enable` 的 body 可以带 `{ trust: true }`（用户在信任框里点了信任）；没信任过的第三方包回 428 |
| PUT | `/:id/scope` | body `{ scope }`（`EntryScope`；`null` 或什么都没限制就是清掉），立刻生效 |
| PUT | `/order` | body `{ order }`：处理消息的条目 id 顺序，不认识的 id 丢掉，空数组恢复默认 |
| DELETE | `/:id/listener-error` | 清掉卡片上记着的监听器错误 |
| GET | `/:id/schema` | `{ schema, defaults, config, effective, rev }`（有密码字段的另有 `secrets`，内置插件另有 `location`），会 import 尚未加载的模块。`config` 是存下来的差异，`effective` 是补齐默认值后插件实际用的值 |
| GET | `/:id/dependencies` | 依赖报告，见下 |
| PUT | `/:id/config` | body `{ config, ifRev?, clear? }`，`config` 是完整值。400 时 `data.issues` 是 `[{ path, message }]`；409 表示 `ifRev` 过期，`data.rev` 是当前值 |

**依赖报告**（`PluginService.dependencies(id)`）：`packages` 来自 `llbot.dependencies`，无包依赖时省略；每项是 `name` / `range` / `version?` / `entries`（匹配条目 ID）/ `state`，状态为 `missing` / `incompatible` / `disabled` / `pending` / `active` / `failed`。服务报告里的 `PluginStatus.service` 是清单的 `llbot.service`（`normalizeService()` 补齐三个列表，格式不对的部分丢弃并打 warning）合并模块加载后的 `Inject.resolve(plugin.inject)` 和 `plugin.provide`；内置条目只用 `BuiltinPlugin.manifest.service`（它们的 inject 是一长串 Bot 内部服务，对插件页没意义），四个适配器 / 邮件通知声明了自己 `implements` 的服务名。报告按请求现算，因为"服务在不在"取决于整个 app：

- `available` 用 `reflect._getImpl` + `Service.check`（和 `missingDeps` 同一个判断，`ctx.get()` 不看 check，不能用它判断带可用性检查的服务是否就绪）
- `provider`：从提供该服务的 fiber 沿 `parent.fiber` 往上找，碰到某个条目挂载的 fiber 就是它；找不到说明是 Bot 自带
- `candidates`：其他条目里 `implements` 了这个服务的；`conflicts`：自己 `implements` 的服务还有哪些**启用中**的条目也 `implements`
- 冲突只提示不拦截：cordis 会让后起来的提供者失败（`service "xxx" has been registered at <...>`），先起来的不受影响。前端卡片上的冲突提示由 `findConflicts()` 用列表现算，不调接口

错误码：`PluginNotFoundError` → 404，`PluginForbiddenError` → 403（内置条目不支持的操作），`PluginConfigError` → 400（带 issues），`PluginRevConflictError` → 409，`PluginTrustRequiredError` → 428（`data.package`），其它 → 500。cordis 自己的 `ValidationError` 只拼一段文本、不保留 issues，所以 `updateConfig` 直接调 Standard Schema 的 `validate()` 自己抛 `PluginConfigError`。

**前端**在 `src/plugin/internal/service/webui/FE/components/plugins/`，类型在 `types/plugins.ts`（手工和 `src/plugin/host/index.ts` 对齐 —— FE 的 tsconfig 没有 node 类型，不能直接 import 后端模块）。`utils/api.ts` 的 `apiFetch` 遇到非 2xx 抛 `ApiError`（带 `status` 和响应体里的 `data`），保存配置靠它拿到 issues。

配置弹框的 `DependencyList` 只展示 `llbot.dependencies` 声明的插件包，保留名称、包名、版本要求、安装 / 运行状态以及启用入口；没有包依赖时隐藏整个区域。默认显示前三条，超过三条时可展开其余依赖或收起，重新打开配置时恢复折叠。不再在这里罗列 `bots`、`http` 等服务依赖和 `implements`；服务就绪与冲突检查保持原有逻辑，插件卡片仍显示等待原因和冲突提示。

配置弹框的「生效范围」默认折叠，点击标题展开，也可用键盘 Enter / 空格切换；折叠只隐藏内容，不卸载 `ScopeEditor`、不丢弃草稿，收起后保存仍会提交已修改的范围。

插件配置弹框通过 `Portal` 的 `lockScroll` 锁住背景页面滚动，关闭后恢复原样；锁定时补偿滚动条宽度，多个弹框同时使用时等最后一个关闭再解锁。弹框内容区使用 `overscroll-contain`，滚到边缘时不继续滚动 WebUI，标题和底部按钮固定在内容区外。

插件卡片暂不提供「添加一个实例」按钮（owner 2026-11-08）。

**登录的拒绝带标记**：鉴权（`BE/auth.ts` 的 `checkToken()`）拒绝时回 `X-Webui-Auth: unset | required | wrong | locked` 头，前端的 `authorizedFetch`（插件拿到的 `ctx.fetch` / `ctx.api` 也是它）只在带这个头的 401 / 403 上要密码；路由自己回的 401 / 403（`PluginForbiddenError`、插件自己的接口）原样交给调用方。原来任何 403 都会弹密码框，输对了接口照样 403，弹满 5 次报"认证失败"；任何 401 都会走"设置密码"。`checkToken()` 也是唯一的密码比对处：API 的请求头 / `?token=` 和 `/plugin-webui` 的 cookie 都经它计入失败次数和锁定（连续错 4 次锁 1 小时，不分 IP）

**schemastery 渲染器**（`components/plugins/schema/`）：

- 线格式是 `toJSON()` 的引用表 `{ uid, refs: { [uid]: { type, meta, list: [uid], dict: { key: uid }, inner, sKey, value, bits } } }`，不是嵌套结构。`model.ts` 的 `hydrate()` 先登记节点再填子节点，`Schema.lazy()` 自引用产生的环能终止；`lazy` 节点透明化为它的 `inner`。`constructor` 这个键名会撞 `Object.prototype.constructor`，节点里不保留它
- `Schema.date()` / `regExp()` 是 `union(is(X), transform(string))`：`is` / `function` 成员没有 JSON 表示，丢掉后只剩字符串那一支
- union 分形态：全 const → 下拉（role `radio` 时单选）；`[const(false), X]` → 开关；`[X, const(null)]` → 直接编辑 X；各分支 object 共享一个 const 键 → tagged，顶部按钮切换分支；其余 → JSON 编辑框。`intersect` 只在成员都是 object 时平铺合并
- `role` 优先于 `type`：`secret` / `textarea` / `ms` / `slider`（`percent()` 显示为百分比）/ `table`（`array(object)` 渲染成 `table-fixed` 表格）/ `radio` / `checkbox`（const 数组的多选）。不认识的类型一律落到 JSON 编辑框，永不白屏；嵌套超过 6 层也用 JSON
- 表单编辑的是完整值（服务端给的 `effective`）；保存时把完整值连同 `ifRev` 发回去，剥默认值由服务端做，`plugins.json` 只存用户改过的部分，插件升级改了默认值时用户自动跟上
- `model.ts` / `values.ts` 是对 `src/common/schema/` 的 re-export（经 `@shared` 别名：FE 的 vite 和 tsconfig、根 vitest 各配了一份），只有 `initialValue()` 这种纯表单逻辑留在前端
- 卡片图标用一张固定的 lucide 图标表（`meta.ts`），没用 `lucide-react/dynamic` 的 `DynamicIcon`：它会给约 1600 个图标各生成一个 chunk

**端到端验证方法**（不登录 QQ）：按 [插件开发指南](plugin-authoring.md#扩展-webui) 在临时插件目录准备待测包；后端运行 `tsx --tsconfig <repo>/tsconfig.json <repo>/src/main/main.ts --plugin-dir <临时插件目录>`，cwd 使用隔离临时目录，预置 `data/instances/default/webui_token.txt` 和 `settings.json`（例如 `{ "webui": { "enable": true, "host": "127.0.0.1", "port": 3999 } }`）。不要在测试根目录安装并启用真实 NTQQ 协议；没有该包时宿主可以正常运行。需要 NTQQ 设置页时使用停用的条目和前端响应 mock，不通过启动 QQ 或使用真实凭证取得状态。前端使用独立 Vite 端口并代理到该 WebUI，浏览器设置对应端口的 WebUI token cookie 后操作。

需要登录后的页面时拦截响应：NTQQ 状态卡读 `/api/ntqq/stats`；WebQQ 将插件状态设为 `active`、清空 `missingDeps`，再 mock `/api/webqq/self`、好友、群、置顶、消息等数据。改 hash 不会重载页面，挂好 mock 后应 `page.reload()`。playwright-cli 的 `run-code` 沙箱里不要依赖 `Buffer` 等 Node 全局；图片可用 `route.fulfill({ path })`。开发时往注册表测试插槽应 import App 正在用的模块 URL（含 Vite 的 `?t=`），可从 performance 资源表查找；不同 URL 会产生另一份注册表。

- **不要用默认的 3080 / 15173**：桌面浏览器里开着的 WebUI 页面会自动重连上临时实例，带着真实密码的 cookie（cookie 不分端口），校验失败，连续失败 4 次临时实例的 API 就锁一小时
- **不要用 `vite --open false`**：`false` 被当成路径，照样在桌面浏览器打开页面。用 `BROWSER=none`
- shell 里设了 `HTTP_PROXY` / `HTTPS_PROXY` 时，curl 探本机端口要加 `--noproxy '*'`：否则请求走代理，没在听的端口会拿到代理回的 502，看起来像"有服务"
- Windows 下用后台任务起的 `npx vite`，停掉 shell 之后 node 子进程还在占着端口：按端口找进程结束（PowerShell `Get-NetTCPConnection -LocalPort <port>` 取 `OwningProcess`）
- 验证 env 层：启动后端时带 `LLBOT_WEBUI_PORT=<port>`（或启动参数 `--webui-port <port>`，两个都给时启动参数优先），实例的 `settings.json` 里写另一个端口。WebUI 会起在给的端口，`GET /api/config` 的 `envLocked` 列出它（`by` 是变量名或参数名），侧边栏「页面设置」页里（插件页「页面设置」卡片的齿轮也到这里），WebUI 的端口框只读，提示写明是环境变量还是启动参数
- `playwright-cli fill <ref> -1` 会把 `-1` 当成命令行选项，填负数要用 `run-code`
- `playwright-cli run-code` 每次调用的全局变量不共享：要在测试中途翻转一个 mock（比如让账号掉线再上线），在同一个脚本里注册 `page.route` 并改闭包变量

## 插件市场

**手动更新**：`POST /api/market/update { name, version, currentVersion }` 与安装、卸载、安装器启动清理共用插件真实根目录的跨进程锁（`src/plugin/host/shared-packages.ts`）。取得锁后重新扫描并核对已装版本和目录中的目标版本，只接受升级；当前版本变化、目录版本变化、降级或未安装均拒绝并要求刷新。统一插件卡片的更新动作调用这个接口。普通插件在所有参与实例停止该包后替换，随后各自重载；内置包只写入经过校验的更新快照，所有实例刷新已安装版本与 `restartRequired`，运行中的核心仍保持原版本。原条目 id、配置、启用状态保留。

**共享目录协调**：每个 `PluginService` 启动时先登记私有本机 RPC 端点，再选择内置快照、扫描和加载插件。登记本身经过相同的根锁，避免一个新实例在替换中途加载包；无需启用市场或 `--plugin-hmr`。Windows 根锁是命名管道，Linux/macOS 使用按真实路径确定的本机回环端口信号量；端口碰撞只会额外串行，不产生两个写入者，端口被外部程序占用则超时报错。进程异常退出时锁由内核释放，不根据心跳超时抢占仍在运行的写入者。多个根按实际锁标识排序并去重；同一实例同时收到不同根的更新准备请求时，后来的请求在替换前拒绝。

包下载和解压成功后，发起方持久写入 `.llbot-packages/pending.json` 并询问所有存活实例。每个实例验证目标 SDK、内置 ABI、插件依赖及其自身目录中消费者的版本要求，阻止新的启用/重载/扫描，等待已有扫描和包操作完成，再停止该包的运行条目。任一实例拒绝或无法应答都不替换目录；已停止的实例恢复原包。全部确认后才替换磁盘，随后每个实例按自己的最新配置和开关加载新版，原来停用的仍停用，协调期间用户主动停用的条目不会重新启用。开发 HMR 忽略本次受协调替换的重复文件事件。运行中插件无法热导入时先拒绝替换，避免另一个实例仍使用旧代码和新版资源。

安装/更新/卸载结果的 `instances` 返回 `{ instance, pid, status, reason?, entries? }[]`；状态为 `reloaded`、`unchanged`、`removed`、`restart-required` 或 `failed`。插件初始化失败会同时留在该实例的插件错误状态与日志中，发起页面不能显示全部加载成功。最后一次结果保存在 `.llbot-packages/last.json`。通信未完成的事务保留 pending，其他实例取得已经释放的根锁后重试完成；命令幂等，完成过的同一事务不重复重载。`swap.json` 保存两次目录改名的恢复信息，崩溃后若目标缺失先恢复旧目录，再让参与实例依据实际磁盘恢复。这里不回滚插件数据或把其他实例重新启动，也不保证候选插件已经执行的副作用可逆。

支持范围是同机、同一运行环境与用户（同一个本机临时目录）、本地插件根目录，以及都包含本协调功能的 Bot 实例。登记文件只包含实例身份、随机通道凭据等协调信息，不复制插件配置；文件以 `0600` 创建。本机临时目录的 `llbot-plugin-peers/<真实路径摘要>/` 同时保存登记，目录使用 `0700`：只读的 `--plugin-dir` 无需修改包目录即可继续加载插件，市场将其视为不可管理。其他有写权限的实例也会发现这个只读读者，并在替换前拒绝更新，要求先停止只读实例，避免悄悄漏掉运行者。只读目录若已有未完成的目录改名，则要求有写权限的实例先恢复，不从可能不完整的包继续启动。

不支持多个 Docker 容器/机器共享插件目录，也不能约束旧版 Bot 或用户在外部直接覆盖包。Linux 还核对 boot id、PID 与网络 namespace，不能因两个容器 hostname 相同就当作同机参与者。外地运行环境的遗留登记不自动删除：强制终止容器后重建、或迁移整个插件目录时，需要确认原环境已经停止，再清理对应的 `.llbot-packages/peers/*.json`；未完成事务须先保留并恢复。正常停止会撤销登记。

前端共享状态在 `client/store.ts`：有订阅者时每 10 分钟检查一次，页面恢复可见或窗口获得焦点时补查过期结果；「检查更新」强制刷新。并发检查去重，安装版本变化、安装/卸载或插件重载使旧请求结果失效；最后一个订阅者移除时停止计时器和事件监听。统一列表显示可更新、已是最新、检查失败及等待重启状态，筛选栏支持「只看可更新」。卡片隐藏常规的「该插件已不在当前市场目录中，无法从市场更新」提示，API 的 `blocked` 值保留；兼容性阻塞、请求失败和更新未加载等实际问题仍显示。不会自动下载或安装更新。

`builtin:market`（`src/plugin/internal/tool/market/`，默认启用，可以停用）。Bot 发布版只带一个 node，没有 npm，所以安装是自己做的：

市场目录条目的可选 `category` 使用宿主 `PLUGIN_CATEGORIES` 的七个值，依次为 `protocol`（协议端）/ `adapter`（适配器）/ `chat`（消息互动）/ `tool`（工具）/ `service`（依赖组件）/ `theme`（主题）/ `other`（其他）。登记时由作者选择，自动更新版本时保留，目录和搜索 API 原样返回；目录解析拒绝未知分类，旧目录未提供该字段时仍可读取，搜索筛选、数量统计和界面展示都按 `other` 处理，不补写目录字段。安装后的插件列表继续使用 npm 包的 `llbot.category`，建议作者与登记选择保持一致；分类不决定内置或第三方身份。

- **目录和源**（`catalog.ts` / `registry.ts`）：设置为 `registry`（npm 下载源，默认 npmmirror）和 `catalog`（目录包名，默认 `@luckylillia/market`），不再使用旧 `search` 地址或 npm 关键词搜索。Bot 获取目录包的 `latest` 元数据，下载并校验 tarball，只在内存里读取 `plugins.json`，不安装或执行目录包。每个条目提供 `name`、`version`、`title`、`description`、`author: { name, url? }`、`repository`，其中 `version` 是目录批准的唯一精确版本，缺失或无效时拒绝整个目录。旧双文件格式不再支持，不读取 `versions.json`。目录按 npm 版本和校验值缓存；搜索、检查更新和安装操作先刷新目录包元数据，一次安装固定同一份目录快照。搜索按目录内容过滤、分页，关键词不再决定收录；默认目录的登记流程见 [LuckyLillia.Market](https://github.com/LuckyLilliaDev/LuckyLillia.Market)。插件包取完整 npm 文档（装之前确认有 `llbot`），普通 npm 库取精简文档（`application/vnd.npm.install-v1+json`）；一次安装里每个包的文档只取一次，安装之间不缓存
- **插件依赖**（`llbot.dependencies`）：先在 `plugins.packageList` 中按包名找已安装且版本兼容的包，包括开发中的链接和其他扫描根目录里的包；已装版本不兼容就回 409，由用户明确更新，不静默替换。缺少的包必须出现在当前目录中，且目录指定的精确版本同时满足依赖范围和宿主 SDK；否则说明原因，不回退 npm 历史版本或下载未收录的版本。复用的已装包和待安装的包都递归检查插件依赖。安装前先规划完整依赖图，检查循环依赖和同包版本要求冲突；不通过时不写入插件目录。新依赖作为独立插件装在第一个插件根目录，按依赖顺序安装，最终扫描建立各自条目。每个包分别原子安装，整棵依赖图不是一个事务：下载或后续包安装失败时，已经装好的依赖保留并出现在宿主列表中
- **插件版本与更新**：从市场目录安装时只用 `plugins.json` 条目中 `version` 指定的精确版本，并检查 `peerDependencies['@luckylillia/plugin-sdk']` 是否满足 host。界面安装和更新时提交用户看到的 `version`；目录已变更则提示刷新，不静默改装新版本。npm 发布了新版本但目录尚未更新时，不提示插件更新；目录移除已安装的插件时返回 `blocked`，保留已装包。更新只在目录版本高于已装版本且兼容时提供，开发链接和较新的已装版本不会出现降级更新
- **本地安装**（`upload.ts`、`archive.ts`、`client/LocalInstallPanel.tsx`）：插件页筛选栏右侧的「本地安装」打开宿主 `LocalInstallDialog.tsx`。弹框不再切换上传/扫描标签：上方显示 `GET /api/plugins/directories` 返回的真实绝对路径，目录旁直接提供「扫描」按钮；下方始终展示 `plugins.install` 上传区域，选择或拖入浏览器所在电脑的压缩包。目录查询和 `/api/plugins/scan` 都是宿主路由，市场停用时仍可显示目录和扫描；没有上传贡献时，仅上传区域提示启用插件市场。上传支持顶层含 `package.json` 的 ZIP，以及 `npm pack` 格式的 `.tgz` / `.tar.gz`（文件位于 `package/` 下）。选择或拖入文件后，在同一弹框显示权限、同名覆盖与重载提示，勾选信任确认后才能点击「安装插件」，不再嵌套确认弹框。上传成功或扫描成功都关闭弹框，清空搜索、来源、状态、分类及更新筛选，返回「已安装」第一页。主包不要求收录，也不受目录版本约束，但检查包名、完整版本号、`llbot`、入口文件和 SDK 兼容性；依赖规划、安装队列、原子替换、扫描、重载和安装脚本策略与目录安装共用。只有缺少插件依赖时才读取目录；自包含的包或依赖均已安装时，目录不可用也能安装。multipart 上传用 busboy 流式写入临时文件，ZIP 用 yauzl 从文件读取并校验大小和 CRC，npm 包用流式 gunzip 和 tar 读取器逐个写入暂存目录；不设固定的上传大小、解压总量或条目数上限，拒绝加密包、重复路径、文件与目录冲突及跨平台不安全路径，普通文件和目录之外的条目丢掉。整个本地包先解压到暂存目录并校验完，再安装任何依赖或替换插件；暂存目录与插件目录在同一文件系统，安装时直接改名移动，不把文件内容重新读进内存。上传中断、校验或安装失败都会清理临时文件，启动时也清理崩溃遗留的 `.market-*`
- **图片展示**：目录的可选 `icon` 和 `screenshots` 保存包内图片相对路径或 HTTP(S) 地址；`screenshots` 接受字符串及 `{ src, caption }` 对象，路径、说明和对象均保留。`images.ts` 按插件包名和目录登记的精确版本生成 `https://cdn.jsdelivr.net/npm/<包名>@<版本>/<路径>`，各文件名段分别编码，`./` 前缀不进入 URL，中文、空格、`%`、`#`、`?` 等按文件名处理；外部 HTTP(S) 地址直接保留。市场卡片懒加载图标，缺省或加载失败显示拼图。目录兼容旧 `examples` URL 数组，转为 `screenshots`；同时声明两者时以 `screenshots` 为准，包括显式空数组。相对路径不接受绝对路径、`..` 路径段、反斜杠、冒号、控制字符及首尾空白。安装后，宿主从 npm 包的 `llbot.icon` / `llbot.details` / `llbot.screenshots` 读取本地资源，经 `/plugin-assets` 在插件列表和详情中展示（见上文"名字、作者、图标和详情"）
- **目录详情**：统一卡片始终提供 Info，未安装或没有截图也可打开。市场通过 `plugins.catalog` 提供已有目录元数据和截图，宿主直接打开共用详情弹框，不新增详情请求、npm 清单请求或远端 README 下载。图片按 HTTP(S) 地址或由包名、精确版本与相对路径生成的 jsDelivr URL 加载，由共用 `Lightbox` 放大。已安装条目仅在 `hasDetails` 为真时调用本地详情接口，否则只展示已有元数据。
- **普通库选版本**（`pickVersion()`）：维持 npm 的规则，`latest` 标签合适就用它，否则取范围内最高的，范围没写预发布就不取预发布；`compare-versions` 不认的 `1` / `1.2` / `*` / 空串先规整。普通库不要求收录到插件目录
- **普通库布局**（`installer.ts` 的 `plan()`）：包顶层 `dependencies` 放插件自己的 `node_modules`；那里或往上的路上已经有别的版本时，放到需要它的包下面。一个节点的依赖都放好之后才轮到它的子孙查找，后放的不会遮住先解析好的。别名（`npm:x@^1`）用别名做目录；`optionalDependencies` 不合平台（`os` / `cpu` / `libc`，`!` 取反）或找不到就跳过；`bundleDependencies` 不装；`SHARED_SPECIFIERS`（SDK、cordis……）不装，模块钩子反正解析到 host 的；git / file / URL 依赖报错；嵌套超过 64 层报错
- **下载和解包**：tarball 校验 `dist.integrity` 里最强的哈希（没有就用 `shasum`），gunzip 后用自己的 tar 读取器（`tar.ts`：ustar、pax 和 GNU 长文件名、头部校验和），只写普通文件和目录（链接、设备丢掉），路径出了包目录就整个失败。8 个并发
- **原子替换**：先装进插件根目录下的 `.market-<随机>`（点开头，扫描和热重载都跳过），等待各实例停止确认，再把旧目录改名挪走、新目录改名进去、删旧的；挪不动（Windows 上文件被占用，多半是加载过的原生模块）就报错并恢复原包。两次改名之间的恢复信息保存在 `swap.json`，先恢复缺失的目标，再清理 `.market-*`，启动清理同样持根锁。上传在等待安装锁之前使用 `.llbot-upload-*`，由本次上传的 finally 清理，别的实例不会删除仍在上传的目录。市场安装和更新只替换第一个插件根目录（`data/plugins/`，`PluginService.Config.roots[0]`）里的真目录；开发链接和额外 `--plugin-dir` 的同名包不会被更新覆盖。本地插件删除由下面的宿主卸载接口单独处理
- **装完**：`plugins.scan()`，新包按惯例建停用的条目（启用时问信任）；若有同名包的保留配置，则恢复全部原条目及其配置、生效范围，随后移除 `retained` 中的对应记录，全部保持停用，启用需重新信任。市场安装、本地安装及启动后的扫描共用这一恢复逻辑。更新的包有启用的条目就 `plugins.reload()` 一次（整个包的条目一起重载）。`reloadPackage()` 先清掉 `require.cache` 里这个包目录下的 CommonJS 模块，ES 模块靠 `?v=` 传到包里（含它自己的 `node_modules`）重新导入。vitest 用自己的模块加载，不经过这个钩子：`market.test.ts` 只能断言插件自己的代码换了，依赖那部分由 `resolve-hook.test.ts` 和真实 Node 下的端到端验证保证
- **卸载**：点击卡片的卸载图标先打开独立的 `PluginUninstallDialog.tsx`，显示插件标题、包名与默认勾选的「保留配置」；确认时显式提交 `keepConfig`，取消不发请求，不在卡片内展开确认区。后端先协调所有存活实例停止该包，再挪走和删除共享目录；各实例通过 `plugins.removePackage()` 移除条目，清除其 `messageOrder`、信任和界面偏好，再扫描。发起实例按用户勾选决定是否将原条目配置与生效范围写入自身 `plugins.json` 的 `retained`；其他实例始终保留自己的配置归档、保持停用，发起实例不能删除它们的配置。已安装列表不留下缺失条目。保留与否都不删除插件数据目录
- **本地目录与链接删除**：`managed: false` 只表示市场不能覆盖更新，不再决定删除按钮。扫描器保留包的 ESM 真实路径 `root`，另外记录 `location`（扫描根、相对目录、directory/link）；可写的安全扫描位置通过条目的 `removal` 提供给界面。宿主 `uninstallPackage()` 在对应扫描根的跨实例锁内重新核对来源，协调使用同一扫描位置的实例，然后删除目录；目录名无需等于 npm 包名。普通目录先同根改名为 `.llbot-removed-<UUID>` 再清理，未完成清理的残留在下次持根锁时重试；符号链接 / Windows junction 只 `unlink` 扫描位置，保留外部源码和链接目标。弹框显示操作的具体路径，链接删除明确说明保留原文件。`@scope` 父目录本身是链接时，不允许借删除其中一个包进入外部目录；只读目录、内置与核心条目同样不能删除。其他实例若选用了别处的同名包，在变更前拒绝，不移除其配置。缺文件的卡片则调用 `remove-missing`，无需市场信息，仍可选择保留配置
- **操作提示**：安装、更新和本地安装结果及其依赖项可携带 `title`，从已扫描条目中按卡片的标题优先级与语言规则解析；`GET /installed` 也包含第三方插件的声明名称。成功提示优先使用结果中的名称，再用已有的已安装包或目录名称，未声明名称时才显示包名，不为名称再发市场请求。卡片底部的 npm、GitHub、Info 均使用 16px 图标和 28px 点击区域，保持相同间距。
- 不跑生命周期脚本，带安装脚本的依赖在结果的 `scripts` 里列出，前端提示。安装 / 卸载排队，一次一件
- **更新可用性**：`updates()` 对较新的目录版本复用安装时的 `planPlugins()`，检查插件清单、当前消费者的版本约束、已装或待补装的插件依赖、SDK 和循环依赖。同一次检查共用包元数据，不下载 tarball、不写插件目录。明确不满足要求的版本返回 `blocked`，临时源故障返回 `error`，两者都保留已知的目录版本。元数据 JSON 无效、下载断连、响应截断和校验失败统一为 `RegistryError`，路由按上游错误返回 502；上游 404 保留
- **页面刷新和失败恢复**：目录加载、已安装包读取和更新检查分别显示错误与重试。目录失败不影响宿主已有条目的展示和配置；包列表失败时保留旧包列表，暂停安装、更新和卸载，成功重试后恢复。安装或卸载开始时清掉更新缓存，结束后重新读取包列表并检查更新（包括部分依赖安装成功、主包失败的情况）。目录和更新请求序号挡住晚返回的旧结果；贡献卸载时清掉目录快照及动作，宿主条目仍保留。
- 路由 `/api/market`：`GET /catalog`（完整目录数组，含精确版本、元数据和内置包映射，统一插件页在浏览未安装项时使用）、`GET /search?q=&page=&origin=all|builtin|third-party&category=all|protocol|adapter|chat|tool|service|theme|other`（`origin`、`category` 默认 `all`，未知值回 400；先按关键词和来源过滤，再统计 `categories: Record<PluginCategory, number>`，七类始终都有数量；随后按分类过滤得到 `total` 并分页，每页 20。`items` 返回目录元数据、精确 `version` 和可选的 `installed`；分类数量不受所选分类和页码影响）、`GET /installed`（扫描到的全部包，`managed` 是市场管不管；管的排前面）、`GET /updates`（每个管着的包：目录版本 `latest`、能装的更新 `update`、目录版本装不了或已移出目录的原因 `blocked`、`deprecated`）、`POST /install { name, version? }`（省略版本时取目录精确版本，指定时必须与目录一致）、`POST /update { name, version, currentVersion }`（只升级，两个版本均必填）、`POST /install-local`（multipart 表单：单个 `file` 和风险确认 `confirm=true`）、`POST /uninstall { name, keepConfig?: boolean }`（省略时默认 `false`，非布尔值回 400；WebUI 总是显式提交勾选值）。`MarketError` 是 400 / 404 / 409，本地包格式错误或上传中断回 400；源回 404 时回 404，源的其它错误回 502
- **前端数据桥**（`client/index.tsx`、`client/store.ts`）：市场只注册 `plugins.catalog` 和 `plugins.install`。目录桥组件返回 `null`，通过 `onChange()` 提供目录、已安装包、更新状态和安装/更新/卸载动作，卸载时回传 `null`。宿主仅在筛选「未安装」或「全部插件」时传 `loadCatalog: true`，通过 `GET /api/market/catalog` 一次取得完整目录，随后由宿主统一搜索、分类、来源筛选和分页；默认「已安装」直接渲染宿主状态，不等待市场网络。已安装包和更新状态仍共用一份 store，页面可见且有订阅者时每 10 分钟检查，恢复可见或窗口获焦时补查过期结果，「检查更新」强制刷新。
- 端到端：本地起一个假 npm 源（照 `market.test.ts` 的 `startRegistry()` 把目录包和插件包打成 tarball），目录包仅提供含精确 `version` 的 `plugins.json`；实例的 `plugins.json` 里预置 `builtin:market` 的 `registry` 指向假源、`catalog` 填目录包名，再按上面"WebUI 管理面"的不登录方法验证。应覆盖 npm latest 高于目录版本、目录刷新后旧安装请求、已装较新版本和开发链接，以及目录加载失败；`marketCatalog.test.ts` 另覆盖条目版本缺失或无效时拒绝目录、忽略旧版本表，以及归档校验和缓存刷新

- **统一设置入口**：设置动作由 `PluginsPage.configure()` 按本地条目 ID 提供，市场只提供包操作。同包多个条目分别显示卡片，打开对应实例的设置；停用的第三方条目也可配置。内置插件有设置页时直接前往，否则打开配置弹框；尚未安装或没有本地条目的包不显示设置齿轮。

- **启用状态同步**：插件卡片和依赖列表通过共享 `pluginList.setEnabled()` 启停插件，成功后立即合并接口返回的完整状态，不依赖 SSE 才更新开关；428 信任确认和请求失败不提前修改状态。实时推送仍负责后续运行变化。

## HTTP 和代理（`ctx.http`、`builtin:proxy`）

插件访问外网走核心服务 `ctx.http`，代理是另一个插件挂在它的事件上的。结构照 Koishi 的 `@cordisjs/plugin-http` 加 `proxy-agent`（2026-11-01 对照过）；第一版是代理插件自己提供 `ctx.proxy.fetch()`，owner 2026-11-02 改成现在这样：插件只管用 `ctx.http`，走不走代理、走哪个都在「代理」插件一处设。

**`ctx.http`**（`src/universal/http.ts` 的 `HttpService`，类型在 `packages/plugin-sdk/src/http.ts`）：

- `main.ts` 紧跟 `TimerService` 装它，测试工具 `createTestApp()` 也装；用它的插件 `inject` 里写 `http`
- `get` / `post` / `put` / `patch` / `delete` 返回解好的内容，`head` 返回响应头，`request` 返回整个回答（`HttpResponse`）；这几个遇到非 2xx 都抛 `HttpError`（带 `response`）。`fetch(url, init, config)` 原样给 `Response`，不看状态。`file(url)` 下载文件（也认 `data:`），返回 `{ data, type, filename }`：服务器说 `application/octet-stream`（QQ 的图片就这样）时按文件头认 PNG / JPEG / GIF / WebP / BMP
- `extend({ baseURL, headers, timeout, proxyAgent })` 得到一个带这些设置的客户端；后给的盖前面的，`headers` 合并。每次请求的设置也是这几项（加 `params` / `data` / `responseType` / `signal` / `redirect`）
- 原生浏览器等需要自行建立连接的客户端调用同步的 `proxy(url, config?)`，取得对该目标实际生效的代理地址；直连返回 `''`。相对地址和配置合并规则与 `fetch` 一致，只触发 `http/proxy(url, { url: '' }, config)`，不发网络请求、不触发 `http/fetch-init`。监听器修改第二个参数的 `url`。地址可能含认证信息，仅在后端交给原生客户端，不返回 WebUI 或写日志；每次启动新连接时重新解析，以反映代理插件的启停和配置更新
- 请求体：普通对象 / 数组发 JSON（加 `content-type: application/json`），字符串、`Buffer`、`FormData`、`URLSearchParams`、流原样给 `fetch`。不写 `responseType` 时按 Content-Type 解：含 `json` 的解析（解析失败给原文：错误页常冒充 JSON），`text/*`、xml、javascript、urlencoded 给文本，其余给 `ArrayBuffer`
- 出错：连不上抛 `HttpError`，`code` 取 cause 链最底下的（`ECONNREFUSED`、`ENOTFOUND`，超时是 `ETIMEDOUT`；undici 本身只说 `fetch failed`）；超时连读 body 的时间也算；调用方自己的 `signal` 取消时抛它自己的 reason。错误信息里的地址只到路径，不带 query（可能有 key）
- **每个请求发出前同步触发 `http/fetch-init(url, init, config)`**（`ctx.emit`）：`config` 是合并好的设置，监听器可以改 `init`（加头、挂 undici 的 `dispatcher`）。监听器抛的错不接，让请求失败：代理建不起来时不能悄悄变成直连
- **普通 `fetch()` 不经过它**：Bot 自己的登录签名、rkey、闪传、QQ 图片、OneBot / Milky 上报都直接 `fetch`，代理怎么设都不影响它们

**`builtin:proxy`**（`src/plugin/internal/service/proxy/`）：

- 监听 `http/fetch-init` 和 `http/proxy`，不提供独立服务。两个事件共用地址选择和校验：先看请求自己点名的 `proxyAgent`（`''` 是直连），没点名用条目设置里的 `proxyAgent`；条目停用后所有请求直连。默认开，地址留空什么都不做。无效地址抛不含认证内容的错误，不回退直连
- **条目的地址跳过本机和内网**（`isLocal()`：`localhost`、`127/8`、`10/8`、`172.16/12`、`192.168/16`、`169.254/16`、`::1`），和系统代理的"本地地址不走代理"一样：本机的 Ollama 这类服务经远处的代理（比如路由器上的 OpenClash）反而连不上。请求点名的地址对本地也生效
- 每个地址一个 undici `ProxyAgent`（缓存起来，连代理的连接能复用；Koishi 是每个请求新建一个），条目停用或改设置时 `close()`。undici 7 的 `ProxyAgent` 管 http、https 和 socks5（`socks5://`，Node 会打一条 SOCKS5 实验性的警告），地址里的账号密码自动变成 `Proxy-Authorization`；它传给 Node 自带 `fetch` 的 `dispatcher`（npm 的 undici 7.30 配 Node 24 内置的 7.18 实测能用）
- `undici` 在 `vite.config.ts` 的 external 里：它的 HTTP 解析器是内嵌的 WASM，照原样拷进 `dist/node_modules` 而不是打进 `llbot.js`
- 地址检查（`settings.ts` 的 `check`）：只认 http / https / socks5；没写 `http://` 的 `127.0.0.1:7890` 提示要加前缀
- 配置弹框里的测试（`POST /api/proxy/test { url, proxyAgent }`）用表单里填的地址，存没存都行（owner 2026-11-02：改了地址先测再保存）：接口自己建这个地址的 `ProxyAgent`，经全局 `fetch` 发出去，不走 `ctx.http` 和条目的监听，所以条目停用时也能测（它是条目的 standby 部分 `ProxyTestRoutes`），测本机地址也经代理；地址格式不对回 400（`proxyUrlProblem()` 的说法），留空就是直连；15 秒超时，回状态码、耗时和打了码的代理地址

**谁在用**：AI 服务（每个 AI 的「走代理」开关，关掉就是 `proxyAgent: ''`，见 [ai-plugins.md](ai-plugins.md)）、aiimgdetector 下载图片（点名直连：QQ 的图片服务器在国内）、插件市场（npm 源的请求经 `ctx.http.fetch`，`Registry` 构造的第三个参数；单测里不传就是全局 `fetch`）。

整个进程都走代理：Node 的 `fetch` 默认不理 `HTTPS_PROXY`，实测（Node v24.13.0，2026-11-01）再加 `NODE_USE_ENV_PROXY=1` 才走，而且会把 Bot 自己的连接一起带走，一般别这么用。

测试：

- `test/unit/universal/http.test.ts`：按类型解码、编码请求体、`baseURL` / `params` / 头的合并、`HttpError`、超时和调用方取消、`file()`、`http/fetch-init` 收到的设置、普通 `fetch()` 不触发；`proxy()` 的同步解析、配置合并，以及不发请求、不调用 fetch 钩子
- `test/unit/plugin/proxy.test.ts`：本地的 CONNECT 代理（`test/unit/examples/fakeAi.ts` 的 `startConnectProxy()`）和一个小 SOCKS5 服务都把隧道接到 127.0.0.1，测试用 `far.invalid` 这种只有经代理才到得了的名字（直连会 `ENOTFOUND`，本地地址又被跳过）。覆盖账号密码、点名直连、本地地址跳过、点名的地址、坏地址让请求失败、socks5、停用、测试路由，以及原生客户端代理解析与这些规则一致
- `test/unit/examples/aiGateway.test.ts` 里有 AI 服务经代理的一条

## 插件前端（WebUI 扩展）

| 位置 | 作用 |
|---|---|
| `packages/plugin-sdk/src/webui.ts` | 前端约定，只有类型，即 `@luckylillia/plugin-sdk/webui` |
| `packages/plugin-sdk/src/server.ts` | `ctx.webuiServer` 的约定和 Context 增强；host 的 `WebuiServer` implements 它，自己不再声明 |
| `src/plugin/internal/service/webui/FE/plugin-host/` | 宿主：插件列表 store、注册表、加载器、插件上下文、错误边界、视图组件 |
| FE `vite.config.ts` 的 `pluginSharedShims()` 和 `index.html` 的 import map | 共享依赖 |

- **共享 React**：插件模块里的 `import 'react'` 是裸说明符，浏览器按 `index.html` 里的 import map 解析到 `/plugin-shared/*.js`。这些 shim 由 `pluginSharedShims()` 生成（构建时 emit，dev 下走 middleware），内容是从 `globalThis.__LLBOT_WEBUI__.modules` 取 WebUI 自己那份模块再逐个命名导出；导出名在构建时用 `Object.keys(require('react'))` 读出，不手写。`main.tsx` 渲染前调 `installSharedModules()` 填这个全局。WebUI 自己的代码在构建时已经解析掉裸 import，不受 import map 影响。这和后端"进程里只能有一份 cordis"是同一个不变式
- **模块 URL**：`PluginStatus.webui` 是 `/plugin-webui/<key>/<version>/<入口文件名>`。key 是包名把 `/` 换成 `+`（npm 包名最多一个斜杠，且不允许 `+`）；version 在 `reloadPackage()` 和扫描到包变化时加一。ES 模块按 URL 缓存，URL 变了浏览器才会重新导入
- **加载**：`syncClients()` 随插件列表变化自动导入启用中的第三方插件模块（`hasExternalClient()` 判断是否有独立模块，owner 2026-11-08）；版本变了先导入新的、成功后再撤掉旧的注册；包不在了或不再声明界面模块就卸载。停用的插件只在打开配置弹窗时由 `ensureClient()` 按需导入，以便使用它的配置编辑器或设置页。导入失败记在 `useClientErrors` 里。模块的 `apply()` 抛错时，它抛错前注册的页面、插槽贡献、声明全部撤掉（和后端插件 apply 失败一样全有或全无），错误同样记在那里；`ctx.events()` 打开、组件没关的流在模块卸载时一起关掉
- **可见性**：页面跟着插件启用（见下面的"页面"）；插槽贡献只显示"有条目处于 active"的插件的（`activeOwners()`），再去掉用户隐藏的：放在别人界面里的东西，插件没运行时不该占位置；配置编辑器和字段控件只要模块加载了就能用
- **约定的来历**：owner 2026-10-29 定的，参考 DeepSeek Harness 的插槽模型：插槽由那块界面的主人声明（点路径命名、`list` / `single` 两种基数）、外框归主人画、只有 `single` 插槽能顶替、插件只碰声明过的位置、用户能隐藏 / 排序。对插件作者的说明在 [plugin-authoring.md](plugin-authoring.md)"插槽"
- **插槽**：注册表里的 `declaration` 条目。外壳的五个（`plugins.toolbar`、`plugins.views`、`plugins.catalog`、`plugins.install`、`plugins.card.actions`，都是 list；原来还有放全局提示的 `shell.notices`，2026-11-02 去掉了，见下面"顶部状态提示"；设置弹框里的 `settings.sections` 2026-11-03 去掉了，插件的设置都在它卡片的齿轮里，WebUI 自身设置已移到 `#webui` 页面）在 `registry.ts` 模块加载时就注册，owner 是 `builtin:webui`；插件的（Dashboard 的 `dashboard.header` / `dashboard.cards`、WebQQ 的三个）由 `ctx.declareSlot()` 注册，同名第二次声明抛错。贡献（`kind: 'slot'`）带 `id` / `label` / `order` / `priority`，其余字段放进 `options` 给外框用；`rejection()` 挡掉缺 id、缺组件和同一插件同一插槽里重复的 id，`ctx.slot()` 的旧签名（第二个参数是组件）直接抛错。`slotContents()` 决定显示什么：没人声明的插槽什么都不显示；list 按 `ui.order[key] ?? order` 排（同值按 owner、id）；single 按 `priority` 取第一个插件在运行、没被隐藏的，一个都没有时 `SlotOutlet` 渲染它的 children（壳自己的内容）。贡献的 key 是 `<owner>|<slot>|<id>`（`contributionKey()`），页面是 `<owner>|page|<tab>`（`pageContributionKey()`）
- **外框**：`SlotOutlet` 的 `wrap` 由插槽的主人画：Dashboard 卡片（`tool/dashboard/client/DashboardPage.tsx` 的 `SlotCard`，flex-wrap，`size` 对应 `basis-72 grow` / `basis-[37rem] grow-[2]` / `basis-full`：一行剩下的宽度按比例分给这一行的卡片，纯协议模式下 QQ 资源卡返回 null，NTQQ 账号卡就自己占满一行，用 grid 会在右边留一个空洞）；WebQQ 的按钮不包外框。外框是 `.slot-frame`、组件在 `.slot-body` 里，`index.css` 的 `.slot-frame:has(> .slot-body:empty) { display: none }` 让组件返回 null 时外框一起消失。这条规则必须在 `@layer utilities` 里：放在 components 层会输给 `.flex` 这类工具类，层的先后压过特异性
- **用户偏好**：实例 `plugins.json` 的 `ui: { hidden, order }`（`store.ts` 的 `normalizeUi()` 丢掉格式不对的），`PluginService.uiPrefs()` / `updateUiPrefs(patch)`。patch 是增量的 `{ hide, show, order }`（`order` 里的 null 删掉那个位置），几个标签页同时改不会互相覆盖。改完发 `plugins/ui` 事件，SSE 以 `{ type: 'ui', data }` 推给前端，存在 `pluginList.ts` 那个 store 的 `prefs` 里（第一次和插件列表一起拉，免得隐藏的东西闪一下）。隐藏和排序不检查 key，插件卸掉后留下的旧 key 无害。旧版 `ui.approved` 在读取时忽略，下次保存时移除。`hidden` / `order` 的 key 是贡献的（`<owner>|<slot>|<id>`）或页面的（`<owner>|page|<tab>`），`isPageKey()` 靠中间那段分辨，所以没有插槽能叫 `page`（`rejection()` 挡掉）
- **出错上报**：`PluginBoundary` 带 `failure: { key, where }` 时把渲染错误记进 `plugin-host/failures.ts`（按 key），点"重试"时清掉，插件模块重新运行（`run()`）时清掉它的全部；挂载成功不清，因为每条消息都渲染一次的插槽（chain 的环节）会让它一会儿报一会儿清。插件页"界面"的顶部、对应的行和插件卡片读它。插槽里的贡献用 `inline` 的错误样式（一行字加"重试"，不另套卡片），页面和配置编辑器用卡片
- **插件界面的管理**：侧边栏页面排序和隐藏在 WebUI 设置页。状态面板的卡片管理在 **状态面板插件卡片齿轮 → 配置弹框**（owner 2026-11-05）：拖动或上下箭头排序、开关显示、恢复默认，点保存才生效；没有另建设置页。由插槽声明的 configurable: true 启用（只认 list、只在声明者的配置弹框里显示），目前是 dashboard.cards；宿主 SlotLayoutSettings.tsx 负责编辑草稿，slotLayout.ts 计算仅该插槽的 ui.hidden / ui.order 增量，通过 /api/plugins/ui 保存，立即更新、不重启插件。对于 Dashboard 这样 builtin 且 hasConfig 为 false 的插件，弹框不请求 /api/plugins/:id/schema，也不提交普通配置；第三方插件不受此条件影响。隐藏项仍列出；提供者停用则不列出，声明者自己的卡片仍可设置；恢复默认清理此插槽所有旧排序和隐藏，包括暂时不存在的卡片，不动侧边栏和其他插槽。未开启 configurable 的插槽没有逐项管理入口，旧偏好仍生效；Dashboard 全部卡片隐藏时显示「没有可显示的卡片」。
- **内置插件的前端**见下一节。侧边栏一个写死的条目都没有，全是插件页面，按位置排（`pagePosition()`：用户排过的是 `ui.order` 里存的，没排过的是插件给的 `order`，在同一根轴上；同位置按 owner、标题）。插件给的位置：Dashboard 0，NTQQ 协议 5，OneBot 11 / Satori / Milky / NTQQ掉线邮件通知 / QQ 官方机器人 10 ~ 14，日志 20，插件 40，WebQQ 50，第三方默认 100，关于 1000。任何插件页面都能 `#<tab>?fullscreen` 单独打开（`ctx.pageHref(id, { fullscreen: true })`）：`App` 只渲染这一页，没有侧边栏和标题，页面用 `usePageView().fullscreen` 知道自己是这样打开的
- **侧边栏的顺序和隐藏**（owner 2026-11-03）：WebUI 设置页里「侧边栏」只是一行（显示几个页面、隐藏了几个）和「调整」按钮，点开是单独的弹框（`components/config/SidebarDialog.tsx`；原来整张页面列表直接摊在设置弹框里，owner 嫌难看）。插件页「页面设置」卡片的齿轮也打开同一设置页。列表是 `visiblePages(..., 'arrange')`：启用的插件的页面和核心页面，隐藏的也在（变淡）；停用的插件的页面不在，启用后回到原来的位置。每行能拖着换位置（owner 2026-11-03 要的；没用拖拽库，pointer 事件加 pointer capture 自己写）：鼠标整行都能拖，触屏只认左边的把手（别处一按就拖，手指就没法滚列表了，把手 `touch-action: none`）；被拖的那行跟着指针走，别的行让开，松手才改草稿，落点按指针算（被拖的行画在列表以内，它的中线最多和两头那行的中线齐平，按它算永远到不了第一个和最后一个）；拖到一半按 Esc 放回去，弹框不关；拖到滚动区上下边上会自动滚，速度按时间算、不按帧（有的机器关了动画效果，帧给得很少）。上下箭头留着给键盘用，开关隐藏，插件页是「始终显示」（`locked`）。改的是草稿，「保存」时一次发出（`sidebarPatch()`），没改时「保存」是灰的；「恢复默认」清掉所有页面的位置和隐藏，停用的插件的页面也清，插槽贡献的不碰；外面点不关，Esc 只关它自己（在 window 上 capture）。排在最上面、没隐藏的就是默认页。存的位置尽量少写（`arrangePages()`）：已经按顺序的最长一段不动（同位置的两页只在相邻时算按顺序，中间插不进别的位置），其余插进前后邻居之间，两头往外 10；落回插件自己 `order` 的删掉 key。不每次重新编号 0、10、20：停用的插件的页面和以后装的插件的页面要按插件给的 `order` 落在大致的地方，全部重编会把它们甩到一头。同一个缝里插太多次、精度不够时才整体重编。第三方插件的页面都默认 100，严格递增的老写法会让打开弹框不改也能保存，还把所有页面重编一遍
- **页面**（owner 2026-10-30）：插件启用了，它的页面就在侧边栏里，不管它在等依赖、出错还是正在启动；没运行的原因由页面自己说。`visiblePages()` 分两种用途：侧边栏（`'sidebar'`）列启用中插件的页面，插件列表还没加载时当作启用；能不能打开（`'open'`，`App` 渲染 tab 用）不看状态，停用的插件不占侧边栏，但卡片上的"前往设置"还能进去先配好再启用。`PluginPage` 按插件状态画：**设置页**（`page({ settings: true })`）照常渲染，上方一行提示（停用 / 出错 / 文件缺失、版本不兼容 / 在等别的插件）；**功能页**要插件在运行，没运行时整页换成原因卡片（`PluginNotRunning`），`PageOptions.header` 也不画。"在等别的插件"按 `meta.ts` 的 `waitingFor()` 说：缺的服务由哪个条目提供（manifest 的 `implements`），停用的排前面（"需要先启用「NTQQ 协议」"，按钮去插件页），否则用它给服务起的名字（"要等 NTQQ 账号登录后才会运行"，按钮去它的设置页）；只缺 bot 自己随后会起来的服务（登录后一两秒内的 `app`、`store` 等）时说不出提供者，设置页不提示，功能页显示"正在启动"和转圈，免得一闪而过。原来功能页要插件 active 才进侧边栏，WebQQ 在 NTQQ 没登录时整个入口都不见
- **文件路由**：`PluginRoutes` 用 `webuiServer.route('/plugin-webui', ..., { public: true })` 挂在 `/api` 之外，因为 `import()` 发不了自定义请求头；但它会带同源 cookie，所以 `servePluginAsset()` 校验 `webui_token_<端口>` cookie（存的就是密码哈希，和 `X-Webui-Token` 同值；名字带端口是因为 cookie 不分端口而同机各实例密码不同，端口取 Host 头的，和前端 `tokenCookieName()` 一致），走 API 同一个 `checkToken()`：原来它自己比对，错了不计数、锁定期间照样放行，等于一个不限次数的猜密码入口。只允许 GET / HEAD，`webuiAsset()` 只放行入口所在目录及其子目录。dev 下 Vite 也代理了 `/plugin-webui`
- **路由表的 public 选项**：`route(prefix, handler, { public: true })` 存进另一张表，由一个注册在 `/api/*` 分发之后、静态文件之前的 `*` 中间件分发。public 路由不能在 `/api` 下，非 public 路由必须在 `/api` 下（以前挂到别处会静默不生效）
- **插件列表**是一个共享 store（`plugin-host/pluginList.ts`），只由 `usePluginHost()` 订阅一条 SSE；插件页、侧边栏、设置页提示都读它，不再各自拉取。SSE 断了浏览器会自己重连（bot 重启也是），但中间的变化不重放：`openPluginStream()` 在每次 `connected`（包括首次连接）上重新拉列表和偏好，补齐首次 HTTP 快照与 SSE 建立之间的空档。请求期间收到的新状态覆盖旧快照；并发请求只采用最新一份，取消订阅后忽略旧响应，列表中已删除的插件不会被旧状态恢复。偏好也有独立的请求 / 事件顺序保护。否则 NTQQ 已登录、后端 WebQQ 已运行时，外层 `PluginPage` 仍可能卡在等待登录，内部登录重试根本无法挂载。
- **字段控件**：`SchemaField` 先查 `useFieldRenderer(role)`；表单自己处理的 role（`BUILTIN_ROLES`）不让插件覆盖。`role('host')` 是表单自带的监听地址选择（`HostSelector`：本机地址下拉或「自定义」手填，下拉是共用的 `Select`，列表挂在 body 上，弹框里不会被裁掉；docker 下固定监听全部），三个适配器的 host 字段和 WebUI 的监听地址都用它。字段标题只写 `description()`，键名（`registry` 这种）只在鼠标悬停时出现（owner 2026-11-03：说明旁边一串英文看不懂）；没写说明的字段才拿键名当标题。secret 字段收到的是掩码时（`********`，列表里是 `********#<token>`），聚焦会全选（输入即替换），手动删空后失焦恢复掩码，旁边有「清空」：表单记下路径，保存时作为 `clear` 发出去，存的值才真的删掉（单发空串或掩码都是"保留"；列表里点「清空」发出的空串本身就是清空）。嵌套对象自己是带标题的框，外面不再多一行同样的标签
- **SDK 的运行时**是 `plugin-host/sdk.tsx`：`usePluginContext` / `usePluginStatus` / `usePluginConfig` / `SchemaForm` / `SchemaSettings` / `HostInput` / `PathInput` / `DurationInput` / `SelectInput` / `usePlugins` / `useBots` / `usePageView` / `useSidebar` / `StatusNotice` / `Slot` / `useSlotMatches` / `Icon`（`Slot` 是 `views.tsx` 的 `SlotOutlet` 套一层，`wrap` 收到的贡献换成 `{ id, plugin, options }`）；`ctx.fetch` / `authUrl` / `pageHref` 在 `plugin-host/context.tsx`（`ctx.fetch` 就是外壳 `utils/api.ts` 的 `authorizedFetch`，`apiFetch` 也是在它上面加的 JSON 处理）。侧边栏收起状态和当前 tab 在 `stores/layoutStore.ts`，`App` 写、SDK 读。第三方模块经 import map 的 shim 拿到它（shim 的导出名列在 `plugin-host/sdkExports.ts`，`test/webui/plugins/sdk.test.ts` 核对它、`sdk.tsx` 和 SDK 里 `declare` 的值三者一致），内置插件的 `client/` 经 FE `vite.config.ts` 的 alias 直接拿到同一个模块
- `PluginBoundary` 给插件组件提供 `usePluginContext()` 的上下文（按贡献的 owner，所以别的插件声明的插槽里，贡献拿到的是它自己的 ctx）、套 Suspense，并兜住渲染错误；页面按 tab id 各自一个边界，一页出错不会带到同一插件的下一页

### 外壳和核心页面

owner 2026-10-29：WebUI 也是插件。外壳（`src/plugin/internal/service/webui/FE` 的 `App`、侧边栏、路由、注册表、登录弹框、主题状态和全局提示）不是插件，也不可能是：加载插件的东西不能自己是插件。其余都按插件注册：

- **核心页面**：插件页、页面设置、关于属于 `builtin:webui`（插件标题、设置页标题和侧边栏入口统一显示「页面设置」，owner 2026-11-05），代码在 `src/plugin/internal/service/webui/FE/core/`。它们要读注册表、界面偏好、bot 设置这些外壳内部的东西，开放进公开 SDK 就等于谁都能做，所以不走 ctx，而是 `registerCorePages()`（`main.tsx` 在 `startBuiltinClients()` 之前调）直接写进注册表。插件页带 `locked`：不看插件状态总在侧边栏里、用户也隐藏不了，管住插件靠它；WebUI 设置页（`core/WebuiPage.tsx`，`#webui`，order 900，`settings: true`）和关于页能隐藏。WebUI 设置页汇总主题、侧边栏偏好、访问设置和退出入口；隐藏后仍能从「页面设置」插件卡片打开。
- **bot 设置在用到它的地方改**（owner 2026-11-03）：原来的"其他配置"页（`#other`）删了，上面的 bot 设置（还存在实例的 `settings.json`，存的地方没变）各自挪到用它的地方：WebUI 的监听地址、端口和访问密码在侧边栏「页面设置」页（`core/WebuiPage.tsx`），插件卡片的齿轮也跳到这里，复用 `components/config/WebuiSettings.tsx`（只提交没被启动参数 / 环境变量锁住的，`webuiPatch.ts`；下面原来一行"保存在实例「…」的 settings.json……用 --instance 另起一个实例"太技术，2026-11-03 删了）。改密码的框（`ChangePasswordDialog.tsx`）和登录框（`TokenDialog.tsx`）都 portal 到 body：弹框的 glass 带 backdrop-filter，里面的 `fixed` 会被框在弹框里；登录框 z-index 10050，压在所有弹框上面（登录过期时不管开着什么都要能输密码），下拉列表 10100、toast 99999 在它上面。"写入日志文件"（`log`）在日志页顶上（`tool/logs/client/LogFileSwitch.tsx`），日志页注册成设置页，日志卡片的齿轮「前往设置」到这里；消息缓存（`msgCacheExpire`，NT 的 `Store` 用）在 NTQQ 页标题栏右上的「更多设置」弹框里（按钮原来叫「设置」，owner 2026-11-03：看着像整个协议的设置，其实只有消息缓存）（独立 NTQQ 工程的 `src/client/ProtocolSettings.tsx`，用 SDK 的 `DurationInput` 按天、小时、分钟改，跟原来的「其他配置」页一样，全 0 是不缓存；页面本身只管登录，以后 NTQQ 协议别的少改的设置也放进这个弹框）；音乐卡片签名地址（`musicCardSignUrl`，只有 OneBot 11 的 `music` 段用）在 OneBot 11 页标题栏右侧的「高级设置」弹框里（独立 OneBot 工程的 `src/client/MusicCardSign.tsx`），打开时读取当前地址，取消或 Esc 放弃草稿，保存后关闭弹框。这些插件界面经 `ctx.api('/api/config')` 读写，改了当场生效（`llob/config-updated`），不重启协议、不断 OneBot 的连接。没把它们搬进各插件的条目配置：那样要迁移旧配置、改 OneBot 的 `get_config` / `set_config`，而且条目配置一改适配器就重启。改回 WebUI 端口靠核心设置页，它不随插件状态变；原来的 `SettingsDialog.tsx` / `WebuiDialog.tsx` 已删除
- **管理面扩展**：`plugins.toolbar` 在统一筛选栏追加工具按钮；`plugins.views` 通过工具按钮打开扩展视图，返回后回到统一列表，组件仍接收 `PluginsViewProps` 的 `configAction(id)` 和 `showDetails(source)`，配置与详情弹框由宿主处理。`plugins.catalog` 的组件不绘制 UI，通过 `PluginCatalogProps.onChange()` 提供目录快照和包操作，`loadCatalog` 控制是否读取完整目录；宿主 `catalog.tsx` 只使用当前贡献的快照，停用贡献后删除其数据和动作。`plugins.install` 在宿主本地安装弹框中提供上传控件，成功后调用 `onInstalled()`。`plugins.card.actions` 仅给已安装条目卡片添加按钮。五个插槽都是 list，筛选、卡片、开关和配置入口始终由宿主绘制；市场不再注册独立 `plugins.views` 视图或额外的更新按钮。
- **状态面板和日志是普通内置插件**：能停用。`builtin:dashboard` 的插件标题、页面标题、侧边栏入口和插槽说明统一使用「状态面板」（owner 2026-11-05），内部 ID 和 `dashboard.*` 插槽名不变。停用状态面板后侧边栏第一个页面成了默认页
- **启动等插件列表**：`App` 在登录检查和第一次插件列表都回来之后才画主界面（之前是一个转圈）。侧边栏现在全是插件页面，先画再等列表的话条目会一个个冒出来、往下挤
- **默认页**：地址栏没有 tab 时，打开侧边栏排第一的页面（用户排过就是排在最上面、没隐藏的）（`activeTab` 未设置时取 `pluginPages[0]`），列表回来之前不写地址栏
- **页面标题区**：`App` 在每页上方留着桌面端的标题区（`mb-8 hidden md:block`），页面可以用 `PageOptions.header` 往里放东西（`PluginPageHeader`，它自己的错误边界）；Dashboard 的 `header` 就是 `dashboard.header` 插槽，默认内容是「状态面板 / 欢迎使用 Lucky Lillia Bot」。这样所有页面的上方间距和以前一样

### 主题与外壳扩展

`llbot.category: 'theme'` 在 SDK、清单解析、插件列表和市场目录中都是正式分类，市场登记表与 schema 使用同一个值。

`plugin-host/themes.ts` 提供前端主题注册表、令牌覆盖层、受管样式和 `useTheme()`。`ctx.theme.register()` 的定义包含 `id/title/light/dark/css?`，变体包含 `tokens/background?`；完整键是 `<owner>|<id>`。`themeStore` 在原 `llbot-theme` 记录中同时保存 `mode` 和 `selected`，兼容旧数据。`main.tsx` 显式安装样式运行时，监听注册表、主题偏好和插件状态；只有至少一个 active 且未停用实例的 owner 生效，模块保留供设置页使用也不会保留其外观效果。不可用时回退默认主题，偏好不丢，重新启用自动恢复。注册与覆盖层由 context 的 disposer 统一回收，旧 disposer 按对象身份移除，不能删除后注册的同 ID 覆盖。

主题令牌同时覆盖根节点和 `.glass-on-light` / `.glass-on-dark`，所以 portal 弹框和自适应材质不会只改一半。选中主题的 CSS 排在受管组件样式之后；`resetGlassAdaptive()` 同时刷新玻璃缓存的放大带宽和饱和度。`AnimatedBackground` 有 `background` 时改用静态 DOM 背景并撤销默认 canvas 的采样源，没有时恢复默认动画。自定义背景的玻璃亮暗依当前模式，暂不采样图片亮度。

`ctx.style(id, css)` 随 owner 运行状态安装和撤销，`ctx.asset(path)` 从外部入口 URL 解析目录内资源；`ctx.theme.overrideTokens(id, { light, dark })` 按注册顺序叠加全局覆盖层。协议与 SDK 使用说明见作者指南「主题与受管样式」。

独立插件构建的 Tailwind utilities 使用 `ctx.style('utilities', css, { scope: 'plugin', when: 'loaded' })`，以 CSS `@scope` 限定到 `PluginBoundary` 的 `data-plugin-ui` 根；共享 `react-dom.createPortal` 用 `PluginSurface` 保留同一上下文和 DOM 作用域。这样多个插件样式表中后加载的 `.flex` / `.grid-cols-1` 不会覆盖宿主的 `md:hidden` / `lg:grid-cols-2`。作用域内 `:root,:host` 转成 `:scope`，工具类默认变量留在组件内部。仅 scoped 样式可随模块保留供停用设置页使用；旧宿主不支持时构建入口仍有 link 样式回退。

外壳新增 `sidebar.header/footer`、`page.header.actions`、`settings.appearance/sections` 列表插槽，和 `page.content` 的 `hoc` 插槽。`hoc` 按 order 从外向内包裹，向组件传 `children`，`match` 留空通配、填写则只匹配该页面键；错误边界和 Suspense 透传内部内容。核心 `locked` 页面绕过包装，插件管理入口可用。插件配置仍由各自卡片/页面负责，settings 插槽用于外观和 WebUI 扩展自己的控制。

验证入口：`test/webui/plugins/themes.test.ts`（等待/停用/失败回退、多实例恢复、覆盖层、DOM 样式清理、资源路径、模块撤销）、`registry.test.ts`（hoc 匹配与顺序）、`test/fixtures/plugins/theme/`（真实浏览器联调）。

`ThemeSettings.tsx` 将 `settings.appearance` 中当前生效主题 owner 的贡献收进原生 `details`，标题为「主题设置」，不提供 `open` 初始值，并用主题键重建外框以在切换主题时重新折叠。没有贡献时不挂载外框；已注册但组件返回 `null` 时，`index.css` 忽略空的 `PluginSurface` 根并隐藏整个外框。其他 owner 的外观贡献不参与当前主题设置，主题无专属选项时不显示空入口。

### keyed 和 chain 插槽

- **keyed**：贡献带 `match`（键），`Slot` 带 `match` 问要哪个键；`slotContents()` 在 `match` 相同、插件在运行、没被隐藏的里按 `priority` 取第一个，没有就画 `Slot` 的 children。`useSlotMatches(name)`（`slotMatches()`）给出当前有贡献的键，WebQQ 用它让"只含它自己不会画的元素"的消息也有气泡（`hasValidContent` 之外再看这个）
- **chain**：`SlotOutlet` 用 `reduceRight` 从里往外包，最里面是 children，每个环节拿到 `next`（后面画好的），排在前面的在最外层；用户的排序照样生效。环节的边界带 `passThrough={next}`：加载中和抛错后都直接显示 `next`，一个坏环节不会把整条消息弄没，错误照样上报
- **SDK 类型**：chain 插槽在 `SlotMap` 的 props 里写 `next`，`SlotProps` 把它 `Omit` 掉，声明方渲染 `Slot` 时不用传
- **WebQQ 的两个**：`webqq.message.element` 包在每个消息元素外（`MessageElementRenderer` 先问插槽，键是 `String(elementType)`，原来的画法改名 `BuiltinElement` 当 children）；`webqq.message.bubble` 包在每条消息的气泡外（`MessageBubble.tsx`）。插件拿到的消息是 `utils/slotMessage.ts` 转的 `WebQQMessage`（按消息对象缓存，memo 不失效），元素是 NT 的原样（`WebQQElement`）。插件可往前一个添加 markdown（14）的原文渲染，往后一个添加"折叠长消息"

### 路径选择

owner 2026-11-02：要填 Bot 所在机器上的路径时（第一个用的是 NTQQ 协议页的 QQ 可执行文件），不用浏览器自带的文件对话框：WebUI 常常是在别的机器上远程打开的，那个对话框选到的是浏览器那台机器的文件。

- **控件**：SDK 的 `PathInput`（`components/common/PathPicker.tsx` 的 `PathPicker`），输入框加「浏览」，有值时多一个清空。弹框（`zIndex` 10000，盖得住设置弹框）：上一级、主目录、盘符（Windows 多盘时）、可编辑的路径栏（回车跳过去）、本目录筛选；点文件夹进去，点文件选中，双击文件直接选用；`select: 'directory'` 时只列文件夹，按钮选当前文件夹。默认不显示 `.` 和 `$` 开头的名字（勾「显示隐藏项」显示）；给了 `accept` 时只列这些扩展名的文件（勾「显示所有文件」显示全部）。打开时有值就到值所在目录并选中它，没有值就到 `start`，都没有到主目录
- **接口**：`GET /api/fs/list?path=` 是 `WebuiServer` 的内建路由（`BE/routes/files.ts` 的 `listDirectory()`），跟别的 `/api` 一样要登录 WebUI。给的是文件就列它所在的目录，路径不存在就往上找到还在的那一层，空着就是主目录；返回 `{ path, parent, entries: [{ name, path, dir }], truncated, roots?, home }`，文件夹在前、名字按自然顺序。符号链接和 Windows 的目录联接按指向的东西算，指不到或读不了的不列（`C:\Users\<用户>` 下的 `Application Data` 这类）；超过 2000 项只给前面的（`truncated`）。`roots` 只在 `?roots=1` 时给，弹框打开时问一次：Windows 上用 PowerShell 的 `[System.IO.Directory]::GetLogicalDrives()` 列盘符，不去碰盘（在 Bot 进程里 stat 各个盘符会占住 libuv 仅有的几个文件线程，断开的网络盘要等到超时才放），别的系统是 `/`。只给名字，不读文件内容；能登录 WebUI 本来就能装插件，看目录不多给权限
- 还没有做成表单的 `role('path')`，插件自己的界面用 `PathInput`

### 控件约定

owner 2026-11-03：

- **手型指针**：Tailwind v4 的 preflight 不再给按钮 `cursor: pointer`（v3 给），浏览器也不给 select / checkbox 这些。`index.css` 的 base 层统一给可用的 `button`、`select`、checkbox / radio / range，以及直接包着 checkbox / radio 的 `label` 加上；写在全局，第三方插件的页面也吃得到，元素上的 `cursor-*` 工具类照样优先。`div` / `span` / `img` 这些挂了 `onClick` 的要自己写 `cursor-pointer`。查漏的办法：浏览器里遍历元素，从 `__reactProps$*` 看有没有 `onClick` / `onMouseDown`，再比 `getComputedStyle(el).cursor`（全屏遮罩、只 `stopPropagation` 的外框除外）
- **弹框点外面关不关**：插件的详情、配置弹框，以及插件自己的设置弹框（NTQQ「协议设置」、OneBot 11 的连接编辑）点遮罩不关，只能点关闭 / 取消，或者按 Esc（详情和协议设置支持）：容易误点，配置还会丢掉正在改的内容。确认框（信任）、选择框（路径）、看大图、WebQQ 的菜单和资料卡还是点外面就关
- **下拉不用 `<select>`**：它展开的列表是浏览器按系统样式画的。用 `components/common/Select.tsx` 的 `Select`（SDK 里叫 `SelectInput`，内置插件的 `client/` 也从 SDK 拿）。列表 portal 到 body、按按钮位置 fixed 定位，弹框里能滚动的内容区裁不掉它；`zIndex` 10100，盖得住各种弹框，toast（99999）还在它上面。页面滚动时列表跟着按钮走，按钮滚出屏幕才收起：滚动一来就关的话，触控板惯性滚动还没停、弹框把按钮滚进视野时，列表刚弹出就被关掉。焦点一直在按钮上（`aria-activedescendant`），Esc 收起时 `stopPropagation`，免得外面的弹框跟着关；空格在 keydown 里选中，keyup 要 `preventDefault`，不然 keyup 触发的 click 又把列表打开。按钮里叠着所有选项的隐形标签，宽度跟最长的选项一样，跟 `<select>` 一样不会随选中项变宽变窄

### 内置插件的界面

owner 2026-10-28：插件的界面由插件自己维护，或者只给 schema、由 WebUI 渲染；WebUI 里不再写某个插件专用的页面。原来 OneBot / Satori / Milky / 邮件的设置页是插件化之前的 WebUI 页面，插件化时只是改成经 `ctx.page()` 注册，代码留在 `components/config/`、直接用 WebUI 内部的 hook 和组件，后来的 NTQQ、官方机器人页照着写了，现在都搬走了：

- **位置**：内置插件的界面在它代码旁边的 `client/`，如 `src/plugin/internal/adapter/satori/client/`、`src/plugin/internal/protocol/qq-official/client/`。入口 `client/index.ts(x)` 默认导出 `apply(ctx)`，并导出所属内置条目的 `name`。NTQQ、OneBot 11、Milky、WebQQ 和 NTQQ掉线邮件通知的 `src/client/` 已位于各自独立仓库，由各自 `llbot.webui` 发布和加载，不进入宿主 `builtins.tsx` 的 glob。
- **只用公开的 SDK**：`client/` 里只能 import `@luckylillia/plugin-sdk/webui`、`react` / `react-dom`、`lucide-react`、自己的文件和后端的类型（`common/types`），不能碰 `src/plugin/internal/service/webui/` 下的任何东西。`test/unit/plugin-clients/builtinClients.test.ts` 检查这条，也检查目录名、`builtin.ts` 定义的条目名和 `client/` 导出的 `name` 三者对得上。SDK 不够用就给 SDK 加（`usePluginConfig`、`SchemaSettings` 等就是这么来的），第三方插件同样能用
- **怎么选**：配置就是普通表单的，只注册一个 `SchemaSettings` 设置页（Satori、Milky），要多点东西就往里塞：标题旁的链接、分组（`sections`，可选 `description` 在分组标题旁显示弱化说明，折叠时也可见）、表单下面的内容（邮件的测试按钮）、某个复杂字段用 `ctx.field()` 注册的控件（官方机器人的订阅事件，`role('qq-official-intents')`）。配置界面跟 schema 对不上的才自己画（OneBot 的连接卡片、NTQQ 的登录流程），数据照样走 `usePluginConfig()`
- **加载**：`plugin-host/builtins.tsx` 发现各内置插件的 `client/index.ts(x)`，将随 Bot 的默认界面一起打包；`startBuiltinClients()` 在首次渲染前注册，开发时由 `refreshBuiltinClients()` 在 Vite HMR 的内置模块新增、修改、删除后同步页面与插槽注册；已激活的 npm 客户端仍优先，不被默认模块更新覆盖。启动后如果宿主选用了已更新的内置 npm 包，`syncClients()` 用该版本的 `/plugin-webui` 资源替换默认界面，停用的内置条目也加载对应的设置界面；加载或 apply 失败时保留或恢复随包界面并展示错误。后端和前端资源来自同一份启动时选定的快照，下载后尚未重启的版本不会提前替换页面。独立客户端产物包含自己的 Tailwind utilities CSS，由入口在 apply/dispose 时加载和移除；宿主组件样式与主题仍由 WebUI 提供。
- **构建要点**：`client/` 在 FE 包外面，FE `vite.config.ts` 用 `resolve.dedupe` 让它们用 FE 的 React（仓库根没有装 react），`server.fs.allow` 放开仓库根；FE `tsconfig.json` 的 `include` 加了 `../../../*/*/client/**/*`，`paths` 把 `react` / `lucide-react` / `zustand` / `@tanstack/react-virtual` 指到 FE 的 node_modules（`client/` 用到的第三方包装在 FE 的 `package.json` 里，`dedupe` 也要列上）；根 `vitest.config.ts` 同样把 `zustand` alias 到 FE 的 node_modules，测试使用同一份 WebUI 状态库；WebQQ store 测试已迁入其独立仓库；根 `tsconfig.json` 排除 `src/**/client`（后端 tsc 没有 React 类型）；`index.css` 用 `@source '../../../*/*/client/**/*.{ts,tsx}'` 让 Tailwind 扫到这些文件。`@source` 写成目录 glob（`../../*/client`）不生效，要带文件扩展名，而且必须放在所有 `@import` 之后。后端不加载 `client/`，改它们只触发 Vite 的 HMR，不会让 `tsx watch` 重启 bot
- **WebQQ**（约 8000 行）按原来的相对目录搬进 `../LuckyLillia.Plugins/lucky-lillia-plugin-webqq/src/client/`（`components/WebQQ/`、`stores/`、`utils/`、`types/`），内部 import 不用改；原来伸向外壳的几处换成插件自己的：`client/context.ts`（`apply()` 时存下 ctx，给不在组件里的 API 函数和 store 用；`showToast`）、`components/common/`（自己的 `Portal`）、`utils/api.ts`（`apiFetch` 换成 `ctx.fetch()` 上的同样语义），带 token 的图片 / 音频 / 文件 / SSE 地址用 `ctx.authUrl()`。`WebQQEntry.tsx`（`React.lazy` 加载：WebQQ 聊天界面单独打包为插件的懒加载 chunk，第一次打开页面才下载。bot 更新后，开着的旧页面要的是旧构建的 chunk，已经没了，`React.lazy` 还会记住失败、"重试"没用：`main.tsx` 监听 `vite:preloadError` 刷新整页，一分钟最多一次，免得别的原因的失败死循环）先问自己的 `/api/webqq/self` 拿到账号，按账号恢复 store（原来是 `App` 做的），再按设置用 `useSidebar()` 收起侧边栏；全屏按钮 `window.open(ctx.pageHref('webqq', { fullscreen: true }))`，原来的 `#webqq-fullscreen` tab 和 `WebQQFullscreen` 删了。它的两项设置原来是浏览器本地的（`stores/settingsStore.ts`），2026-11-03 改成了它的插件配置，见上面内置条目表。它还声明了 `webqq.chat.actions`：`ChatWindow.tsx` 顶栏右边渲染 SDK 的 `Slot`，props 是当前的 `chat`（`chatType` / `peerId` / `name`），插件可往里添加"复制号码"按钮
- **外壳不再认得哪个插件**：主界面的账号原来只在页面加载时取（`/api/config` 的 `selfInfo`），所以登录后要刷新整页；现在侧边栏底部是一张账号卡片（`components/layout/AccountsCard.tsx`，owner 2026-11-02），按 `/api/bots` 列出所有协议端的账号：头像、昵称、号码，以及独立一行的协议名（NTQQ / QQ 官方机器人，未知平台沿用平台名），头像角上一个点表示状态（在线绿、连接中黄、离线灰），在线的排前面；超过 3 个时只显示前 2 个和「还有 N 个账号」，点开显示全部（卡片最高半屏，再多就在卡片里滚动）；没有账号时写「还没有登录的账号」，头像位置放 logo；账号卡不再放设置齿轮，设置从侧边栏「页面设置」进入；官方机器人每个 AppID 只注册一个 Bot，因此账号列表无需按平台去重，Dashboard 自带运行时间、LLBot 和系统资源卡片；官方机器人通过自己的 dashboard.cards 卡片显示身份、连接状态和收发统计（qq-official/client/DashboardCard.tsx，每 5 秒读本插件的 /api/qq-official/stats，详见 official-qq-bot.md）；NTQQ 账号的统计和 QQ 进程资源是 NTQQ 插件挂进 `dashboard.cards` 插槽的两张卡片（账号 `wide`、QQ 资源，共用 `client/stats.ts` 的一个轮询），WebQQ 自己拿账号，于是登录后不用刷新，原来的 `useQQAccount` / `useAccountReload` 删了，NTQQ 页登录成功只提示一句。关于页不再显示 QQ 版本号（在 NTQQ 卡片上）
- **顶部状态提示**（owner 2026-11-02 改）：哪个插件的事就在哪个插件的页面上说，不在每一页的顶上挂一排。在等别的插件、运行出错、文件缺失、`notice`（"还没有填写 AppID 和 AppSecret"）都由 `PluginPage` 画在它自己的页面上（设置页是上方一条提示，功能页整页换成原因卡片，见上面"页面"），插件卡片照样写；插件自己知道的状态由它画在自己的页面里，SDK 的 `StatusNotice` 跟 `PluginPage` 的提示是同一个样子（`views.tsx` 的 `PageNotice`）：官方机器人的连接状态在「QQ 官方机器人」标题右侧，由 `qq-official/client/ConnectionStatus.tsx` 显示绿点 +「已连接」或灰点 +「未连接」（owner 2026-11-05），不再另画顶部连接状态卡片；缺 AppID / AppSecret、插件运行失败等 `PluginPage` 提示保留；NTQQ 的账号没登录 / 已离线本来就是 NTQQ 页的内容，那条全局提示删了。原来外壳的 `components/layout/StatusNotices.tsx` 在每一页顶上汇总这些（谁在等谁、运行出错、缺设置，加上插件往 `shell.notices` 插槽放的行，用户嫌是全局的），现在它只说跟哪个插件都无关的：没有启用任何协议端（插件页"协议端"分类的插件，第三方的也算）、也没有在线的 bot，按钮去插件页，在插件页上不显示。`shell.notices` 插槽一并去掉，SDK 的 `SlotMap` 里也没有了。插件卡片的等待原因（`meta.ts` 的 `pendingReason()`）按提供者和标签说，原来写死的"等待 QQ 登录 / 需要先启用 NTQQ 协议"删了

**日志来源与级别**（owner 2026-11-05）：`main/log.ts` 的缓存和 SSE 记录保留原 logger 名 `source`，并用 Cordis `Message.fiber` 经 `PluginService.logSource()` 查出所属插件，快照 `{ id, name, title }` 到 `plugin`。WebUI 的正文前缀显示 `[插件标题]`，日志文件也带该前缀；搜索同时匹配插件标题、包名、logger 名和正文。插件自己的子服务、显式命名 logger、停用清理日志都按 fiber 归属；根 logger、`getLogger()` 和独立 standby 没有条目归属时沿用原模块名，不靠字符串猜插件。历史记录不依赖插件仍在运行。

日志页的「日志设置」默认折叠，展开后可设置 `logLevel`（Debug / Info / Warn / Error，默认 Info）和写入文件开关，各自只提交自己的 bot 设置。收起不更改配置，也不中断正在保存的请求。级别是后续日志的最低输出门槛，立即作用于 WebUI 缓存、控制台和文件；历史日志保留，顶部筛选（含 Debug）只影响本页显示。`--debug` 优先于 `LLBOT_LOG_LEVEL` 和配置文件，后两者支持四个级别；启动参数或环境变量锁定时下拉框只读并注明来源。QQ 官方机器人的正常收发摘要见 [official-qq-bot.md](official-qq-bot.md)，无需开启平台原始报文调试。

## 进程内只能有一份 cordis

外部插件 `import { Service } from 'cordis'` 如果拿到的是另一份 cordis，`Service.init` symbol、Context 原型链、事件总线全都对不上，而且不会有明确报错。三道防线：

1. **external**：`vite.config.ts` 的 `pluginShared` 把 `cordis` / `cosmokit` / `schemastery` / `@standard-schema/spec` / `@satorijs/element` / `@satorijs/protocol` 移出 bundle，和 `ws` 一样拷进 `dist/node_modules/`；SDK 的 `lib/` 也拷到 `dist/node_modules/@luckylillia/plugin-sdk/`。被打进 bundle 的 `@cordisjs/plugin-*` 里的 `import 'cordis'` 会解析到 external 那份
2. **resolve hook**：`DATA_DIR` 是相对 cwd 的，`data/plugins/xxx` 按目录向上解析未必走得到 `dist/node_modules/`。`resolve-hook.ts` 用 `module.registerHooks()`（Node ≥ 22.15，同步、同线程）把 `SHARED_SPECIFIERS` 不管从哪里 import 都短路到 host 用 `import.meta.resolve()` 算出的 URL
3. **加载后校验**：插件若是 `Service` 子类，沿构造器原型链找，碰到名叫 `Service` 却不是 host 那个类的，就判定插件把 cordis 打进了自己的产物（这种情况没有 import 语句，钩子拦不到），拒载

已实测：cwd 放在系统临时目录、插件周围没有任何 `node_modules` 时，从 `dist/llbot.js` 启动，插件拿到的 `Schema` 与 host 是同一个对象，`ctx instanceof Context` 成立。

## 热重载

Node ESM 没有公开的缓存失效 API（官方 `@cordisjs/plugin-hmr` 需要原生 addon `node-addon-require-builtin` 才能删 `loadCache`，我们不引）。做法是 query cache-busting：

- 每个包维护一个单调递增的 epoch，import 入口时带 `?v=<epoch>`。epoch 永不回退，否则重复的 `?v=` 会命中旧缓存
- 坑：query 只加在入口上，入口里 `import './util.js'` 解析出的子模块没有 query，仍是旧缓存。resolve hook 的第二个职责就是：父模块 URL 带 `v` 且在某个包根目录内、子模块也在同一个包内时，把同一个 `v` 抄过去。包根用 realpath（ESM 会解析符号链接，模块 URL 里是真实路径）
- 重载是"先验后拆"：新模块 import 成功才 dispose 旧 fiber 再挂新的；import 失败时旧实例继续跑，条目上挂 `error` 说明仍在跑旧版本
- 同一个包的所有启用条目一起换新代码
- 代价：每次重载泄漏一张旧模块图（ESM 缓存只增不减）。开发期无所谓，长期运行的实例频繁重载后应重启进程
- 没有 `registerHooks`（Node < 22.15）时 `reload()` 返回 `restart-required`，不做半吊子的重载

触发方式：WebUI 的重载按钮（`reload(id)`），或开启目录监听 —— `plugins.json` 里 `"hmr": true` 或启动参数 `--plugin-hmr`。监听用 `fs.watch(root, { recursive: true })` + 300ms 防抖，忽略 `node_modules` 和点开头的路径。**docker bind mount 下 inotify 经常收不到事件**（`ConfigService` 用 `fs.watchFile` 轮询也是这个原因），这时用 WebUI 按钮。

`--dev` 已被占用（连本地 manager + development 原生包），插件启动选择用 `--plugin`，其他插件相关参数用 `--plugin-*`。

## dev 下

- `tsx watch` 的 loader hook 是进程级的，插件 `main` 可以直接指向 `.ts`；已实测 `registerHooks` 与 tsx 的钩子可以共存，TS 插件的子模块也能热重载
- **tsx watch 会监听所有经它加载的文件，动态 import 的插件也算**：不排除的话，改一行插件代码会让 tsx 重启整个 bot（重新登录），抢在热重载前面。所以 `yarn dev` 带了 `--exclude "./data/**" --exclude "./examples/**" --exclude "../LuckyLillia.Plugins/**"`；用 `--plugin-dir` 指向别处时要自己再加一条 `--exclude`。注意 tsx watch 本来就忽略点开头的目录，在 `.tmp/` 里做这类实验会得到"不重启"的假结论
- 例子：`yarn dev --plugin-dir data/plugins --plugin-hmr`
- `@luckylillia/plugin-sdk` 在 dev 下通过 workspace 链接解析到 `packages/plugin-sdk/lib/`，需要先构建过一次（`yarn install` 的 postinstall 会跑 `build:sdk`）。host 对 SDK 只有 `import type`，类型检查走 tsconfig `paths` 直连源码，不依赖构建


**指令自定义别名**：内置「指令」页在每条指令下提供可增删的别名输入行，与前缀、权限一起保存到 `builtin:commands.config.aliases: { owner, command, aliases: string[] }[]`。后端按插件条目 id 和注册原名精确匹配，追加到插件声明的名字之后，忽略大小写去重；匹配、`list()` 和重名提示使用同一份生效名字，不另建 Command 实例。保存通过 `internal/update` 更新，指令和依赖它的插件不重启，参数、权限、冷却和生效范围沿用原指令。支持菜单同步的平台继续显示原名（QQ 官方机器人不自动同步）；停用或暂时未加载的插件配置保留。行为测试在 `test/unit/universal/commands.test.ts`，浏览器验证覆盖多个中文别名、保存/刷新、删除、修改前缀和重名提示。

## SDK 版本

- host 启动时读自己能解析到的 `@luckylillia/plugin-sdk/package.json` 的版本，与插件的 peer 范围用 `compare-versions` 的 `satisfies()` 比对。没声明范围的插件视为不 import SDK，总是兼容
- SDK 只 re-export 第三方运行时值（`Context` / `Fiber` / `Inject` / `Service` / `Schema` / `h`）和纯类型，自己的运行时代码只有 `internalOf()`。host 内部的能力（`SendElement` 等）一律通过 `ctx` 拿，不进 SDK，免得内部结构变成插件 ABI
- `@luckylillia/plugin-sdk/testing`：类型在 SDK 的 `src/testing.ts`，实现是 host 的 `src/universal/testing.ts`，由 `scripts/build-testing.mjs`（esbuild）连同 `BotsService`、`Session`、降级、`CommandService`、`HttpService` 打成 `lib/testing.js`；cordis、schemastery、`@satorijs/*`、`@cordisjs/plugin-timer` 留作 import（都是 SDK 的 peer），和插件用的是同一份。`npm run build:sdk`（`postinstall` 会跑）和 SDK 的 `build` / `prepack` 都是 tsc 加这一步；`test/unit/sdk/testing.test.ts` 在文件顶部 import 打好的包做冒烟，没构建就整个文件失败
- 发布的包里还有 `template/` 和 `bin/`（脚手架）
- SDK 的 tsconfig 用 `moduleResolution: Bundler`：cordis rc.11 的 `.d.ts` 里相对 import 不带扩展名，`NodeNext` 跟不过去，会静默丢掉 `Service` / `Inject` 等导出
- 发布：tag `sdk-v<version>` 触发 `.github/workflows/publish-sdk.yml`，先构建完整 SDK 并运行 `test/unit/sdk`，再通过 npm trusted publishing 发布（`--provenance`）；标签须与 SDK 的 `package.json.version` 一致，npm 上已有的版本不能重复发布。
- 首次发布：使用拥有 npm `luckylillia` 用户或组织发布权限的账号执行 `npm login`，验证包后发布 `@luckylillia/plugin-sdk`。包创建后在 npm 的 Trusted Publisher 设置中填写 GitHub owner `LuckyLilliaDev`、repository `LuckyLilliaBot`、workflow `publish-sdk.yml`，environment 留空；后续按标签交给 CI，无需 npm Token。包的 `repository.url` 必须对应当前 GitHub 仓库。
- 暂存发布：命令返回 `+ 包名@版本` 或 “being processed” 不代表正式版本已经公开。新包可能先出现 `0.0.0-stage` 和 “Temporary Holding Version”；使用 npm 11.15.0 或以上的 `npm stage list <包名>` / `npm stage view <stage-id>` 查询，核对产物后执行 `npm stage approve <stage-id>` 并完成 2FA，也可在 npm 账号设置的 Staged Packages 页面批准。不要重复提交同一版本。只有公共 registry 的目标版本、`latest` 和下载产物都验证通过，才算发布完成。首次 `1.0.0` 已于 2026-11-11 完成这些验证。

## 测试

- 统一插件列表：`test/webui/plugins/unifiedListing.test.ts` 覆盖本地条目不等待目录、内置包名映射、多实例保留、无条目的已装包、未安装目录去重、目录贡献撤销，以及安装状态/来源/分类/启用状态/更新/搜索的组合筛选。
- `test/unit/plugin/service.test.ts`：在 gitignore 的 `.tmp/` 下现场生成插件包，覆盖启停、配置校验、失败隔离、SDK 不兼容、缺依赖、自带 cordis、重载与重载失败、包被删除、多实例，以及内置条目（core 停不掉、standby 部分不随开关启停）。放在仓库内是为了让夹具插件能向上解析到仓库的 `node_modules`
- `test/unit/plugin/configWrite.test.ts`：只存差异、`describe` 的字段、rev / 409
- 生效范围、处理顺序、信任：`test/unit/plugin/scope.test.ts`（`normalizeScope` / `acceptsScope`），`service.test.ts` 的信任和"哪些插件、按什么顺序收到消息"（真的插件包 + `BotsService`），`test/unit/universal/bots.test.ts` 的 policy（过滤、排序、抛错隔离和记账）、`prompt`、`sendQueued`
- 指令：`test/unit/universal/commands.test.ts`（解析和类型、引号、选项、别名和最长匹配、前缀和 bare、没有内置的 help、权限、冷却、action 抛错、同名的指令按插件的范围选、随插件撤掉、菜单同步）
- SDK：`test/unit/sdk/internal.test.ts`（生成的 `internal.ts` 没过期），`testing.test.ts`（测试工具：指令、降级、prompt、数据目录，以及打好的包）
- 市场：`test/unit/plugin/market.test.ts`（见上文"插件市场"，含更新可用性、安装依赖规划、多实例配置/启用状态、并发更新、重载失败、更新中停用、HMR 去重及内置包待重启）、`sharedPackages.test.ts`（真实 Node 子进程间 RPC、内核锁随进程死亡释放、新实例启动准入、改名中途杀死协调者后的旧包恢复）、`marketCatalog.test.ts`（目录校验与缓存）、`marketRegistry.test.ts`（本地 HTTP 源的断连、截断、坏 JSON 和状态码）；重载时依赖的 `?v=` 在 `resolve-hook.test.ts`
- 扩展元素：`test/unit/universal/fallback.test.ts` 测默认降级、`bot/fallback`、和 `bot/before-send` 的先后；宿主 `test/unit/universal/crossPlatform.ts` 与 NTQQ 插件的 `test/universal/crossPlatform.ts` 列出跨平台发送用例，分别由官方机器人和 NTQQ 测试验证。扩展元素种类变化时同步两包用例
- `test/unit/common/schemaDiff.test.ts`、`jsonFile.test.ts`：差异规则（含 dict 整体替换）与文件原语
- `test/unit/bootstrap/builtins.test.ts`：真实内置表在没有 NTQQ、OneBot、Milky 包时启动，宿主服务正常运行、依赖账号的消费者等待；验证 Satori 的配置、真实端口切换与释放、停用后同端口启用、core 条目保护，以及官方机器人缺凭证时的配置流程。`service-registry.test.ts` 直接挂载宿主服务，检查 ACTIVE 与等待账号依赖的 PENDING 边界。
- NTQQ 消息转换、Bot 能力、指令接入、登录资源、身份切换、协议停用、NativeQQ 回调与轮询测试在独立 `lucky-lillia-plugin-ntqq-protocol/test/` 下维护；OneBot 和 Milky 的协议专项测试同样随实现移动。宿主 Satori 测试只注册符合 SDK 接口的测试 Bot，验证事件、方法参数、平台名换算和登录增删；不 import 三个插件的私有源码，也不通过真正登录 QQ 验证。
- vitest 自己接管了模块加载，`registerHooks` 对被它转换的模块不生效，所以子模块热重载和"仓库外的插件"只能在真 Node 下验证：`npx tsx test/manual/plugin-runtime.mts`（裸 `Context` + `TimerService` + `PluginService`，插件建在系统临时目录，JS / TS 各一个，改子模块后重载）
- 插件前端：`test/webui/plugins/registry.test.ts`（可见性、排序、隐藏、single / keyed 取谁、chain 的顺序、核心页面不可隐藏、拒绝缺 id / 重复 id / 非字符串的 match / 重复声明、取最新注册）、`extensions.test.ts`（"界面"视图的状态、上下移、没人声明的）、`host.test.ts`（启用后自动加载、停用时按需加载配置编辑器、模块 apply 抛错时撤掉它注册过的）、`test/webui/routes/pluginAssets.test.ts`（cookie 校验、Content-Type、越界 404）、`plugins.test.ts`（`/ui`）、`routeTable.test.ts`（public 路由）；界面偏好的持久化和旧配置兼容在 `test/unit/plugin/service.test.ts` 的 webui 部分和 `store.test.ts`。第三方页面、配置编辑器和插槽的端到端验证，按作者指南准备待测插件，再使用上面的不登录方法加载
- 生产 bundle 的冒烟：`node dist/llbot.js` 在没有 Auth Token 的实例里不会登录，插件运行时照常在登录前加载；cwd 放到 dist 之外的空目录，就能验证解析兜底
