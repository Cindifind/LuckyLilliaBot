# 扩展 WebUI

只需要自动配置表单时，在后端导出 `Config` 即可。要增加页面、Dashboard 卡片、自定义配置编辑器或表单控件，再为插件编写浏览器模块。

前后端示例都把上下文参数命名为 `ctx`，但它们运行在不同位置，提供的 API 也不同：

| 上下文 | 导入来源 | 用途 |
|---|---|---|
| 后端 `Context` | `@luckylillia/plugin-sdk` | 使用 `ctx.bots` 等服务、读写文件、注册 HTTP 接口 |
| 前端 `WebUIContext` | `@luckylillia/plugin-sdk/webui` | 注册页面和插槽，通过 SDK 或 HTTP 获取后端数据 |

两者都由宿主传给各自的 `apply(ctx)`；React 组件中用 `usePluginContext()` 获取前端上下文。浏览器不能直接调用后端的 `ctx.bots` 或文件系统。例如，前端的 `useBots()` 返回用于展示的账号信息，不是可以发送消息的后端 `Bot` 对象。

## 页面与入口

在 `package.json` 的 `llbot.webui` 中声明浏览器入口，例如：

```json
{
  "llbot": {
    "webui": "webui/index.js"
  }
}
```

以下内容可直接保存为 `webui/index.js`，不需要打包。前端入口默认导出 `apply(ctx)`，由它注册页面：

```js
import { createElement } from 'react'
import { SchemaSettings, useBots } from '@luckylillia/plugin-sdk/webui'

function BotsPage() {
  const bots = useBots()
  if (bots === null) return createElement('p', null, '正在读取账号…')
  return createElement('div', { className: 'card', style: { padding: 20 } },
    bots.length ? bots.map(bot => createElement('p', { key: bot.sid },
      bot.sid + ' · 状态 ' + bot.status,
    )) : createElement('p', null, '尚无已注册的账号'),
  )
}

/** @param {import('@luckylillia/plugin-sdk/webui').WebUIContext} ctx */
export default function apply(ctx) {
  ctx.page({ id: 'bots', title: '账号列表', icon: 'users', component: BotsPage })
  ctx.page({ id: 'settings', title: '示例设置', component: SchemaSettings, settings: true })
}
```

界面的显示条件取决于注册方式：

| 注册方式 | 何时显示或可用 |
|---|---|
| `ctx.page({ id, title, component, icon?, order?, header? })` | 插件启用时列入侧边栏；未运行时，页面内容换成等待或错误原因 |
| `ctx.page({ ..., settings: true })` | 后端未运行时也能配置；停用后从侧边栏移除，但配置弹窗仍可打开它 |
| `ctx.slot(name, contribution)` | 插件运行时显示贡献 |
| `ctx.declareSlot(name, declaration)` | 声明自己界面中供其他插件扩展的位置 |
| `ctx.config(Editor)` | 替代配置弹窗的自动表单，插件停用时也能配置 |
| `ctx.field(role, Field)` | 模块加载后，相应 `role` 字段使用该控件 |

一个包共享一个前端模块。`usePluginStatus()` 和 `usePluginConfig()` 默认面向该包的第一个条目，不会自动提供多条目选择器。为多个条目做业务界面时，需要自行设计条目选择和对应接口；每个后端条目不会自动生成一个页面实例。

## 界面加载

第三方 WebUI 模块随插件启用自动加载。打开停用插件的配置弹窗时，也会按需加载它的模块，以便使用自己的配置编辑器或设置页。模块加载失败时，配置弹窗回退到通用表单。

卸载插件或删除它的 WebUI 入口后，模块注册的页面、插槽、编辑器和字段控件会被移除。

