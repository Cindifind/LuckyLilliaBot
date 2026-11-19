# 配置、数据与 HTTP

## 配置与数据

配置由用户编辑；文件和数据表用于插件运行时保存数据。根据需要选择对应入口，并留意多个插件条目之间的共享规则。

### 配置

导出 `Config: Schema<Config>` 同时获得启动校验和 WebUI 表单。description 作为字段标题，没写时显示字段名。用户保存前，宿主校验完整生效值；失败时错误显示在字段旁，正在运行的实例保留旧配置。

配置变化后撤销旧挂载、以新配置启动，通常无需自己监听配置文件。其它 Standard Schema 实现（例如 zod）也能校验，但 WebUI 使用 JSON 编辑器。

#### 表单控件

表中省略 `Schema.` 前缀，例如 `string()` 实际写作 `Schema.string()`。

| 写法 | 表单控件 |
|---|---|
| `string()`；`.role('secret')` / `.role('textarea', { rows: [2, 4] })` / `.pattern(re)` | 输入框 / 密码框 / 多行 / 实时正则校验 |
| `number()` / `natural()`；`.min()` `.max()` `.step()` | 数字框 |
| `natural().role('ms')` | 数字 + 单位（毫秒 / 秒 / 分钟 / 小时 / 天），存毫秒 |
| `percent()` | 滑块，显示百分比 |
| `boolean()` | 开关 |
| `union([const('a').description('甲'), 'b'])` | 下拉；`.role('radio')` 为单选 |
| `union([const(false), object({...})])` | 开关，打开后展开对象 |
| 各分支都是带同一个 const 键的 object | 顶部切换按钮 + 选中分支的字段 |
| `array(X)`；`array(object({...})).role('table')`；`array(union([const...])).role('checkbox')` | 可增删排序的列表 / 表格 / 多选 |
| `dict(X)`、`dict(X, union([...]))` | 键值对列表（第二个参数限定可选的键） |
| `object()`（嵌套）、`intersect([object, object])`、`.collapse()` | 分组框，`collapse` 默认折叠 |
| `tuple()`、`bitset()` | 定长一行 / 多选 |
| `string().role('host')` | 监听地址：本机地址下拉，或手填 |
| `.role('xxx')`，且有插件用 `ctx.field('xxx', ...)` 注册了控件 | 那个控件（见"扩展 WebUI"；`ms` / `table` / `radio` / `checkbox` / `secret` / `slider` / `textarea` / `host` 不能被覆盖） |
| 其它（`any`、`is(...)`、无法判断的 union） | JSON 编辑框 |

