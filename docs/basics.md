# 插件基础与服务

## 插件基础

先了解插件如何挂载、何时获得服务，以及停用时怎样释放资源。

### 后端入口

后端支持 cordis 原生插件形状：命名导出的 `apply`、默认导出函数、带 `apply` 的对象，或 Service 子类。通常采用[TypeScript 示例](getting-started.md#带配置和指令的示例)的命名导出：

| 导出 | 用途 |
|---|---|
| `name` | cordis 插件名称；WebUI 展示名由清单控制 |
| `inject` | 插件启动时必须就绪的服务 |
| `Config` | 运行时配置 schema |
| `apply(ctx, config)` | 挂载逻辑，config 已补默认值并校验 |

Context 连接服务、事件和生命周期。通过自己的 `ctx` 注册监听器、命令、子插件和资源，宿主卸载插件时会一并撤销。模块顶层应以定义为主，避免 import 时建立连接或启动长期任务。

`ctx.plugin(plugin, config)` 挂载受当前插件生命周期管理的子插件。使用其它独立插件的能力时，通过服务注入和类型导入，不直接 import 其入口代码。

### 声明服务依赖

例如要访问 `ctx.bots` 和 `ctx.http`，在后端入口声明：

```ts
export const inject = ['bots', 'http']
```

在 `package.json` 的 `llbot.service` 中填写相同的必需服务：

```json
{
  "llbot": {
    "service": {
      "required": ["bots", "http"],
      "optional": ["greetings"],
      "implements": []
    }
  }
}
```

`inject` 决定运行时等待哪些服务；清单 required/optional/implements 让 WebUI 不执行代码也能说明服务依赖、找到提供者并提示冲突。required 与顶层 `inject` 保持一致，但清单不代替实际注入。插件包已安装、版本匹配不代表服务已就绪；仍需等待提供者启用并完成初始化。

可选逻辑放在局部 `ctx.inject(['服务名'], callback)`：服务出现时挂载这部分，消失时清理。不要将可选服务列入顶层 `inject`，只有可选功能需要的插件也不要列入必需的 `llbot.dependencies`。使用其他插件服务时，从其包导入类型并声明 peer dependency，必需的插件另列入 `llbot.dependencies`；运行时通过 `ctx` 访问，不直接 import 其插件入口。

### 生命周期与清理

`inject` 中的服务全部就绪后执行 `apply`。服务消失会卸载依赖方，恢复后重新挂载。平台临时离线表现为 `bot.status` 变化，通用插件不需要因此重启。

通过 `ctx` 注册的事件、命令、定时器和子插件会自动清理。其它资源使用 `ctx.effect`：

```ts
import { watch } from 'node:fs'
import type { Context } from '@luckylillia/plugin-sdk'

export function watchFile(ctx: Context, filename: string) {
  ctx.effect(() => {
    const watcher = watch(filename, () => ctx.logger('my-plugin').info('文件已变化'))
    return () => watcher.close()
  })
}
```

`ctx.interval(task, delay)`、`ctx.timeout(task, delay)`、throttle 和 debounce 由 timer 提供，也随调用方清理。全局定时器、子进程、端口和 WebSocket 必须登记 disposer。异步请求要处理异常，需要取消时用 AbortController 并在卸载时 abort。

**后端不要依赖 `apply` 的返回值清理。** cordis 对可构造函数采用构造调用，函数声明形式的 `apply` 返回值不是可靠的 disposer。普通插件使用 `ctx.effect`；Service 子类可在 `[Service.init]` 返回清理函数。浏览器端 WebUIPlugin 有独立约定，可以返回 cleanup。

停用、改配置、重载均可重复发生。不要把某次挂载的 Context、Bot、连接保存到无法清理的模块级单例中；持久数据放存储或数据库。

## 依赖与提供的服务

访问服务统一通过 `ctx`。内置服务的声明见[声明服务依赖](#声明服务依赖)；需要其他独立插件提供能力时，还要声明插件包关系。

| 你需要声明什么 | 放在哪里 |
|---|---|
| 运行时要等待的服务 | 后端 `inject`，清单 `llbot.service.required` |
| 必须安装的独立插件 | `llbot.dependencies`，填写包名和版本范围 |
| SDK 或插件 API 的兼容版本 | `peerDependencies` |
| 插件自己使用的普通 npm 库 | 包顶层 `dependencies` |

### 声明插件包依赖

依赖另一个外部插件时，在 `llbot.dependencies` 里写它的完整 npm 包名和 semver 版本范围。例如 `lucky-lillia-plugin-aiimgdetector` 需要 AI 服务插件 `@luckylillia/plugin-aiprovider`：

```json
{
  "peerDependencies": {
    "@luckylillia/plugin-sdk": "^1.0.0",
    "@luckylillia/plugin-aiprovider": "^1.0.0"
  },
  "llbot": {
    "dependencies": {
      "@luckylillia/plugin-aiprovider": "^1.0.0"
    },
    "service": { "required": ["bots", "ai", "http"] }
  }
}
```

`llbot.dependencies` 是必需的插件包关系，宿主按扫描到的插件包检查是否已安装、版本是否匹配；WebUI 同时展示包名、要求的版本和提供者状态。缺包或版本不匹配时不会运行消费者。字段只能填写插件包名和 semver 范围，不接受 Git、文件路径、URL 或 npm 别名；内置的 `bots`、`database` 等服务按[服务依赖](#声明服务依赖)声明。

市场如何安装和检查这些依赖，见[市场兼容性](publishing.md#市场兼容性)。

`peerDependencies` 保留 SDK 和插件 API 的兼容声明，开发时另行提供其类型；它本身不触发插件市场安装。普通 npm 库写在包顶层的 `dependencies`，安装到这个插件自己的 `node_modules`。不要用普通库依赖代替 `llbot.dependencies`。

### 提供服务

一个完整的服务插件入口：

```ts
import { Context, Service } from '@luckylillia/plugin-sdk'

declare module 'cordis' {
  interface Context {
    greetings: Greetings
  }
}

export default class Greetings extends Service {
  constructor(ctx: Context) {
    super(ctx, 'greetings')
  }

  greet(name: string) {
    return '你好，' + name
  }
}
```

清单声明 `"implements": ["greetings"]`，可用 `"labels": { "greetings": "问候服务" }` 提供面向用户的名称。消费者导入对应类型后 `inject` greetings，调用 `ctx`.greetings.greet('小明')。

同一服务域不能注册同名服务。两个启用条目提供同名服务时，WebUI 提示冲突，后注册者可能失败。服务需要多实例时，应设计服务域或自己的实例 API，不能仅复制同名提供者。

### 可选媒体转换

安装并启用 `lucky-lillia-plugin-ffmpeg` 后可以使用 `ctx.ffmpeg`：`probe()` 读取媒体信息、`decodeAudio()` / `encodeAudio()` / `transcodeAudio()` 转换音频、`thumbnail()` 生成 PNG 封面。SDK 导出对应的 `FFmpegAPI`、`FFmpegAudioFormat` 和 `FFmpegMediaInfo` 类型。Bot 不内置这个插件；只有媒体功能需要时，用局部 `ctx.inject(['ffmpeg'], ...)` 挂载这部分，并在不可用时给用户安装提示或使用自己的 fallback。插件全部功能都依赖转换时才放入顶层 `inject` 和必需依赖。

### 使用外部 AI 服务

AI 由独立插件提供。需要调用时安装服务提供者、声明插件包依赖和 `ai` 服务依赖，再通过 `ctx.ai` 使用；类型、依赖写法和调用示例见 [`@luckylillia/plugin-aiprovider` 的说明](https://github.com/LuckyLilliaDev/lucky-lillia-plugin-aiprovider#readme)中的「给其他插件使用」。