界面布局偏好保存在 Bot 实例的 `plugins.json` 中，同一实例的不同浏览器共享这些设置。页面排序和插槽显示偏好的入口分别见[页面布局与侧边栏](#页面布局与侧边栏)和[插槽](#插槽)。

## 页面布局与侧边栏

`page.id` 在包内唯一，实际地址为 `#<包名>:<id>`。`ctx.pageHref(id, { fullscreen: true })` 生成不带侧边栏及标题的独立页面地址；组件用 `usePageView().fullscreen` 判断布局。`header` 是宽屏页面上方的标题区域，插件未运行时不渲染。

侧边栏的 `order` 从小到大排列，默认 `100`；同位置按插件名排序。常用参考位置如下：

| 页面 | `order` |
|---|---|
| Dashboard | `0` |
| NTQQ | `5` |
| 适配器及其他协议设置 | `10`–`14` |
| 日志 | `20` |
| 插件 | `40` |
| WebQQ | `50` |
| WebUI 设置 | `900` |
| 关于 | `1000` |

用户在 **WebUI 设置 → 侧边栏** 中调整顺序和隐藏，用户设置的位置优先于插件的 `order`。隐藏不阻止通过页面地址或配置弹窗打开页面；没有指定 hash 时，打开侧边栏第一项。

第三方插件卡片的齿轮始终打开配置弹窗，生效范围和已有实例都在这里管理。注册设置页后，弹窗中的自动表单换成「打开设置页」。内置插件的齿轮可直接跳到自己的设置页。

WebUI 自身是内置插件 `builtin:webui`。主题、侧边栏、监听地址和端口、访问密码、退出入口都在侧边栏的 `#webui` 页面，WebUI 插件卡片的齿轮也跳到这里。侧边栏隐藏该页面后，仍可从插件卡片打开。插件自己的设置则放在它的卡片和页面中。

## 前端 SDK

从 `@luckylillia/plugin-sdk/webui` 导入以下 Hook 和组件，完整类型见 [webui.ts](../packages/plugin-sdk/src/webui.ts)。

**读取状态和控制布局：**

| `Hook` | 返回内容 |
|---|---|
| `usePluginContext()` | 当前插件的前端 `WebUIContext` |
| `usePluginStatus()` | 当前包第一个条目的 `disabled`、`state`、`error`、`notice` 等；未加载时为 `undefined` |
| `usePlugins()` | WebUI 列出的全部条目；未加载时为 `null` |
| `useBots()` | 账号的 `sid`、`platform`、`selfId`、`status`、`name`、`avatar`；未加载时为 `null`，宿主约每 5 秒更新 |
| `usePluginConfig()` | 配置草稿、schema、错误和保存操作 |
| `usePageView()` | 当前页面是否以 `fullscreen` 模式打开 |
| `useSidebar()` | 侧边栏的 `collapsed` 状态和 `setCollapsed` |
| `useSlotMatches(name)` | `keyed` 插槽当前可用的键 |

**复用界面组件：**

| 组件 | 用途 |
|---|---|
| `SchemaForm` | 自动表单，可用 `fields` 限定顶层字段 |
| `SchemaSettings` | 包含插件标题、说明、表单和保存按钮的设置页 |
| `SelectInput` | 统一样式的下拉框 |
| `HostInput` | 监听地址输入，与 `role('host')` 相同 |
| `PathInput` | Bot 所在机器的路径输入及浏览 |
| `DurationInput` | 以天、时、分、秒编辑时长，保存单位为秒 |
| `StatusNotice` | 插件页顶部提示，可带 `action` 和本插件的目标 `page` |
| `Slot` | 渲染已声明的插槽 |
| `Icon` | 显示支持的 lucide 图标，接受 `name`、`size`、`className` |
| `Lightbox` | 图片放大查看，支持左右键、Esc 关闭及加载失败提示 |

`StatusNotice` 放在插件自己的页面，宿主没有插件专用的全局提示栏。`Lightbox` 接受 `images`（`{ url, caption? }[]`）、`index`、`onIndex` 和 `onClose`。表单组件的参数见下一节。

## 自定义配置与字段

### 选择配置界面

| 需求 | 用法 | 保存由谁负责 |
|---|---|---|
| 直接使用完整设置页 | `ctx.page({ ..., component: SchemaSettings, settings: true })` | `SchemaSettings` |
| 自己编写设置页 | 页面组件调用 `usePluginConfig()` | 页面调用 `config.save()` |
| 替换配置弹窗里的表单 | `ctx.config(Editor)` | 宿主配置弹窗 |
| 只替换某一类字段控件 | `ctx.field(role, Field)` | 所在的表单或页面 |

`SchemaSettings` 支持以下参数：

- `fields`：只显示指定的顶层字段。
- `sections: [{ title, fields, collapsed?, description? }]`：按组显示字段。`description` 是标题旁的说明文字，折叠后仍可见。
- `links: [{ label, href }]`：标题旁的链接。
- `children`：表单下方的内容，可以是节点，也可以是接收配置状态的函数。

### 自己编写设置页

`usePluginConfig<T>()` 返回 `value`（加载前为 `null`）、`setValue`、`schema`、`error`、`errors`、`saving`、`save` 和 `clearSecret`。`setValue()` 只修改草稿，调用 `save()` 才提交：

```tsx
import { usePluginConfig } from '@luckylillia/plugin-sdk/webui'

export function SettingsPage() {
  const config = usePluginConfig<{ greeting: string }>()
  if (config.value === null) return <p>{config.error || '正在读取配置…'}</p>
  return <div>
    <input className="input-field" value={config.value.greeting}
      onChange={event => config.setValue({ greeting: event.target.value })} />
    {config.errors.greeting && <p>{config.errors.greeting}</p>}
    <button type="button" className="btn-primary" disabled={config.saving}
      onClick={() => void config.save()}>保存</button>
  </div>
}
```

保存成功后，后端以新配置重启；失败时显示 toast 或字段错误。发生 revision 冲突时重新加载配置，避免覆盖其他位置刚保存的内容。

`ctx.config(Editor)` 注册的是**配置弹窗内部**的编辑器，接收 `{ value, onChange, schema, defaults, errors }`。编辑器只负责编辑并调用 `onChange()`，保存由弹窗完成。`value` 已补默认值，错误以 `a.b` 路径为键，根路径是 `''`。使用自定义界面时，仍建议导出后端 `Config` 做校验。

### 常用输入组件

- `SelectInput`：`options` 为 `{ value, label }[]`，使用 `===` 比较选项值。`placeholder` 默认是「请选择」，`className` 加在按钮上。下拉框使用该组件，避免原生 `<select>` 的系统菜单样式。
- `PathInput`：`select: 'directory'` 选目录，默认选文件；`accept: ['.exe']` 限定扩展名，弹窗仍允许显示所有文件；`start` 指定值为空时的初始路径。它调用受保护的 `/api/fs/list`，只列 Bot 所在机器上的文件名。浏览器自身的文件对话框指向浏览器所在机器，不能代替该组件。
- `DurationInput`：`maxDays` 默认 `1`，设为 `0` 去掉天数；`showSeconds: false` 隐藏秒。它保存的单位是**秒**，而 schema 的 `role('ms')` 保存**毫秒**，使用时需要换算。

### 自定义字段控件

下面的控件对应后端的 `Schema.string().role('color')`：

```tsx
import type { FieldProps, WebUIContext } from '@luckylillia/plugin-sdk/webui'

function ColorField({ value, onChange, error }: FieldProps<string>) {
  return <label>
    <input type="color" value={value} onChange={event => onChange(event.target.value)} />
    {error && <span>{error}</span>}
  </label>
}

export default function apply(ctx: WebUIContext) {
  ctx.field('color', ColorField)
}
```

`FieldProps` 还提供 `meta`，包含 `description`、`default`、`role` 选项等。控件会影响所有使用该 `role` 的字段，命名应明确；内置的 `ms`、`table`、`radio`、`checkbox`、`secret`、`slider`、`textarea`、`host` 不能被覆盖。

## 主题与受管样式

主题也是第三方插件：`llbot.category` 写 `theme`，用 `llbot.webui` 指向浏览器入口，后端可以只是空的 `apply()`，不需要依赖 QQ。完整的免构建示例在 `test/fixtures/plugins/theme/`，包含两套主题、亮暗配色、背景图片和界面扩展。

```js
export default function apply(ctx) {
  ctx.theme.register({
    id: 'ocean', title: '海洋', description: '青蓝色界面',
    light: { tokens: { '--accent': '#0891b2', '--r-card': '12px' }, background: '#e8f7ff' },
    dark: { tokens: { '--accent': '#38bdf8', '--r-card': '12px' }, background: '#102030' },
  })
}
```

用户在「页面设置 → 主题与外观」选择主题，亮色、暗色、跟随系统独立控制。主题完整键为 `<包名>|<id>`，选择与模式保存在当前浏览器的 `llbot-theme` 中，兼容原来只有 `mode` 的记录。插件尚在加载、停用、失败或卸载时立即回退默认主题，保留选择，重新启用后恢复。同包存在多个实例时，只要有一个实例运行就生效。

`tokens` 是 CSS 自定义属性表，两种模式均需提供（可以为空）。优先使用宿主语义变量：`--accent` / `--accent-strong` / `--accent-from` / `--accent-to` / `--accent-soft`、`--text-primary` / `--text-secondary` / `--text-muted` / `--text-hint`、`--r-card` / `--r-panel` / `--r-control`、`--font-ui`、`--glass-tint`（RGB 三元组）、`--glass-alpha-card` / `--glass-alpha-regular` / `--glass-blur-regular`。全部变量见 WebUI 的 `styles/tokens.css`。未覆盖的变量继续使用宿主值；令牌同时作用于根节点、portal 弹框和玻璃材质的亮暗局部区域。

`background` 是 CSS background 简写，可用渐变、纯色或 `url()`。填写后替换默认动态壁纸，玻璃材质使用当前亮暗模式；不填则继续使用宿主的动态背景和亮度采样。图片可用 `ctx.asset('images/wallpaper.webp')`，相对于入口模块所在目录解析，不能越出该目录。文件须包含在 npm 包中，由已登录的 `/plugin-webui` 路由提供。

需要更大幅度改外观时，定义可带 `css` 字符串，只在选中该主题且插件运行时安装。根节点的 `data-llbot-theme` 是实际生效主题键，可用于限定选择器。组件自己的样式用 `ctx.style('组件样式ID', css)` 注册：随插件运行状态安装或移除，不随主题选择改变；同 ID 更新替换上一份，旧的清理函数不会误删新样式。宿主不扫描插件的任意 Tailwind 类，也不自动限定 CSS 选择器，普通组件样式请自行使用类名前缀。

对于 Tailwind 等通用工具类，使用 `ctx.style('utilities', css, { scope: 'plugin', when: 'loaded' })`：宿主用 CSS `@scope` 限制到本插件的组件，不会让 `.flex`、`.grid-cols-1` 覆盖外壳的响应式规则。宿主为组件提供 `data-plugin-ui` 根节点，import map 的 `react-dom.createPortal` 也会带上同一作用域；默认 `:root,:host` 的工具类令牌转换为局部 `:scope`。`when: 'loaded'` 仅允许搭配插件作用域，用于停用时仍需显示的配置页面，模块卸载后才撤销。普通全局受管样式默认 `when: 'active'`，随停用立即撤销。需要浏览器支持 CSS `@scope`。

`ctx.theme.overrideTokens('覆盖层ID', { light: {...}, dark: {...} })` 提供可撤销的全局令牌覆盖层：运行中的插件按注册顺序覆盖，后注册者优先，删除后恢复下层。同插件的同 ID 替换旧层。它独立于主题选择，因此只想随某个主题使用的颜色应写在主题定义里。

以上注册方法均返回 disposer，模块卸载、替换或 apply 抛错时也由宿主统一清理。不要用模块顶层插入 `<style>` 改主题：停用插件时宿主可能保留模块供配置页面使用，只有受管样式才会立即撤销。

组件从 SDK 调用 `useTheme()` 获取响应式 `{ mode, isDark, selected, active, background, themes, select, setMode }`；`select(key)` 使用完整主题键或 `default`，`setMode()` 接受 `light` / `dark` / `auto`。入口可用 `ctx.theme.get()` 取快照，`ctx.theme.select(id)` 选择本插件的主题或 `default`，通常应交给用户在设置页选择。

主题的专属选项注册到 `settings.appearance`，无需另建设置页或侧边栏条目。宿主只显示当前生效主题所属插件的贡献，统一包在默认折叠的「主题设置」中，切换主题后重新折叠。未注册选项或组件返回 `null` 时不显示该折叠项。主题选择和亮暗切换由 WebUI「页面设置 → 主题与外观」提供，不必重复实现。

## 插槽

插槽是界面所有者显式开放的扩展位置。插件可以往插槽中注册组件，称为一项「贡献」。例如，下面的入口为 Dashboard 增加一张账号状态卡片：

```js
import { createElement } from 'react'
import { useBots } from '@luckylillia/plugin-sdk/webui'

function OnlineCount() {
  const bots = useBots()
  return createElement('p', null, '在线账号：' + (bots?.filter(bot => bot.status === 1).length ?? 0))
}

/** @param {import('@luckylillia/plugin-sdk/webui').WebUIContext} ctx */
export default function apply(ctx) {
  ctx.slot('dashboard.cards', {
    id: 'online-count', title: '账号状态', icon: 'users',
    size: 'normal', order: 100, component: OnlineCount,
  })
}
```

### 显示方式与可用位置

插槽的「基数」决定如何处理多个贡献，以及能否替换或包装原内容：

| 基数 | 行为 | 贡献参数 |
|---|---|---|
| `list` | 所有贡献按顺序显示 | `order` 小的在前 |
| `single` | 只显示优先级最高者，无贡献时显示默认内容 | `priority` 大的优先 |
| `keyed` | 为当前渲染的键选择一个贡献 | `match` 指定键，`priority` 决定优先级 |
| `chain` | 层层包装，排前面的在外层 | 按 `order` 排序，组件接收 `next` |
| `hoc` | 层层包装，排前面的在外层，报错时透传内部内容 | 按 `order` 排序，组件接收 `children`；可用 `match` 限定页面键 |

| 插槽 | 基数 | 组件收到的 props | 选项及外框 |
|---|---|---|---|
| `sidebar.header` / `sidebar.footer` | `list` | 无 | 侧边栏顶部 / 账号卡上方 |
| `page.header.actions` | `list` | `{ page: { key, owner, title, fullscreen } }` | 桌面标题右侧、移动端顶栏；全屏页面不绘制顶栏 |
| `page.content` | `hoc` | `{ page, children }` | 页面外框，可用 `match` 指定页面键；核心锁定页面不参与 |
| `settings.appearance` | `list` | 无 | 当前生效主题所属插件的专属选项；默认折叠的「主题设置」，无内容时隐藏 |
| `settings.sections` | `list` | 无 | 页面设置的附加卡片，选项 `title` 由宿主绘制 |
| `plugins.toolbar` | `list` | 无 | 统一插件页筛选栏的附加工具按钮 |
| `plugins.views` | `list` | `PluginsViewProps`：`{ configAction, showDetails }` | 必需 `title`，以紧凑工具按钮打开独立视图，可返回统一列表 |
| `plugins.catalog` | `list` | `PluginCatalogProps`：`{ loadCatalog, onChange }` | 提供目录数据和包操作，组件不绘制界面 |
| `plugins.install` | `list` | `{ onInstalled }` | 宿主本地安装弹框内的上传控件 |
| `plugins.card.actions` | `list` | `{ plugin }` | 每张卡片的附加按钮，组件自行筛选目标 |
| `dashboard.cards` | `list` | 无 | `title`、`icon`、`size`；Dashboard 绘制卡片和标题 |
| `dashboard.header` | `single` | 无 | 替换 Dashboard 标题 |
| `webqq.chat.actions` | `list` | `{ chat }` | `chat` 含 `chatType`、`peerId`、`name` |
| `webqq.message.element` | `keyed` | `{ element, message? }` | `match` 为 NT 元素类型字符串；引用预览可能没有 `message` |
| `webqq.message.bubble` | `chain` | `{ message, next }` | 包装整个消息气泡 |

Dashboard 的 `size` 可为 `normal`、`wide`、`full`，约占三分之一、三分之二或整行；同行剩余空间按比例分配。卡片和标题由 Dashboard 绘制，贡献组件只画内部内容。插件管理页只开放追加位置，没有替换管理功能的入口。

`plugins.catalog` 为统一插件列表提供数据，组件返回 `null`。`loadCatalog` 仅在用户浏览「未安装」或「全部插件」时为真；提供者应按需获取目录，在 effect 中调用 `onChange(state)` 发布 `PluginCatalogState`，卸载时调用 `onChange(null)`。快照包含目录 `items`、已安装包 `installed`、更新信息 `updates`、各自的加载/错误状态、`busy`，以及 `retry()`、`refresh()`、`install(name, version)`、`update(name)`、`uninstall(name, options?: { keepConfig?: boolean })`；三个包操作返回 `Promise<boolean>`。宿主卸载弹框默认勾选「保留配置」，确认时显式传入 `keepConfig`；省略该选项按 `false` 处理。`PluginCatalogItem` 继承详情元数据，另含精确 `version`、可选 `category`、`repository` 和内置条目名 `builtin`。宿主负责合并本地条目、包与目录、去除重复包、筛选、分页、卡片和详情；默认已安装列表不等待目录网络。

`plugins.install` 的组件始终显示在「本地安装」弹框的真实目录与扫描按钮下方，不再使用上传/扫描标签切换。成功后调用 `onInstalled()`，由宿主刷新列表、清空全部筛选并回到「已安装」。实际目录由宿主接口读取，扫描也由宿主提供；市场停用时仍可查看目录和扫描。

`plugins.views` 的 `configAction(id)` 接收插件条目 ID，返回 `{ open(): void; label: string }` 或 `undefined`。可以从 `usePlugins()` 取得条目，使用返回的 `label` 绘制按钮，点击时调用 `open()`，由宿主打开与插件列表齿轮相同的配置弹框或设置页；没有动作时隐藏按钮。同包多实例应先让用户选择条目 ID，不能把 npm 包名当作 ID。`PluginsViewProps` 类型从 `@luckylillia/plugin-sdk/webui` 导入。

`showDetails(source)` 打开与插件列表 Info 相同的详情弹框，也可展示未安装的包。`source` 使用 SDK 的 `PluginDetailsSource`：必填 `name`、`title`，可选 `version`、`description`、`author`、`icon`、`iconUrl`、`screenshots` 和异步 `load()`。`title` 和作者等信息固定在弹框顶部，不随正文滚动；其下始终先显示 `description` 简介，再显示截图。简介立即展示，不等待详情加载。不提供 `load()` 时直接复用已有元数据，未安装卡片使用目录中的内容，不显示加载动画。需要另行读取详情时，`load()` 返回 `PluginDetailsContent`：`{ markdown?, base, screenshots }`，其中 `base` 是 Markdown 相对图片路径的 URL 基准目录，带结尾斜杠；无 Markdown 时可用空字符串。宿主负责异步加载状态、失败提示与重试，以及图片放大；非空 Markdown 保留在截图之后默认折叠的「完整说明」中，用户点击展开，不替换简介。若 Markdown 的第一个内容块是一级标题，详情中省略该块，避免重复显示主标题；后续标题和其他内容保留。

`PluginMetaRow` 从 `@luckylillia/plugin-sdk/webui` 导入，可复用宿主卡片的元数据行。必填 `title`，可选 `category`、`author: { name, url? }`、`packageName`、`repository`、`className`；分类使用 `llbot.category` 的分类值，缺省显示「其他」，省略包名或仓库地址则隐藏对应链接。通过 `children` 添加紧跟包/仓库链接的内容，例如 Info 按钮；链接与附加内容组成不拆行的一组。组件只展示传入的数据，不发起请求。

### 贡献的标识、顺序与错误处理

- `id` 必填，在本插件的同一插槽中唯一，版本间应保持稳定。
- `label` 用于错误提示，默认取 `title`，其次取 `id`。
- `order` 默认 `100`，`priority` 默认 `0`。
- `keyed` 必须填写 `match`，例如 WebQQ 的 markdown 元素是 `'14'`。

`chain` 组件不修改内容时返回 `next`，修改时包装或替换它；出错的层会被跳过。普通贡献有独立的错误边界和重试入口。组件返回 `null` 时，外框也不显示。插槽未声明、声明方或贡献方没运行时，贡献不会显示。

Dashboard 已为 `dashboard.cards` 开启卡片管理：点击 Dashboard 插件卡片的齿轮，即可调整卡片顺序、显示开关或恢复默认。点击保存后写入实例的界面偏好并立即生效，取消不保存；这些操作只影响显示，不改变贡献插件的运行状态。自己的插槽如何提供这一入口，见下一节。

### WebQQ 提供的数据

WebQQ 插槽的 props 使用以下专用数据结构，不是后端 `Session`：

| 类型 | 内容 |
|---|---|
| `WebQQChat` | `chatType`：`1` 私聊、`2` 群、`100` 临时会话；`peerId` 是好友或群 ID，另有 `name` |
| `WebQQMessage` | `msgId`、`msgSeq`、`chatType`、`peerId`、`senderUin`、`senderName`、`time`、`text`、`self`；`time` 的单位是秒 |
| `WebQQElement` | 保留原始 `elementType` 及对应的 NT 字段 |

## 声明自己的插槽

希望其他插件扩展自己的页面时，使用 `<插件>.<位置>` 命名插槽，向 `SlotMap` 合并类型，并在页面中用 `Slot` 渲染：

```tsx
import { Slot, type WebUIContext } from '@luckylillia/plugin-sdk/webui'

interface Item { id: string; title: string }

declare module '@luckylillia/plugin-sdk/webui' {
  interface SlotMap {
    'my-plugin.item.actions': { props: { item: Item }; options: {} }
  }
}

function ItemPage() {
  const item = { id: 'demo', title: '示例条目' }
  return <div>
    <span>{item.title}</span>
    <Slot name="my-plugin.item.actions" props={{ item }} />
  </div>
}

export default function apply(ctx: WebUIContext) {
  ctx.declareSlot('my-plugin.item.actions', {
    title: '条目按钮', description: '每个条目旁的按钮', cardinality: 'list',
  })
  ctx.page({ id: 'items', title: '条目', component: ItemPage })
}
```

`Slot` 的显示选项：

- `children`：提供默认内容。
- `wrap(element, { id, plugin, options })`：绘制每项贡献的外框；`chain` 不使用 `wrap`。
- `match`：渲染 `keyed` 插槽时指定当前键。
- `props`：传给贡献组件的数据。`chain` 的 props 类型包含 `next: unknown`，但渲染 `Slot` 时不必传入 `next`。

`useSlotMatches(name)` 列出 `keyed` 插槽当前有贡献的键。每项贡献使用来源插件的前端上下文，并有独立的错误边界。

声明 `list` 插槽时，可以设置 `configurable: true`。宿主会在**声明者的插件配置弹窗**中提供该插槽的排序、显示开关和恢复默认；保存后立即生效，不改变插件运行状态。未开启该选项的插槽没有逐项管理入口。

## 后端接口与鉴权

前端需要读取业务数据或执行操作时，在后端注入 `webuiServer`，用带 `fetch` 方法的对象注册 HTTP 接口：

```ts
import { Context } from '@luckylillia/plugin-sdk'

export const inject = ['webuiServer']

export function apply(ctx: Context) {
  ctx.webuiServer.route('/api/my-plugin', {
    fetch(request) {
      const url = new URL(request.url)
      if (url.pathname !== '/api/my-plugin/stats' || request.method !== 'GET') {
        return Response.json({ success: false, message: 'not found' }, { status: 404 })
      }
      return Response.json({ success: true, data: { count: 42 } })
    },
  })
}
```

处理函数接收完整 URL。使用 Hono 时应设置 `basePath('/api/my-plugin')`，或通过 `route(prefix, app)` 匹配完整路径。路由随插件卸载，也可调用注册时返回的函数提前移除。

`/api/` 下的接口自动受 WebUI 登录保护。提供 webhook 时，用 `{ public: true }` 挂到 `/api/` **之外**，例如 `/my-plugin/webhook`；签名、密钥和业务授权由插件检查。

在 React 组件中调用 `usePluginContext()`，即可使用以下前端 API 访问后端：

| API | 用途 |
|---|---|
| `ctx.api<T>(path, { method?, body? })` | 携带 WebUI 登录，返回响应 `{ success, data }` 中的 `data` |
| `ctx.fetch(path, init?)` | 携带登录的原始 `fetch`，用于二进制、上传、流和自定义错误 |
| `ctx.authUrl(path)` | 为图片、视频、下载等不能设置请求头的位置生成带鉴权 URL |
| `ctx.events(path, listeners)` | 订阅 SSE，按事件名回调，返回关闭函数 |
| `ctx.toast(message, type?)` | 显示 `success`、`error` 或 `warning` 提示，默认 `success` |
| `ctx.pageHref(id, options?)` | 生成本插件页面的 URL |

路由自己返回的 `401` 或 `403` 会传给调用方；只有 WebUI 的鉴权拒绝才触发登录流程。组件创建的订阅应在 `useEffect` 的清理函数中关闭，模块卸载时也会关闭 SDK 登记的 SSE。

## 打包、样式和文件边界

### 共享依赖与构建

宿主通过 import map 提供 `react`、`react/jsx-runtime`、`react-dom` 和 `@luckylillia/plugin-sdk/webui`。打包时四者必须设为 `external`，避免混入另一份 React 导致 Hook 错误；其他依赖可以打包：

```ts
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'webui',
    lib: { entry: 'client/index.tsx', formats: ['es'], fileName: () => 'index.js' },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', 'react-dom', '@luckylillia/plugin-sdk/webui'],
    },
  },
})
```

TSX 工程还需要 React 类型和 JSX 编译配置，例如 `jsx: 'react-jsx'`。前后端可以使用独立的 `tsconfig`。简单模块可以使用 `createElement` 免构建；需要代码拆分时可用 `React.lazy`，宿主已提供 `Suspense`。

`llbot.webui` 入口所在的**整个目录及子目录**都会提供给已登录 WebUI 的浏览器。前端产物独立放在 `webui` 中，不与后端代码、数据、密钥混放。

### 样式与资源清理

可复用宿主的语义 class：`card`、`btn-primary`、`btn-glass`、`input-field`、`switch-toggle`、`text-theme`、`text-theme-secondary`、`text-theme-muted`、`text-theme-hint`。颜色可用 `var(--accent)` 等主题变量。宿主 Tailwind 不扫描插件源码，不保证任意工具类存在；其他布局使用 `style` 或局部 CSS。

只在自身页面和已声明的插槽中绘制，不修改宿主 DOM 或注入全局样式。弹层可 portal 到 `body`，但需完整清理。优先复用 `useBots()` 和 `usePlugins()`；自有轮询通常不快于 5 秒，多组件共享数据时共用请求。

前端入口允许返回清理函数。重载时会撤销旧注册并重新导入，无需刷新页面；入口抛错时，本次注册回滚。渲染错误只影响对应区域，并在插件卡片中显示，用户可重试。模块导入失败时，配置弹窗回退到自动表单。

### 在宿主中验证

至少检查启用后的自动加载、配置保存、后端未运行时的设置页、错误提示、停用和热重载。

这些都不需要登录 QQ：没有安装 NTQQ 协议时，宿主、WebUI 和插件管理照常运行。用 `npm run dev -- --plugin-dir <插件目录> --plugin-hmr` 启动源码 Bot，打开 WebUI 启用插件即可。需要账号数据的界面，用浏览器拦截对应接口返回 mock 数据，不要为了测界面使用真实账号凭证。
