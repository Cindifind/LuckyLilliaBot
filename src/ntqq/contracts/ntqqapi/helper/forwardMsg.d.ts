import { Context } from 'cordis';
import { MessageElement, Peer, SendMessageElement } from '../types';
/** 图片 / 视频 / 语音要重新下载上传, 嵌套的合并转发重建卡片。deleteAfterSentFiles 是临时下载的文件, 发完要删 */
export declare function rawElementsToSend(ctx: Context, elements: MessageElement[], fromPeer: Peer): Promise<{
    elements: SendMessageElement[];
    deleteAfterSentFiles: string[];
}>;
