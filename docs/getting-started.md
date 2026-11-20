# 开发流程

需要持续开发时，使用带 TypeScript、构建和测试的脚手架。下面按仓库内开发的流程另建 `my-plugin` 项目；[仓库外开发](testing.md#在仓库外开发)是另一种可选方式。验证新项目之前，先停用开头的「Ping 示例」，避免两个插件同时处理 `ping`。

## 准备仓库与 SDK

`@luckylillia/plugin-sdk` 已发布到 npm，可以在[独立目录中开发](testing.md#在仓库外开发)。下面介绍使用 Bot 源码联调的方式：需要 Node.js 22.15 或以上，以及安装好的仓库依赖。仓库使用 Yarn 4 和 `node_modules`；新检出的仓库可先执行：

```sh
# Bot 仓库根目录；需要本机已安装 Corepack
corepack yarn install
npm run build:sdk
```

`build:sdk` 生成 SDK 类型、运行时入口和测试工具。修改 SDK 源码后也要重新运行。本文中的 `npm run`、`npm test` 仅执行脚本，不重新安装依赖。

## 创建插件

```sh
# Bot 仓库根目录
node packages/plugin-sdk/bin/luckylillia-plugin.mjs create data/plugins/my-plugin
cd data/plugins/my-plugin
npm test
npm run build
```

默认包名为 `luckylillia-plugin-my-plugin`。脚手架支持 `--name`、`--description`、`--author`，未指定作者时使用 Git 的 user.name。

在已安装根依赖的 Bot 仓库内，模板可以直接向上使用仓库的 `node_modules`，无需重复执行 `npm install`。在独立目录中开发时，按脚手架提示安装依赖即可。

`data/plugins/` 是默认扫描目录，Bot 的开发监视器也已排除它，修改插件不会因此重启整个 Bot。`data/` 不进入仓库 Git；插件需要独立版本管理时可作为自己的项目管理。

| 生成文件 | 作用 |
|---|---|
| `package.json` | npm 元数据、SDK 版本、插件清单、脚本 |
| `src/index.ts` | 配置、指令和消息中间件 |
| `test/index.test.ts` | 不登录 QQ 的逻辑和降级测试 |
| `tsconfig.json` | 把源码编译到 lib |
| `vitest.config.ts` | 仅查找本插件 test/**/*.test.ts，不继承父项目测试配置 |
| `.gitignore` | 忽略依赖和产物 |

## 带配置和指令的示例

接下来给插件增加可配置的问候语和 `hello` 指令。以下内容完整替换生成项目的 `src/index.ts`；保留模板的 `package.json`，它已声明 `bots` 和 `commands` 服务。

```ts
import { Context, h, Schema } from '@luckylillia/plugin-sdk'

export const name = 'my-plugin'
export const inject = ['bots', 'commands']

export interface Config {
  greeting: string
}

export const Config: Schema<Config> = Schema.object({
  greeting: Schema.string().default('你好').description('问候语'),
})

export function apply(ctx: Context, config: Config) {
  ctx.command('hello [name:text]', '向指定的人打招呼')
    .action(({ session }, name?: string) => {
      const target = name || session.event.user?.name || session.userId || '朋友'
      return h.text(config.greeting + '，' + target + '！')
    })

  ctx.on('bot/message', async (session, next) => {
    if (session.stripped.content !== 'ping') return next()
    await session.send(h('markdown', {}, '**pong**'))
  })
}
```

`/hello 小明` 默认也可以不写斜杠，前缀在「指令」设置页统一配置。ping 使用 `stripped.content` 匹配，因此能处理开头带对机器人的 @ 的消息。

## 测试和构建

将[完整测试文件](testing.md#完整测试文件)保存为 `test/index.test.ts`，然后在插件目录运行：

```sh
npm test
npm run build
```

测试会验证指令、消息匹配和元素降级，无需登录 QQ；构建完成后，再放到 Bot 中验证真实收发。

## 在 Bot 中验证

```sh
# 终端一：插件目录，持续编译
npm run dev
```

```sh
# 终端二：Bot 仓库根目录
npm run dev -- --plugin-hmr
```

在 WebUI「插件」的「本地安装」中，点击真实插件目录旁的「扫描」，然后在「已安装」中启用新插件并完成信任确认。卡片齿轮可编辑配置、设置生效范围。用已连接的 Bot 发消息验证，错误查看插件卡片和日志页。前端模块随插件启用自动加载，详见[界面加载](webui.md#界面加载)。
