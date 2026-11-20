# 消息与指令

本节先说明账号和事件对象，再介绍消息监听、回复和指令。平台能力差异见[跨平台写法](cross-platform.md#跨平台写法)。

## 账号与会话

先从事件取得 `session.bot`，或通过 `ctx.bots.get(sid)` 选择明确的账号。`sid` 由平台名和机器人 ID 组成，例如 `qq:100001`。

### Bot 身份

Bot 表示一个平台上的一个机器人身份，`ctx.bots` 是可迭代的集合。处理消息用 `session.bot`，后台任务选择配置里明确指定的 `sid`，不需要隐式的“当前账号”。

| 字段 | 含义 | 示例 |
|---|---|---|
| `platform` | 平台名称 | `ntqq`、`qq` |
| `selfId` | 平台上的机器人 ID | 普通 QQ 号、官方 AppID |
| `sid` | `platform:selfId`，集合唯一键 | `ntqq:12345`、`qq:100001` |
| `user` | Bot 自身用户资料，可缺省 | `name`、`avatar` |
| `status` | 当前状态 | `Status.ONLINE` |
| `features` | 原生能力列表 | `message.markdown` |

`ctx.bots` 支持 `size`、`get(sid)` 和遍历。后台发送可以使用：

```ts
import { h, type Context } from '@luckylillia/plugin-sdk'
import { Status } from '@satorijs/protocol'

export async function notify(ctx: Context, sid: string, channelId: string, text: string) {
  const bot = ctx.bots.get(sid)
  if (!bot || bot.status !== Status.ONLINE) return false
  await bot.sendMessage(channelId, h.text(text))
  return true
}
```

调用方需声明 `bots` 服务依赖。对象已注册不代表在线，在线也不保证平台允许主动消息；仍应处理发送异常和额度限制。不要随意选择集合中的第一个 Bot。

### Session

| 字段 | 用途 |
|---|---|
| `bot`、`platform`、`selfId` | 本次事件所属 Bot |
| `type`、`timestamp` | 事件类型和时间 |
| `userId`、`channelId`、`guildId`、`messageId` | 事件中的 ID，可能为空 |
| `isDirect` | 是否私聊 |
| `content` | 元素标记字符串，无消息时为空 |
| `elements` | 解析后的元素数组 |
| `stripped` | 去掉开头引用、对 Bot 的 @ 及后续空白；包含 content、atSelf |
| `event` | 原始中立事件，字段为 snake_case |

常用 event 字段包括 user、member、guild、channel、message、operator、button、`referrer`。例如 `event.member?.roles` 是已知群角色。并非所有事件都有消息、用户或会话，调用回复和管理方法前要检查相应 ID。

### 动态状态与标识符

`bot/status` 通知注册、注销和状态变化。判断通知中的对象是否仍有效，使用 `ctx.bots.get(bot.sid) === bot`：注销对象的 status 可能仍是此前状态，同一 `sid` 也可能已换成新对象。

插件启动时可能已经有 Bot，也可能集合为空。需要为每个 Bot 初始化资源时，应检查当前集合并订阅后续通知，对重复事件保持幂等；对象替换或移除时清理其资源。定时任务在执行时重新 `get(sid)`，避免使用已卸载对象。

ID 一律按字符串处理，不能假设可转换为 QQ 号。官方用户和群是 openid，频道有独立 ID。跨平台索引至少包含平台；数据不应在多个 Bot 间共享时，推荐 `[bot.sid, userId]` 或 `[bot.sid, channelId, userId]` 作为复合键。同一人在不同平台或 AppID 下不一定拥有相同身份。

## 收发消息

### 消息中间件与 next

匹配失败时调用 `next` 继续处理；匹配成功后可以消费消息，或回复后继续传递：

```ts
import { Context } from '@luckylillia/plugin-sdk'

export const inject = ['bots']

export function apply(ctx: Context) {
  ctx.on('bot/message', async (session, next) => {
    const content = session.stripped.content
    if (!content.startsWith('echo ')) return next()
    await session.reply(content.slice(5))
    // 本分支消费消息。希望后续插件也处理时，在这里 await next()。
  })
}
```

`await next()` 会等待后续链完成，可以在前后执行逻辑。它表示继续处理，不是发送完成回调；同一中间件不要对同一消息多次调用 `next`。

### 元素与发送

SDK 导出 `@satorijs/element` 的 h。使用 `h.text(value)` 发送纯文本，`h.parse(markup)` 解析明确约定为元素标记的字符串。不要把普通用户输入直接拼进 XML 式元素属性。

以下片段放在消息回调中，并从 SDK 导入 `h`：

```ts
await session.send([
  h('at', { id: session.userId }),
  h.text(' 结果如下：'),
  h.image('https://example.com/result.png'),
])
await session.reply(h.text('这是一条引用回复'))
```

| 方法 | 行为 |
|---|---|
| `session.send(content)` | 发到触发会话，保留 `referrer` |
| `session.reply(content)` | 同上，并引用触发消息 |
| `session.sendQueued(content, delay?)` | 同 Bot、同频道排队，发送后默认间隔 1000ms |
| `session.prompt(timeout?)` | 等待同 Bot、同频道、同用户的下一条消息，默认 60 秒 |
| `bot.sendMessage(channelId, content, options?)` | 明确指定会话，返回消息资源数组 |
| `bot.sendPrivateMessage?.(userId, content, options?)` | 可选私聊方法，调用前检查 |

SendOptions 支持 quote（消息 ID）和 `referrer`（被动回复信息）。已有 Session 时优先 send/reply；自己调用 Bot 时可传 `{ referrer: session.event.referrer }`。返回值可能包含多条消息，不保证只有一个数字 ID，缓冲中的流式片段也可能暂时没有 ID。

**等待回答与排队发送**

```ts
await session.send('请输入标题，30 秒内有效。')
const answer = await session.prompt(30_000)
await session.send(answer === undefined ? '等待超时。' : h.text('收到：' + answer))
```

prompt 返回 `stripped.content`。回答不再进入 `bot/message`，但 `bot/session` 旁路仍能看到。相同 Bot、频道、用户的新等待会使旧等待以 `undefined` 结束。仅投递 @ 消息的群里，回答也要 @ Bot。

`sendQueued` 只控制发送节奏，不增加平台额度。连续发送时逐条 await，避免大量并发发送。

### 事件入口

| 事件 | 分发方式 | 内容 |
|---|---|---|
| `bot/message` | 顺序中间件 | 别人发来的消息 |
| `bot/event` | 并行通知 | 成员变化、撤回、申请、互动和 Bot 自己的消息 |
| `bot/session` | 并行旁路 | 所有事件，先于消息路由；仍受生效范围过滤 |
| `bot/status` | 并行通知 | Bot 注册、注销和状态变化 |
| `bot/before-send` | 顺序变换 | 插件即将发出的元素 |
| `bot/fallback` | 按顺序询问 | 不支持的扩展元素如何替代 |

Bot 自己的消息不进 `bot/message`，避免回复循环；它们可能出现在 `bot/event` 和 `bot/session`。旁路不受中间件消费影响。

下列片段放在已导入 h、`inject` bots 的插件 `apply` 中：

```ts
ctx.on('bot/event', async (session) => {
  if (session.type !== 'guild-member-added' || !session.userId || !session.channelId) return
  await session.send([h('at', { id: session.userId }), h.text(' 欢迎加入')])
})
```

### 发送前改写

下面的监听器放在已导入 `h`、声明 `bots` 依赖的 `apply` 中：

```ts
ctx.on('bot/before-send', (bot, channelId, content, next) => {
  content.push(h.text(' [自动回复]'))
  return next()
})
```

可原地修改 content、处理 `await next()` 的结果，或返回 [] 取消发送。OneBot、Milky 客户端的发送和 Satori relay 不调用插件的发送前改写及自定义降级。Satori relay 仍应用宿主内置元素降级。

### 生效范围和处理顺序

用户打开独立的 **「消息处理顺序」** 设置页（`#message-order`，由内置插件 `builtin:message-order` 提供），用上下箭头排序，点击 **「保存顺序」** 后立即生效，无需重启。插件 1 在插件 2 前面，且插件 1 调用了 `next`，插件 2 才能收到。

显式排序的插件优先，未排序监听器按注册先后排在后面。`ctx.on(..., { prepend: true })` 只调整未排序部分，不能覆盖用户排序。列表显示实际注册消息监听器的插件。

**所有 `ctx.command` 注册的指令统一在「指令」这一行执行。** 它们不会分别列在所属插件的消息处理行中。要在指令匹配前过滤，把过滤插件移到「指令」上方；普通插件排序不改变同名指令的注册顺序。

每个插件条目的配置弹窗提供平台、Bot、群、用户和私聊的生效范围。范围影响 `bot/message`、`bot/event`、`bot/session`、指令匹配和 `bot/before-send`。它不是代码沙箱，不为任意 HTTP 接口、后台任务或直接平台调用提供业务授权；主动任务仍需自己选择和校验目标。

一个监听器失败不使整条链失败：在 `next` 之前抛错会继续后面的插件，错误记录在日志和卡片；已经完成的处理不会回滚。故意消费消息时正常返回，不要靠异常阻断。

## 指令

在 `inject` 和清单的 `required` 中声明 `commands`，然后使用 `ctx.command(def, description?, config?)`：

```ts
import { Context, h } from '@luckylillia/plugin-sdk'

export const inject = ['commands']

export function apply(ctx: Context) {
  ctx.command('repeat <text:text>', '重复文本', { cooldown: 3000 })
    .alias('复述')
    .option('times', '-n <count:posint> 重复次数', { fallback: 1 })
    .action(({ options }, text: string) => {
      const count = Math.min(Number(options.times), 5)
      return h.text(Array.from({ length: count }, () => text).join('\n'))
    })
}
```

调用 `/repeat -n 2 你好` 或 `复述 --times 2 你好`。这个示例以纯文本展示输入；要保留参数中的 @ 等元素，再明确使用 `h.parse`。

用户还可以在内置「指令」页为每条指令添加多个自定义别名，每行一个，不含前缀，点击「保存配置」后立即生效。自定义别名与 `.alias()` 声明的别名叠加，原名仍可用；共用参数、权限、冷却和生效范围。别名按插件条目和注册原名保存，停用或重载不丢失，也不影响其他插件的同名指令。`ctx.commands.list()` 返回全部生效别名，可用于插件自己的帮助菜单。

### 参数和选项

`<name:type>` 必需，`[name:type]` 可选，省略类型使用 string。

| 类型 | 结果 |
|---|---|
| `string` | 一个词，引号中的空白保留 |
| `text` | 后续全部文本 |
| `number` | 数字 |
| `integer` | 整数 |
| `posint` | 大于 0 的整数 |
| `natural` | 大于等于 0 的整数 |
| `user` | @ 或输入中的用户 ID |

支持英文单双引号、中文弯引号和「…」包住含空白参数。string/text 保留元素标记。解析失败发送原因和用法。

option(name, syntax, { fallback? }) 的 --name 总能使用，syntax 可以声明短选项和一个参数；无参数是布尔开关，出现时为 true。action 的 argv 含 session、command、options、args，普通参数也作为其后位置参数传入。

action 返回的字符串或元素会发送到触发会话；也可自行 send 并不返回内容。如果这条消息不由本指令处理（例如图片检测命令没带图），`return argv.next()` 将原消息交给后续消息中间件；直接返回 `undefined` 会结束本次处理。抛错时记录所属插件错误，用户收到「执行指令时出错了。」。卸载自动注销，提前注销调用命令对象 dispose()。

### 权限、冷却和菜单

- authority 声明插件的默认权限，省略时为 everyone；admin 允许群主、管理员和主人；owner 只允许「指令」设置中的主人。在「指令」页的主人列表中，每行选择平台并填写用户 ID，可以添加、删除。NTQQ 填 QQ 号，QQ 官方机器人填用户 openid；选「全部平台」时匹配所有平台上的该 ID。配置仍存为 `owners: string[]`，如 `ntqq:12345`、`qq:用户openid`，裸 ID 表示全部平台；已有 `luckylillia:` 前缀会按 `ntqq:` 处理。
- 用户可在「指令」页的“谁能用”中覆盖每条指令的权限，保存后立即生效，选择“默认”恢复插件声明。权限按插件条目和指令原名保存，原名及所有别名共用，同名的其他插件指令不受影响。`ctx.commands.list()` 的 `authority` 是生效权限，`defaultAuthority` 是插件默认权限。
- cooldown 单位毫秒，当前按“指令名 + 平台 + 用户 ID”记录，同一用户跨群调用同名指令也共享冷却，并非每频道或每 Bot 独立。
- hidden: true 不同步到平台菜单，不禁用指令，也不从指令管理页隐藏。
- 默认 / 前缀并允许无前缀，用户可修改。匹配前移除开头对 Bot 的 @。
- 名称或别名后可以是空白、消息结束或图片、@ 等真正的消息元素，如 `/查图<img src="…"/>`；元素原样保留在参数和 session 中。继续拼接普通文字（如 `查图呀`）不匹配，转义后的 `<img>` 文本也不当元素边界。
- 同名指令先按插件生效范围筛选，再按名称长度、注册先后匹配；冲突可在指令页查看。
- 官方机器人启用由插件提供单聊菜单/群指令面板后，同步非 hidden 指令。菜单展示不代替运行时授权。

没有内置 help 指令。需要时自己注册，可通过 `ctx.commands.list()` 获取名称、别名、说明、用法、权限等，并决定展示哪些内容。中间件顺序详见[生效范围和处理顺序](#生效范围和处理顺序)。
