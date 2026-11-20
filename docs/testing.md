# 开发与测试

日常开发先编译并热重载，自动化测试验证消息和业务逻辑；平台实际权限、额度和上传结果仍需连接平台验证。

## 开发

`--plugin-dir <目录>` 在默认 `data/plugins` 外增加扫描目录，可指定多次。`--plugin-hmr` 开热重载，也可在实例 `plugins.json` 顶层设 `hmr: true`；否则手动点卡片重载。

源码 Bot 的 tsx 可加载 .ts；发布版 Bot 使用已构建 JS。推荐开发和发布共用 lib 入口并开 tsc watch，也可添加 development 条件：

```json
{
  "main": "lib/index.js",
  "exports": {
    ".": { "development": "./src/index.ts", "default": "./lib/index.js" },
    "./package.json": "./package.json"
  }
}
```

源码 Bot 优先加载存在的 development 源码，发布版使用 JS。development 不代替发布构建。

仓库的 `npm run dev` 排除了 `data` 和同级的 `LuckyLillia.Plugins`，其它目录插件被 tsx 加载后可能触发整个进程重启。直接调用 tsx 时将排除参数放在入口前：

```sh
npx tsx watch --exclude "./data/**" --exclude "/path/to/plugins/**" src/main/main.ts --plugin-dir /path/to/plugins --plugin-hmr
```

重载会重新导入插件包及子模块，清理旧挂载资源。频繁 ESM 重载会累积模块缓存，开发进程应适时重启。仅改展示元数据通常重新扫描即可，行为变化需要重载。

### 在仓库外开发

可以直接使用 npm 上的 SDK 和脚手架，无需克隆 Bot 仓库：

```sh
npx -p @luckylillia/plugin-sdk luckylillia-plugin create my-plugin
cd my-plugin
npm install
npm run build
npm test
```

需要联调尚未发布的 SDK 源码时，先在 Bot 仓库运行 `npm run build:sdk`，再将插件的 `devDependencies.@luckylillia/plugin-sdk` 改为 `file:<Bot仓库>/packages/plugin-sdk` 并重新安装依赖。将 `<Bot仓库>` 替换为实际路径，含空格时给参数加引号。保留 `peerDependencies` 中的 SDK 兼容版本；file 路径仅用于本地开发依赖。

## 测试

`@luckylillia/plugin-sdk/testing` 使用宿主的消息、Session、指令、HTTP、默认降级逻辑和只记录发送结果的假 Bot。适合验证消息匹配、参数、元素、平台分支和数据分区。下面的完整测试对应[带配置和指令的示例](getting-started.md#带配置和指令的示例)。

### 完整测试文件

保存为插件的 `test/index.test.ts`：

```ts
import { afterEach, beforeEach, expect, it } from 'vitest'
import { createTestApp, type TestApp } from '@luckylillia/plugin-sdk/testing'
import * as plugin from '../src/index.js'

let app: TestApp

beforeEach(async () => {
  app = await createTestApp()
  await app.ctx.plugin(plugin, { greeting: '早上好' })
})

afterEach(() => app.dispose())

it('解析指令参数并使用配置', async () => {
  const bot = app.bot()
  expect(await bot.receive('/hello 小明')).toEqual(['早上好，小明！'])
  expect(await bot.receive('没有匹配的消息')).toEqual([])
})

it('发送原生 markdown 或默认降级内容', async () => {
  const official = app.bot({ platform: 'qq', features: ['message.markdown'] })
  const plain = app.bot()
  expect(await official.receive('ping')).toEqual(['<markdown>**pong**</markdown>'])
  expect(await plain.receive('ping')).toEqual(['<p><b>pong</b></p>'])
})
```

运行 `npm test`。以下测试工具和用例可继续加到这个文件中。

### 测试工具

| API | 用途 |
|---|---|
| `await createTestApp()` | 带 bots/commands/http/timer 的 Context 和临时存储 |
| `await app.ctx.plugin(plugin, config)` | 挂载被测插件 |
| `app.bot({ platform?, selfId?, features?, internal? })` | 注册假 Bot，默认 test:bot |
| `bot.receive(content, options?)` | 模拟消息，等待处理完成并返回期间发送的元素标记 |
| `bot.sent` | 全部发送记录，含 channelId/content |
| `bot.emit(type, data?)` | 模拟成员、按钮等其它事件 |
| `app.commands` | 可修改 prefixes/bare/owners |
| `app.dataDir` | 临时数据目录 |
| `await app.dispose()` | 清理测试环境和临时数据 |

receive 支持 userId/name/guildId/channelId/event，未给 `guildId` 是私聊，给了为群聊。一个 app 里每个 `sid` 必须唯一；创建多个相同平台 Bot 时指定不同 `selfId`。

以下用例可以追加到起步测试文件：

```ts
it('群内 @ 不影响 ping 匹配', async () => {
  const bot = app.bot({ platform: 'qq', selfId: '100001', features: ['message.markdown'] })
  expect(await bot.receive('<at id="100001"/> ping', {
    guildId: 'group-openid', userId: 'user-openid',
  })).toEqual(['<markdown>**pong**</markdown>'])
})
```

测试 internal 调用时传入 vi.fn(async (...) => ...) 等 mock。权限测试可通过 event.member.roles 补充角色，或给测试 Bot 增加所需可选方法。

### 异步问答

不能先 await 完发起 prompt 的 receive，再发送回答。先保留 Promise，等待问题发出后提交下一条消息。下面可追加到起步测试文件，并从 vitest 导入 vi：

```ts
it('等待同一用户回答', async () => {
  app.ctx.on('bot/message', async (session, next) => {
    if (session.stripped.content !== '开始问答') return next()
    await session.send('答案是什么？')
    const answer = await session.prompt(1000)
    await session.send(answer ?? '超时')
  })
  const bot = app.bot()
  const conversation = bot.receive('开始问答')
  await vi.waitFor(() => expect(bot.sent.length).toBe(1))
  await bot.receive('42')
  await conversation
  expect(bot.sent.map(message => message.content)).toEqual(['答案是什么？', '42'])
})
```

### 测试边界

工具不提供真实登录、上传、平台连接、平台额度、数据库或 WebUI。依赖数据库/AI/自定义服务时，按目标挂临时真实服务或 mock。HTTP 默认真实出网，需隔离时使用 http/fetch-init、本地服务器或服务 mock。

测试环境没有完整 PluginService，不自动模拟清单扫描、插件信任、生效范围、WebUI 消息排序和市场安装。普通中间件可测试 `next`，宿主范围和排序需集成测试或实际 WebUI 验证。

bot.sent 是发送前改写及默认降级后的元素标记，不是最终平台上传载荷。声明 features 仅表示假 Bot 接受原生元素，不能证明真实平台权限或能力。

前端界面的验证方法见[在宿主中验证](webui.md#在宿主中验证)。
