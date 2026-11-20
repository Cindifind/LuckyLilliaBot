import { AtType, MessageStyle, SendArkElement, SendFaceElement, SendFileElement, SendMarketFaceElement, SendMessageElement, SendMultiForwardMsgElement, SendPicElement, SendPttElement, SendReplyElement, SendTextElement, SendVideoElement } from './types';
import { Context } from 'cordis';
export declare namespace SendElement {
    function text(content: string): SendTextElement;
    function at(atUin: number, atType: AtType, display: string): SendTextElement;
    function reply(msgSeq: number, senderUin: number, senderUid: string, msgTime: number, clientSeq: number, srcMsg?: Buffer): SendReplyElement;
    function pic(ctx: Context, picPath: string, summary?: string, subType?: number): Promise<SendPicElement>;
    function video(ctx: Context, filePath: string, diyThumbPath?: string): Promise<SendVideoElement>;
    function ptt(ctx: Context, pttPath: string): Promise<SendPttElement>;
    function face(faceId: number, faceType?: number): SendFaceElement;
    function mface(emojiPackageId: number, emojiId: string, key: string, summary?: string): SendMarketFaceElement;
    function dice(resultId?: string | number): SendFaceElement;
    function rps(resultId?: string | number): SendFaceElement;
    function ark(data: string): SendArkElement;
    function shake(): SendFaceElement;
    function forward(nodes: {
        senderUin: number;
        senderName: string;
        elements: SendMessageElement[];
        msgSeq: number;
        msgTime?: number;
        msgStyle?: MessageStyle;
    }[], title?: string | null, preview?: string[] | null, summary?: string | null, prompt?: string | null): SendMultiForwardMsgElement;
    function file(ctx: Context, filePath: string, fileName: string): Promise<SendFileElement>;
}