hidden 字段不显示，但已有值仍保存、生效。deprecated、experimental 显示标签。自定义 role 见[自定义配置与字段](webui.md#自定义配置与字段)。

#### 密钥与保存语义

`role('secret')` 的已保存值不会明文返回给 WebUI。原掩码或空白提交都保留旧值，删除时使用「清空」并保存。数组中的密钥同样由宿主管理，不能自行把掩码当真实值写入。后端 config 收到实际密钥；WebUI 打码不代表磁盘加密。

配置存于当前 Bot 实例的 `plugins.json`，只记录相对默认值的差异。嵌套 object 逐字段比较，array、dict、union 和标量整体比较；升级后新的默认值会影响没有显式覆盖的字段。

**插件配置以条目为单位，不随消息的 Bot 自动切换。** 一个条目可处理多个 Bot，需要分账号行为时，使用生效范围或在配置中按 `sid` 区分。多个条目有独立配置，但文件目录的共享规则不同，见[多实例](#多实例)。

### 数据目录

`ctx.storage` 为当前插件提供数据目录，首次调用时创建，不需要等待 Bot 上线：

```ts
const shared = await ctx.storage.dir()
const sameShared = await ctx.storage.dir('global')
const perBot = await ctx.storage.dir('bot', session.bot)
const explicit = await ctx.storage.dir('bot', 'qq:100001')
```

| 调用 | 当前 Bot 实例中的路径 |
|---|---|
| `dir()`、`dir('global')` | `plugin-data/<包键>/shared/` |
| `dir('bot', bot或sid)` | `plugin-data/<包键>/bots/<平台>+<selfId>/` |

global 表示当前 Bot 实例内该插件的共享目录，不是整台机器共享。实例根目录是 `data/instances/<实例名>/`，包名中的 `/` 替换成 `+`，例如 `@scope/foo` 对应 `@scope+foo`。

同包的多个插件条目共用上述目录，不自动按条目 ID 分区。需要隔离时自行设计配置子空间；多个条目写同一文件需处理并发。卸载保留数据，数据目录不应放在代码或前端产物目录内。

`dir('bot', sid)` 接受未注册的 `sid`，因此它是身份分区，不是登录检查。官方机器人的群聊、单聊和频道共用同一 `qq:<AppID>` 目录；插件需要按会话分区时使用带命名空间的 `channelId`。

**旧 NT 插件数据兼容：** 优先使用 `bots/ntqq+<QQ号>/`，不存在时依次沿用 `bots/luckylillia+<QQ号>/`、更早的 `<包键>/<QQ号>/`。旧 `luckylillia:<QQ号>` 入参也归一到这套路径。不会移动、合并或删除原文件，多个目录同时存在时仍按上述顺序选择。插件始终以返回路径为准，不自行拼路径。

`ctx.baseUrl` 指向共享目录的 file URL，供按 URL 解析相对路径的生态插件使用。应在 `apply` 或构造阶段读取：服务方法中的 Context 可能是调用方；`ctx.storage` 按定义代码的插件定位，不会误用调用方的数据目录。

### 数据库

声明 `database` 服务依赖后，通过 `ctx.model` 定义数据表，通过 `ctx.database` 读写。数据位于当前 Bot 实例的 `database.db`，所有 Bot 共用，不依赖登录。插件使用自己的表名前缀和显式身份键；NT 协议内部消息库不属于该公共服务。

下面保存每个 Bot 上每个用户的偏好：

```ts
import { Context, h } from '@luckylillia/plugin-sdk'

declare module '@cordisjs/plugin-database' {
  interface Tables {
    my_plugin_preferences: { key: string; value: string }
  }
}

export const inject = ['commands', 'database']

export function apply(ctx: Context) {
  ctx.model.extend('my_plugin_preferences', {
    key: 'string',
    value: 'string',
  }, { primary: 'key' })

  ctx.command('记住 <value:text>', '保存自己的偏好')
    .action(async ({ session }, value: string) => {
      if (!session.userId) return
      const key = JSON.stringify([session.bot.sid, session.userId])
      await ctx.database.upsert('my_plugin_preferences', [{ key, value }])
      return h.text('已保存')
    })

  ctx.command('回忆', '读取自己的偏好').action(async ({ session }) => {
    if (!session.userId) return
    const key = JSON.stringify([session.bot.sid, session.userId])
    const [row] = await ctx.database.get('my_plugin_preferences', { key })
    return h.text(row?.value ?? '还没有保存')
  })
}
```

常用操作是 get/create/set/upsert/remove。SDK 导出数据库类型，表合并到 `@cordisjs/plugin-database`；开发依赖需提供对应库的类型。余额、计数等并发更新不能用无保护的“先读再写”代替原子操作或事务。

### 多实例

| 层次 | 隔离内容 |
|---|---|
| Bot 实例，启动时 `--instance <名字>` | settings/plugins/数据库/插件数据/WebUI 密码，由一个进程使用 |
| 同一 Bot 实例内的插件条目 | 启停、配置、生效范围、排序和运行状态 |

第三方插件包可添加多个条目，分别处理不同 Bot 或群。条目不等于独立代码副本，也不自动获得单独文件目录；同名服务、同端口、同文件仍可能冲突。

不同 Bot 实例的端口要避免冲突，配置不随换号切换。前端包级 hook 默认使用第一个条目，详见[页面与入口](webui.md#页面与入口)。每个 Bot 实例的数据都在 `data/instances/<实例名>/` 下。

## HTTP 与代理

声明 `http` 服务依赖后，通过 `ctx.http` 发送请求。内置「代理」为该服务应用代理规则；全局 fetch 不自动使用这些规则。

```ts
import { Context, h } from '@luckylillia/plugin-sdk'

export const inject = ['commands', 'http']

export function apply(ctx: Context) {
  const api = ctx.http.extend({
    baseURL: 'https://api.example.com/v1',
    timeout: 10_000,
    headers: { accept: 'application/json' },
  })
  ctx.command('天气 <city>', '查询天气').action(async (_, city: string) => {
    const data = await api.get<{ text: string }>('/weather', { params: { city } })
    return h.text(data.text)
  })
}
```

示例 URL、响应结构需替换为实际服务。Key 放入 secret 配置，不硬编码或输出日志。

| 方法（在 `ctx.http` 或 `api` 上调用） | 行为 |
|---|---|
| `get/delete(url, config?)` | 解析后的响应内容 |
| `post/put/patch(url, data?, config?)` | 对象、数组按 JSON 发送，返回解析结果 |
| `head(url, config?)` | `Headers` |
| `request(method, url, config?)` | `{ url, status, statusText, headers, data }` |
| `fetch(url, init?, config?)` | 原始 Response，适合流和自定义处理 |
| `file(url, config?)` | `{ data: ArrayBuffer, type, filename? }`，支持 http(s)、data URL |
| `extend(config)` | 继承当前设置的新客户端，headers 合并 |
| `proxy(url, config?)` | 同步取得原生客户端应使用的代理地址；直连为 `''`，不发请求 |

默认按 `Content-Type` 解析 JSON、文本或字节；`responseType` 可指定 json/text/arraybuffer/stream。请求参数支持 params、data、signal、redirect。

除 `fetch` 外，非 2xx 响应会抛出 `HttpError`，可查看 `response.status`、`response.data`。网络错误查看 `code`，例如 `ECONNREFUSED`、`ENOTFOUND`、`ETIMEDOUT`。`HttpError` 是类型接口，不能用于 `instanceof`；`fetch` 保留原生响应语义，需要自行检查 `response.ok`。

`proxyAgent: ''` 表示直连；HTTP(S) 或 SOCKS5 地址覆盖默认代理，也可传给 `extend()`。这些代理由「代理」插件实施，停用时全部直连。file 在响应类型不明确时检查文件头，例如 QQ 图片返回 application/octet-stream 的情况。

原生浏览器等自行联网的客户端使用 `ctx.http.proxy(target)` 读取当前生效的地址，不需要读取其他插件的配置文件。该方法沿用 `baseURL`、`extend()` 和单次设置的合并规则，并遵循默认代理对本机、内网地址的跳过规则；无效代理会抛错。返回值可能包含代理账号密码，只交给后端原生客户端，不能放进日志或前端响应。调用方负责让原生客户端正确应用地址、认证和直连结果，并在重新建立连接时重新解析。
