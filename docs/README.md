# 插件开发指南

先做一个收到 `ping` 就回复 `pong` 的插件。下面给出全部文件，放进已有的 LuckyLillia Bot 即可使用。各主题的详细说明见[接下来读什么](#接下来读什么)。

## 最小可运行插件

在 Bot 的 `data/plugins/` 下创建 `ping` 目录，只放两个文件：

```text
data/plugins/ping/
  package.json
  index.js
```

**`package.json`**：声明插件包、入口和服务依赖。

```json
{
  "name": "luckylillia-plugin-ping",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "peerDependencies": { "@luckylillia/plugin-sdk": "^1.0.0" },
  "llbot": {
    "title": "Ping 示例",
    "service": { "required": ["bots"] }
  }
}
```

**`index.js`**：监听消息，匹配后回复。

```js
import { h } from '@luckylillia/plugin-sdk'

export const inject = ['bots']

/** @param {import('@luckylillia/plugin-sdk').Context} ctx */
export function apply(ctx) {
  ctx.on('bot/message', async (session, next) => {
    if (session.stripped.content !== 'ping') return next()
    await session.send(h.text('pong'))
  })
}
```

这个示例直接使用 JavaScript，无需编译。SDK 由宿主提供，插件目录无需执行 `npm install`。若使用源码运行 Bot，环境准备见[准备仓库与 SDK](getting-started.md#准备仓库与-sdk)。

1. 启动 Bot，在 WebUI「插件」的「本地安装」中，点击真实插件目录旁的「扫描」。
   无头启动也可使用 `node llbot.js --plugin luckylillia-plugin-ping`：已有包直接信任并启用，缺少时从配置的 npm 源安装。参数可重复或用逗号分隔，并启用必需插件依赖；保留已有配置，详见[启动时安装并启用插件](publishing.md#启动时安装并启用插件)。
2. 找到「Ping 示例」，完成信任确认并启用。
3. 用另一个账号向已连接的 Bot 发送 `ping`，应收到 `pong`。官方机器人群聊中发送 `@机器人 ping`。

插件只处理匹配的消息，其余消息由 `next()` 交给后续插件。`session.stripped.content` 会去掉开头对机器人的 @，`session.send()` 使用收到消息的账号回复当前会话。

## 读懂这个示例

插件是一个带 `llbot` 清单的 npm 包，后端遵循 [cordis 4](https://github.com/cordiverse/cordis) 的插件约定。`package.json` 告诉宿主从哪里加载、依赖哪些服务；服务就绪后，宿主调用 `apply(ctx, config)`。

| 对象 | 从哪里取得 | 用来做什么 |
|---|---|---|
| `ctx` | 宿主传入 `apply()` | 注册事件、指令，访问 `ctx.bots`、`ctx.http` 等服务 |
| `session` | 消息或事件监听器的回调参数 | 读取本次事件、回复当前会话、等待用户回答 |
| `bot` | 消息中用 `session.bot`；后台用 `ctx.bots.get(sid)` | 代表一个具体的机器人账号，执行发送、查询和群管理 |

`bot/message` 是传给 `ctx.on()` 的事件名。同一宿主可以有多个账号，发送和管理操作需要由某个具体的 `bot` 执行；`session.send()` 已经带上本次事件的账号和会话信息。

实际的 `bot`、`session` 对象由宿主和协议端创建，无需导入。SDK 导出的 `Bot`、`Session` 是 TypeScript 类型，需要显式标注时使用 `import type { Bot, Session } from '@luckylillia/plugin-sdk'`。

### 接下来读什么

| 文档 | 内容 |
|---|---|
| [开发流程](getting-started.md) | 用脚手架建立带类型、构建和测试的项目，在 Bot 中联调 |
| [插件基础与服务](basics.md) | 入口、服务依赖、生命周期与清理，插件包依赖，提供服务 |
| [消息与指令](messages.md) | 账号与会话、收发消息、事件、生效范围和顺序、指令 |
| [跨平台与平台接口](cross-platform.md) | 扩展元素与降级、流式回复、QQ 平台差异、管理方法和 `bot.internal` |
| [配置、数据与 HTTP](config-and-data.md) | 配置表单、密钥、数据目录、数据库、多实例、`ctx.http` 和代理 |
| [扩展 WebUI](webui.md) | 页面、前端 SDK、自定义配置界面、主题、插槽、后端接口 |
| [开发与测试](testing.md) | 热重载、仓库外开发、`@luckylillia/plugin-sdk/testing` |
| [打包与发布](publishing.md) | 插件清单、构建、发布到 npm 和插件市场、安装方式 |
| [排错与参考](troubleshooting.md) | 常见问题，SDK 源码和示例 |

## 插件能做什么

以下是宿主、内置插件和已安装的协议插件提供的常用能力；后端功能所需的服务要在 [inject 和清单](basics.md#声明服务依赖)中声明。NTQQ 来自独立的 `@luckylillia/plugin-nt-protocol`，OneBot 11 和 Milky 分别来自 `@luckylillia/plugin-onebot11`、`@luckylillia/plugin-milky`，WebQQ 来自 `lucky-lillia-plugin-webqq`，均需用户自行安装、信任和启用；Satori 和 QQ 官方机器人由 Bot 随附。没有安装 NTQQ 时，通用插件仍能处理其他已启用协议提供的 Bot。

| 能力 | 调用入口 | 所需服务 |
|---|---|---|
| 接收消息和其它事件 | `ctx.on('bot/message', ...)`，其它事件见[事件入口](messages.md#事件入口) | `bots` |
| 回复、主动发送、等待用户回答 | `session.send()` / `session.reply()`、`bot.sendMessage()`、`session.prompt()` | `bots` |
| 发送前处理、扩展元素降级 | `ctx.on('bot/before-send', ...)`、`ctx.on('bot/fallback', ...)` | `bots` |
| 指令、参数、权限、冷却、平台菜单 | `ctx.command()` | `commands` |
| 群管理和平台接口 | `bot.kickGuildMember?.(...)` 等可选方法、`internalOf(bot, ...)` | `bots` |
| 配置表单和校验 | 模块导出的 `Config` | 无 |
| 文件与数据表 | `ctx.storage`、`ctx.model`、`ctx.database` | 文件无需服务；数据表需要 `database` |
| HTTP 和文件下载 | `ctx.http` | `http` |
| 定时、延时、防抖、节流 | `ctx.interval()`、`ctx.timeout()`、`ctx.debounce()`、`ctx.throttle()` | `timer` |
| 提供共享能力 | `Service` 子类 | 按服务需求 |
| 页面、配置编辑器和插槽 | `@luckylillia/plugin-sdk/webui` | 浏览器模块 |
| `HTTP API`、`webhook` | `ctx.webuiServer.route()` | `webuiServer` |
| 日志 | `ctx.logger('插件名')` | 无 |

插件运行在 Bot 的 Node.js 进程中，没有沙箱。首次启用第三方插件需要用户信任；其 WebUI 模块随插件启用自动加载。配置、生效范围、消息顺序、插件多实例和热重载由宿主管理。

跨平台接口不保证每个平台拥有相同能力。扩展元素有默认降级，但管理方法、事件订阅、媒体格式和主动消息额度仍由平台决定。插件市场不执行依赖的安装脚本，发布前需要验证安装产物可以直接运行。
