export interface BaseConnectConfig {
  type: string
  name?: string // 自定义名称
  enable: boolean
  token: string
  reportSelfMessage: boolean
  reportOfflineMessage: boolean
  messageFormat: 'array' | 'string'
  debug: boolean
  filter?: Record<string, unknown>
}

export interface WsConnectConfig extends BaseConnectConfig {
  type: 'ws'
  host: string
  port: number
  heartInterval: number // ms
}

export interface WsReverseConnectConfig extends BaseConnectConfig {
  type: 'ws-reverse'
  url: string
  heartInterval: number // ms
}

export interface HttpConnectConfig extends BaseConnectConfig {
  type: 'http'
  host: string
  port: number
}

export interface HttpPostConnectConfig extends BaseConnectConfig {
  type: 'http-post'
  url: string
  enableHeart: boolean
  heartInterval: number // ms
}

export interface JniConfig {
  /** 是否启用 Java 插件桥接 */
  enable: boolean
  /** Java 可执行文件路径，例如 java 或 /usr/bin/java */
  javaPath: string
  /** JVM 启动参数 */
  jvmArgs: string[]
  /** 桥接主程序 JAR（相对运行目录或绝对路径） */
  bridgeJar: string
  /** Java 插件存放目录（相对 data 目录或绝对路径） */
  javaPluginDir: string
  /** 额外 classpath */
  classpath: string[]
  /** 调用超时（毫秒） */
  callTimeout: number
  /** 上报自身消息：开启后机器人自己发送的消息也推送给 Java 插件 */
  reportSelfMessage: boolean
}

export interface OB11Config {
  enable: boolean
  connect: (WsConnectConfig | WsReverseConnectConfig | HttpConnectConfig | HttpPostConnectConfig)[]
  /** Java 插件桥接：直接在 OneBot 协议层内工作，事件/Action 复用 OneBot 11 协议 */
  jni?: JniConfig
  // /** @deprecated */
  // token?: string
  // /** @deprecated */
  // httpPort?: number
  // /** @deprecated */
  // httpPostUrls?: string[]
  // /** @deprecated */
  // httpSecret?: string
  // /** @deprecated */
  // wsPort?: number
  // /** @deprecated */
  // wsReverseUrls?: string[]
  // /** @deprecated */
  // enableHttp?: boolean
  // /** @deprecated */
  // enableHttpPost?: boolean
  // /** @deprecated */
  // enableWs?: boolean
  // /** @deprecated */
  // enableWsReverse?: boolean
  // /** @deprecated */
  // messagePostFormat?: 'array' | 'string'
  // /** @deprecated */
  // enableHttpHeart?: boolean
  // /**
  //  * 快速操作回复自动引用原消息
  //  * @deprecated
  //  */
  // enableQOAutoQuote?: boolean
  // /** @deprecated */
  // reportSelfMessage?: boolean
}

export interface SatoriConfig {
  enable: boolean
  host: string
  port: number
  token: string
}

export interface MilkyHttpConfig {
  host: string
  port: number
  prefix: string
  accessToken: string
}

export interface MilkyWebhookConfig {
  urls: string[]
  accessToken: string
}

export interface MilkyConfig {
  enable: boolean
  reportSelfMessage: boolean
  http: MilkyHttpConfig
  webhook: MilkyWebhookConfig
}

export interface WebUIConfig {
  enable: boolean
  host: string
  port: number
}

export interface EmailConfig {
  enabled: boolean
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: {
      user: string
      pass: string
    }
  }
  from: string
  to: string
}

export interface Config {
  milky: MilkyConfig
  satori: SatoriConfig
  ob11: OB11Config
  webui: WebUIConfig
  email?: EmailConfig
  // onlyLocalhost: boolean
  enableLocalFile2Url?: boolean // 开启后，本地文件路径图片会转成http链接, 语音会转成base64
  log?: boolean
  logLevel?: 'info' | 'debug' // 'debug' 打开底层详情日志 (等价 --debug); 默认 'info'
  autoDeleteFile?: boolean
  autoDeleteFileSecond?: number
  ffmpeg?: string // ffmpeg路径
  musicSignUrl?: string
  /** 自建签名服务器 URL (无头 QQ 模式). 设置后绕过 sign-proxy 原生二进制, 走 HTTP 签名. */
  signServerUrl?: string
  msgCacheExpire?: number // second
  // /** @deprecated */
  // heartInterval?: number // ms
  // /** @deprecated */
  // receiveOfflineMsg?: boolean // 是否接收离线消息
  // /** @deprecated */
  // debug?: boolean
}

export interface CheckVersion {
  result: boolean
  version: string
}

export interface FileCache {
  fileName: string
  fileSize: string
  fileUuid: string
  msgTime: number
  peerUid: string
  chatType: number
  elementType: number
  md5HexStr: string
  /** 图片专用：原始 URL 路径（不含 rkey），获取时通过 getImageUrl 拼新鲜 rkey */
  originImageUrl?: string
}
