import React from 'react'
import { version } from '../../../../../../version'

const CommunityIcon: React.FC<{ service: 'telegram' | 'qq' }> = ({ service }) => (
  <div
    data-community-icon={service}
    className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center"
    style={{
      background: service === 'telegram'
        ? 'linear-gradient(145deg, #38b9ef, #168acb)'
        : 'linear-gradient(145deg, #36b5f3, #416fe4)',
      boxShadow: 'inset 0 1px 1px rgb(255 255 255 / .4), inset 0 -1px 1px rgb(0 0 0 / .08), 0 4px 10px -4px rgb(0 70 130 / .3)',
    }}
  >
    <svg className="w-7 h-7" viewBox={service === 'qq' ? '0 0 24 24' : '0 0 32 32'} aria-hidden="true" focusable="false">
      {service === 'telegram' ? (
        <path fill="white" d="m27.4 5.2-22.8 8.8c-1.5.6-1.5 1.4-.3 1.8l5.8 1.8L23.5 9c.6-.4 1.2-.2.7.3L13.3 19.2l-.4 6c.6 0 .9-.3 1.2-.6l2.8-2.7 5.8 4.3c1.1.7 1.9.3 2.2-1l3.7-18c.4-1.4-.5-2.3-1.2-2Z" />
      ) : (
        // Tencent QQ, Simple Icons 11.15.0 (CC0-1.0):
        // https://github.com/simple-icons/simple-icons/blob/11.15.0/icons/tencentqq.svg
        <path fill="white" d="M21.395 15.035a40 40 0 0 0-.803-2.264l-1.079-2.695c.001-.032.014-.562.014-.836C19.526 4.632 17.351 0 12 0S4.474 4.632 4.474 9.241c0 .274.013.804.014.836l-1.08 2.695a39 39 0 0 0-.802 2.264c-1.021 3.283-.69 4.643-.438 4.673.54.065 2.103-2.472 2.103-2.472 0 1.469.756 3.387 2.394 4.771-.612.188-1.363.479-1.845.835-.434.32-.379.646-.301.778.343.578 5.883.369 7.482.189 1.6.18 7.14.389 7.483-.189.078-.132.132-.458-.301-.778-.483-.356-1.233-.646-1.846-.836 1.637-1.384 2.393-3.302 2.393-4.771 0 0 1.563 2.537 2.103 2.472.251-.03.581-1.39-.438-4.673" />
      )}
    </svg>
  </div>
)

const AboutPage: React.FC = () => (
  <div className="space-y-6">
    {/* 项目信息 */}
    <div className="card p-8 text-center">
      <div className="w-20 h-20 rounded-3xl overflow-hidden mx-auto mb-6 shadow-lg">
        <img
          src="/logo-192.webp"
          srcSet="/logo-128.webp 128w, /logo-192.webp 192w, /logo-256.webp 256w"
          sizes="80px"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-3xl font-bold text-theme mb-2">Lucky Lillia Bot</h1>
      <p className="text-theme-secondary mb-6">一种聊天机器人框架</p>
      <div className="flex items-center justify-center gap-4">
        <a
          href="https://github.com/LLOneBot/LuckyLilliaBot"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 bg-gray-800 dark:bg-neutral-700 text-white rounded-xl hover:bg-gray-900 dark:hover:bg-neutral-600 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          GitHub
        </a>
        <a
          href="https://luckylillia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2.5 btn-primary transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          文档
        </a>
      </div>
    </div>

    {/* 社区 */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <CommunityIcon service="telegram" />
          <div>
            <h3 className="text-lg font-semibold text-theme">Telegram 群</h3>
          </div>
        </div>
        <a
          href="https://t.me/+nLZEnpne-pQ1OWFl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-500 hover:text-pink-600 hover:underline text-sm break-all"
        >
          https://t.me/+nLZEnpne-pQ1OWFl
        </a>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <CommunityIcon service="qq" />
          <div>
            <h3 className="text-lg font-semibold text-theme">QQ 群</h3>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://qm.qq.com/q/EZndy3xntQ"
            target="_blank"
            rel="noopener noreferrer"
            className=" text-pink-500 hover:text-pink-600 hover:underline"
          >
            545402644
          </a>
        </div>
      </div>
    </div>

    {/* 版本信息 */}
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary-br flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-theme">版本信息</div>
            <div className="text-xs text-theme-muted">Lucky Lillia Bot {version}</div>
          </div>
        </div>
        <div className="text-sm text-theme-secondary">
          WebUI Powered by  <span className="font-semibold text-pink-500">React + Tailwind</span>
        </div>
      </div>
    </div>
  </div>
)

export default AboutPage
