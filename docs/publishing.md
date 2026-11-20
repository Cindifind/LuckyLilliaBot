# 打包与发布

先检查包清单和产物，再发布到 npm，并按需要登记到插件市场。

## 包结构

一个插件包同时包含清单、后端产物，以及可选的 WebUI 和介绍素材：

```text
my-plugin/
  package.json
  src/index.ts
  lib/index.js
  test/index.test.ts
  tsconfig.json
  vitest.config.ts
  client/index.tsx     可选：WebUI 源码
  webui/index.js       可选：WebUI 产物
  assets/icon.png      可选：图标和演示图片
  docs/details.md      可选：WebUI 介绍
```

### 插件清单

在 `package.json` 中添加 `llbot` 字段，宿主才会将这个 npm 包识别为插件。下面是完整示例，未使用的字段可以省略：

```json
{
  "name": "luckylillia-plugin-my-plugin",
  "version": "0.1.0",
  "description": "问候和消息处理示例",
  "author": { "name": "作者", "url": "https://example.com" },
  "type": "module",
  "main": "lib/index.js",
  "files": ["lib", "webui", "assets", "docs"],
  "keywords": ["luckylillia-plugin"],
  "peerDependencies": { "@luckylillia/plugin-sdk": "^1.0.0" },
  "llbot": {
    "title": { "zh": "问候示例", "en": "Greeting example" },
    "description": "演示配置、指令和跨平台消息",
    "category": "chat",
    "icon": "assets/icon.png",
    "details": "docs/details.md",
    "screenshots": [{ "src": "assets/demo.png", "caption": "群聊中的效果" }],
    "preview": false,
    "hidden": false,
    "service": { "required": ["bots", "commands"] },
    "webui": "webui/index.js"
  }
}
```

填写时区分 npm 包信息和 `llbot` 的宿主约定：

