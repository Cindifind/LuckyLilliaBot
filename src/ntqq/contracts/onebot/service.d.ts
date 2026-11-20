import { Context, Service } from 'cordis';
import { initActionMap } from './action';
declare module 'cordis' {
    interface Context {
        ntOnebot: OneBotActions;
    }
}
/** OneBot-compatible account API. It never opens HTTP/WebSocket connections. */
export declare class OneBotActions extends Service {
    static inject: string[];
    readonly actionMap: ReturnType<typeof initActionMap>;
    constructor(ctx: Context);
}
