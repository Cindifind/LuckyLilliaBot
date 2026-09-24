import { Config, MilkyConfig, OB11Config, SatoriConfig, WebUIConfig } from '@/common/types'

const ob11Default: OB11Config = {
  enable: true,
  connect: [
  ],
  // Java 插件桥接：直接在 OneBot 协议层内工作（cleanupConfig 以此为准，缺了会删用户配置）
  jni: {
    enable: false,
    javaPath: 'java',
    jvmArgs: ['-Xmx256m'],
    bridgeJar: 'onebot-bridge.jar',
    javaPluginDir: 'java-plugins',
    classpath: [],
    callTimeout: 30000,
    reportSelfMessage: false,
  },
}
const satoriDefault: SatoriConfig = {
  enable: false,
  host: '127.0.0.1',
  port: 5600,
  token: '',
}
const milkyDefault: MilkyConfig = {
  enable: false,
  reportSelfMessage: false,
  http: {
    host: '127.0.0.1',
    port: 3010,
    prefix: '',
    accessToken: ''
  },
  webhook: {
    urls: [],
    accessToken: ''
  }
}
const webuiDefault: WebUIConfig = {
  enable: true,
  host: '127.0.0.1',
  port: 3080,
}
export const defaultConfig: Config = {
  webui: webuiDefault,
  milky: milkyDefault,
  satori: satoriDefault,
  ob11: ob11Default,
  enableLocalFile2Url: false,
  log: true,
  autoDeleteFile: false,
  autoDeleteFileSecond: 60,
  musicSignUrl: 'https://ss.xingzhige.com/music_card/card',
  signServerUrl: '',
  msgCacheExpire: 120,
  ffmpeg: '',
}