- `name` 使用合法的 npm 包名。脚手架默认生成 `luckylillia-plugin-*`，也可使用 npm scope，例如 `@luckylillia/plugin-aiprovider`。
- `main` 或 `exports["."]` 指向后端入口。ESM 的 `.js` 文件需要 `"type": "module"`。
- SDK 的 `peerDependencies` 用于兼容性检查。插件包依赖和服务依赖的声明见[依赖与提供的服务](basics.md#依赖与提供的服务)。
- `llbot.hidden` 从 WebUI 列表隐藏条目，`llbot.preview` 显示开发中标记，两者都不是权限设置。

### 分类

`llbot.category` 决定安装后的插件在 WebUI「插件列表」中的分类：

| 值 | WebUI 分类 | 用途 |
|---|---|---|
| `protocol` | 协议端 | 登录平台、注册 Bot 的消息源 |
| `adapter` | 适配器 | 对外提供 OneBot、Satori、Milky 等协议 |
| `chat` | 消息互动 | 自动回复、复读、游戏 |
| `tool` | 工具 | 通知、黑名单、独立工具 |
| `service` | 依赖组件 | 为其它插件提供共享服务 |
| `theme` | 主题 | WebUI 配色、背景和界面样式 |
| `other` | 其他 | 其它或未指定分类 |

分类按表中顺序显示。未知值记录警告并归入「其他」，插件仍可加载。

市场使用登记时选择并保存在目录中的 `category`，分类值和顺序与上表一致。统一插件列表支持分类筛选，卡片显示分类标签；旧目录未填写分类时归入「其他」。目录中的未知分类会使目录校验失败，建议登记选择与包内 `llbot.category` 保持一致。

### 名字、作者、图标和详情

#### 名字与作者

`llbot.title` 是卡片、配置弹窗和详情中显示的名字，支持字符串或语言映射，WebUI 使用中文。未设置时取去掉插件前缀的包名。

`llbot.description` 可以直接填写字符串，例如 `"description": "自动回复消息"`，脚手架默认使用这种写法。需要多语言时，也支持 `{ "zh": "自动回复消息", "en": "Auto-reply to messages" }`。未填写时使用包顶层的 `description`。

包顶层的 `author` 支持 npm 的字符串 `名字 <邮箱> (https://主页)`，也支持对象 `{ name, email, url }`。作者显示在卡片元数据行和详情中，仅为 HTTP(S) URL 生成链接。卡片上的仓库链接来自包顶层的 `repository`。

#### 图标与详情素材

| 字段 | 支持的内容 | 显示方式 |
|---|---|---|
| `llbot.icon` | 支持的 lucide 图标名，或包内 `.png`、`.jpg`、`.jpeg`、`.gif`、`.webp`、`.svg` 图片 | 建议图片为正方形、至少 96px；裁切填满圆角方块，插件未运行时变灰 |
| `llbot.details` | 包内 Markdown 路径 | 在详情的「完整说明」中展示，默认折叠；Info 入口不依赖此字段 |
| `llbot.screenshots` | 路径或 `{ src, caption }` 组成的数组 | 在简介之后显示演示图片及其说明；图片可放大查看，Markdown 位于其后的「完整说明」中，默认折叠 |

详情 Markdown 支持标题、段落、列表、表格、代码、引用和图片，保留段落内换行，不执行 HTML。链接支持 HTTP(S) 和 `mailto`；图片支持相对 Markdown 的包内路径及 HTTP(S) URL。

详情弹框依次显示 `llbot.title`、`description` 简介、截图，以及默认折叠的「完整说明」（`llbot.details` 的内容）。Markdown 的第一个内容块是一级标题时，详情中省略它，避免与主标题重复。未安装的插件只展示市场目录里的简介和截图，不读取远端 README。

素材必须已经存在于包中，路径不能越界。文件缺失或类型错误会记录警告并忽略该项。发布时将素材目录加入 `files`。安装前的市场展示还有独立字段，见[市场图标和预览图](#市场图标和预览图)。

修改清单或图片后需要重新扫描；详情 Markdown 在下次打开详情时重新读取。图片经 `/plugin-assets/` 提供，需要 WebUI 登录。

#### 可用图标名

`llbot.icon` 可使用下列图标名；未知名字回退为拼图图标：

```text
bell              book            book-open       bot         brain       calendar    clock
cloud             code            cpu             database    dice-5      file-text   gamepad-2
gift              globe           hand            heart       image       info        languages
layout-dashboard  mail            message-square  messages-square  milk    music       network     puzzle
radio             repeat          scroll-text     search      send        settings    shield-ban
sliders           smartphone      smile           sparkles    star        store       terminal
timer             trophy          users           wrench      zap
```

## 构建

### 后端

模板使用 `tsc`，将 `src` 编译到 `lib`。保持 `moduleResolution: Bundler`：当前 cordis 声明中有不带后缀的相对导入，`NodeNext` 可能造成类型解析不完整。

自己的相对导入仍写 `.js`，例如 `import { format } from './format.js'`。TypeScript 会定位到 `format.ts`，生成的 Node ESM 也能正常解析；`Bundler` 模式不会替产物补扩展名。

使用打包工具时，下列共享包及其子路径必须设为 `external`：

```text
@luckylillia/plugin-sdk
cordis
cosmokit
schemastery
@standard-schema/spec
@satorijs/element
@satorijs/protocol
```

宿主将这些导入统一解析到自身副本。打入另一份 `Context`、`Service` 或元素运行时会破坏注入和对象身份，也可能被宿主拒绝。其它第三方依赖可打包，或声明在 `dependencies` 中供安装器安装。

浏览器模块有另一组 `external`，见[打包、样式和文件边界](webui.md#打包样式和文件边界)。有独立前端构建时，将其命令加入插件的 `build` 脚本，避免只发布旧的 WebUI 产物。

### 检查发布产物

在插件目录执行：

```sh
npm test
npm run build
npm pack --dry-run
```

检查打包列表，确认后端和前端入口存在，`files` 包含实际使用的 `lib`、`webui`、`assets`、`docs`，且没有带入用户数据或凭证。

发布前还应在干净目录验证完整产物，特别是 ESM 导入、动态模块、静态资源和浏览器子模块。开发机已经执行过依赖安装脚本，不代表市场安装后能直接运行；安装器的限制见[市场兼容性](#市场兼容性)。

## 发布

### 发布到 npm 和插件市场

插件可作为 npm 包通过 `npm publish` 发布，公共 scoped 包需相应公开发布设置。模板里的 `luckylillia-plugin` keyword 可保留，但不是市场收录条件。

默认市场从 npm 包 `@luckylillia/market` 读取目录。要让插件出现在 Bot 的市场中：

1. 完成[产物检查](#检查发布产物)，将插件发布到 npm。
2. 到 [LuckyLillia.Market](https://github.com/LuckyLilliaDev/LuckyLillia.Market) 创建「注册插件」Issue，提交 npm 包名并选择插件分类。分类选项与上文 `llbot.category` 的七个值一致；目录按登记选择保存 `category`，自动更新版本时保留，建议与包内声明保持一致。登记检查会从发布包读取 `llbot`、标题、简介、作者和公开 GitHub 仓库地址。
3. 检查通过后生成登记 PR。维护者合并并发布目录包后，用户才能在 Bot 市场中搜索到插件。

目录的 `plugins.json` 统一保存展示信息和通过检查的精确版本，每个插件条目的 `version` 必须是完整版本号，不能填写 `latest` 或版本范围。Bot 不再读取旧的 `versions.json`。更新插件时也要推进目录版本；只发布新的 npm 版本不会让 Bot 提示更新。

### 市场图标和预览图

市场目录中的 `icon` 和 `screenshots` 用于安装前浏览，都是可选字段，接受包内图片相对路径或 HTTP(S) 地址。`screenshots` 的格式与 `llbot.screenshots` 相同，支持路径或 `{ src, caption }` 对象组成的数组。

登记时，`LuckyLillia.Market` 将 npm 发布版本的 `llbot.icon`、`llbot.screenshots` 路径原样保存到目录。作者需在 `package.json.llbot.icon` 和注册 Issue 的 icon 栏填写一致的图标信息。

使用包内图片时，目录只保存路径，不包含图片文件。Bot 按插件包名和目录的精确版本拼接 jsDelivr 地址，并对文件名各段编码，因此图片必须包含在对应 npm 版本的发布产物中。

没有图片时可以省略字段，也可填写 `icon: ""`、`screenshots: []`。图标缺省或加载失败时显示默认图标；旧目录的 `examples` URL 数组仍兼容。

### 市场兼容性

#### 目录与版本

从市场目录安装时只用目录指定的精确版本，并校验 SDK 的 `peerDependencies`。目录版本需要更高 Bot 能力时会说明，不强行加载，也不回退 npm 历史版本。

从目录安装的插件和自动补装的插件依赖，都必须位于用户配置的市场目录中，且包内有 `llbot` 清单。只有 npm 下载地址不能绕过目录。安装期间使用同一份目录快照；界面提交的版本与刷新后的目录不一致时，需要刷新后重新操作。本地压缩包的主包不要求收录，见下面的「从本地压缩包安装」。

#### npm 源与镜像

「插件市场」设置中的 npm 源默认是 `https://registry.npmmirror.com`，备用镜像源默认是 `https://registry.npmjs.org`，可以添加多个。读取目录、插件和依赖时先用 npm 源，连不上、出错或还没同步到需要的版本时按顺序改用备用镜像源；连不上的源 5 分钟内排到最后再试。下载的文件始终按包元数据中的完整性校验值核对，不同镜像不能替换包内容。

发布新版本后，镜像通常要几分钟才能同步。只要备用镜像源中有 npm 官方源，用户在镜像同步前也能安装或更新到目录指定的版本。

#### 插件包依赖

`llbot.dependencies` 使用完整 npm 包名和 semver 范围，声明要独立安装的插件。它只接受插件包名和版本范围，不接受 Git、文件路径、URL 或 npm 别名。具体填写方式见[声明插件包依赖](basics.md#声明插件包依赖)。

安装器先检查整棵插件依赖树，再安装缺少的包：

- 先复用已扫描到且版本兼容的插件包，包括本地开发的目录联接，并递归检查它们声明的依赖。
- 缺少的包必须能在配置的市场目录中按完整包名找到；目录指定的精确版本必须同时满足依赖范围和宿主 SDK。不会下载未收录版本或回退 npm 历史版本。
- 目录缺包、目录版本不满足依赖范围、已安装版本不匹配、循环依赖或版本要求冲突，都会中止安装。安装器不会为满足依赖自动替换已有插件。
- 插件依赖与消费者安装在插件根目录下的同一层，作为独立插件管理。新安装的条目保持停用，用户需要分别信任、启用和配置。

`peerDependencies` 保留 SDK 和插件 API 的兼容声明，本身不触发市场安装。普通 npm 库应写在包顶层 `dependencies`，不能用它代替 `llbot.dependencies`。

#### 普通 npm 依赖与安装脚本

| 声明 | 市场的处理方式 |
|---|---|
| `dependencies` | 安装到插件自己的依赖树 |
| `optionalDependencies` | 不适合当前系统或安装失败时可跳过 |
| `bundleDependencies` | 使用包内已有内容 |
| SDK、cordis 等共享包 | 使用宿主提供的副本，不安装第二份替代运行时 |

普通 npm 依赖只支持 npm 源版本和 npm 别名，不支持 Git、本地路径或任意 URL。用于本地开发的 `file:` 依赖不能变成发布包的运行时依赖。

市场不执行 `install`、`postinstall`。需要现场编译或通过脚本下载原生二进制的依赖，应调整为随包提供产物，或按平台提供预编译的 `optionalDependencies`。

#### 更新与卸载

只有目录版本高于已装版本且兼容时，市场才提供更新；本地开发链接不由市场更新。更新会替换整个插件包，并重载已启用的条目。

用户点击卡片上的「更新」才会安装新版本，不会自动更新。

Bot 随附的官方内置插件也有独立的 npm 包名和版本，参与同一套检查更新。它们更新后需要重启 Bot，界面显示已下载版本及当前运行版本；原有条目和配置保留，不能卸载或用本地压缩包覆盖。普通插件不应使用内置包的保留名称或声明 `llbot.builtin`。NTQQ、OneBot 11 和 Milky 是普通插件，走正常的安装、更新、重载和卸载流程。

插件从目录移除后，已安装的包会保留，卡片不再显示不在市场目录中的常规提示；兼容性问题、请求失败和更新未加载等实际错误仍保留。点击卸载会打开独立确认弹框，默认勾选「保留配置」；确认后删除插件文件并从已安装列表移除全部条目。保留时，重新安装会恢复各条目的配置和生效范围，全部保持停用，启用需重新信任；取消勾选则删除配置。两种选择都会清除信任、消息处理顺序和界面布局偏好，保留插件数据目录；取消弹框不发卸载请求。

### 从本地压缩包安装

在 WebUI「插件」筛选栏右侧点击「本地安装」，直接在目录下方的上传区域选择或拖入电脑上的 ZIP、`.tgz` 或 `.tar.gz`，不需要切换标签。先构建插件，再用 `npm pack` 生成 npm 包（文件位于 `package/` 下），或把 `package.json`、构建产物和素材直接压成 ZIP；ZIP 顶层就是 `package.json`，不要再套一层文件夹。包内需有有效的 `name`、完整 `version`、`llbot` 和入口文件。

选择或拖入文件后，在同一弹框勾选信任确认，再点击「安装插件」上传；无需打开第二层确认框。本地包不受市场收录和目录版本限制，但仍检查 SDK 兼容性并按上述规则处理依赖；缺少的插件依赖只能从市场目录补装。没有待补装的插件依赖时，不需要访问市场目录。支持随包提供 `bundleDependencies`，不执行安装脚本。

同名包会替换市场管理目录里的旧版本，已启用的条目会尝试重载；开发目录和链接不被覆盖。新装插件默认停用，仍需在「已安装」中信任并启用。上传和解压都流式写入磁盘，不设固定的文件大小、解压总量或条目数上限；请确保 Bot 所在磁盘有足够空间容纳压缩包和解压后的文件。

### 手动安装与脚手架

手动安装时，将完整插件包放进 Bot 的插件目录（默认 `data/plugins/`，以「本地安装」弹框显示的实际绝对路径为准），允许一层 npm scope 目录。包中需要清单、构建产物和运行时依赖，不能只复制入口源码。点击目录旁的「扫描」，成功后清空全部筛选并返回「已安装」，再启用新插件；目录查询和扫描均不依赖市场插件。

SDK 已发布，可在任意独立目录使用下面的命令创建插件：

```sh
npx -p @luckylillia/plugin-sdk luckylillia-plugin create my-plugin
cd my-plugin
npm install
npm test
```

### 启动时安装并启用插件

无头部署时，可以用启动参数安装并启用插件，不用打开 WebUI：

```sh
node llbot.js --plugin @luckylillia/plugin-nt-protocol --plugin @luckylillia/plugin-onebot11
node llbot.js --instance second --plugin=@luckylillia/plugin-nt-protocol,@luckylillia/plugin-milky
```

- `--plugin` 可重复，也可用逗号分隔多个包。只接受包名，不接受版本、标签、URL 或路径；本地开发目录用 `--plugin-dir`。
- 已安装的包直接信任并启用，不联网、不升级；缺少的包从市场设置的 npm 源和备用镜像源安装兼容版本，不要求已收录到市场目录。`llbot.dependencies` 中的必需插件一起处理。
- 只影响当前实例，保留已有条目和配置。全部条目都停用时启用第一个，没有条目时新建一个。
- 任何一个包安装、信任或初始化失败，Bot 记录原因后以退出码 1 结束。等待 QQ 登录等服务的 `pending` 状态不算失败。
- 参数产生的信任和启用状态会保存，之后去掉参数也不会撤销。

Docker 镜像把参数直接写在镜像名之后：`docker run ... <镜像> --plugin @luckylillia/plugin-nt-protocol`；Compose 写作 `command: ["--plugin", "@luckylillia/plugin-nt-protocol"]`。
