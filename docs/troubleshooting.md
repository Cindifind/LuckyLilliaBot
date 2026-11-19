# 排错与参考

## 排错

| 现象 | 检查方向 |
|---|---|
| npm 找不到 SDK | 使用仓库本地 SDK，或配置 file 开发依赖 |
| 缺 SDK/testing 导出 | 在 Bot 根目录 build:sdk，避免读取旧 lib |
| 测试找不到用例 | 保留插件 vitest.config.ts，避免继承父配置 |
| 插件扫描不到 | 检查目录、llbot、入口和构建产物 |
| 等待依赖 | 先核对 llbot.dependencies 的包是否已安装且版本匹配，再看 `inject`、required 和提供者状态；bots 存在不代表已有在线 Bot |
| 指令不响应 | 检查 commands、前缀、范围、前置中间件，以及统一的「指令」行顺序 |
| 官方群不匹配 | 检查订阅权限和 @，使用 `stripped.content` |
| 跨 Bot 数据混用 | 身份键应包含 `sid`，避免只用 userId/selfId |
| 发送失败 | 检查状态、权限、媒体、`referrer` 和主动额度 |
| 配置保存无效 | 查看校验、运行失败；自定义页是否真正 save |
| 密钥留空仍存在 | 留空保留，使用清空并保存 |
| 页面或插槽不显示 | 入口路径、运行状态、声明、id/match、模块错误 |
| hooks 报错 | React/SDK 是否正确 external |
| 插件样式缺失 | 宿主不扫描插件 Tailwind，改用语义 class 或局部 CSS |
| 停用仍有任务 | 检查定时器、连接和在途请求的 disposer |
| 改插件重启整个 Bot | tsx 是否排除了插件目录 |
| 本机运行、市场安装失败 | files、依赖、安装脚本、静态资源是否齐全 |

## 示例与参考

- [SDK 导出](../packages/plugin-sdk/src/index.ts)、[消息类型](../packages/plugin-sdk/src/universal.ts)、[指令](../packages/plugin-sdk/src/commands.ts)、[WebUI](../packages/plugin-sdk/src/webui.ts)、[测试类型](../packages/plugin-sdk/src/testing.ts)
- [最小可运行插件](README.md#最小可运行插件)、[带配置和指令的示例](getting-started.md#带配置和指令的示例)：完整源码与开发流程
- [WebUI 扩展](webui.md#扩展-webui)：自定义配置界面、页面、字段与插槽
- [echo 测试夹具](../test/fixtures/plugins/echo/src/index.ts)、[hello 测试夹具](../test/fixtures/plugins/hello/src/index.ts)：消息中间件、定时器与热重载验证
- 主题示例：`test/fixtures/plugins/theme/`

普通插件只通过 SDK 使用宿主能力，不直接导入 Bot 仓库的内部实现。
