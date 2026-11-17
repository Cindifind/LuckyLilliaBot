import { ActionName } from './types';
import { OB11Return } from '../types';
import { Context } from 'cordis';
import { ParseMessageConfig } from '../types';
import z from 'schemastery';
/** Account actions only need their context; they never own transport listeners. */
export interface ActionHost {
    ctx: Context;
}
declare abstract class BaseAction<PayloadType, ReturnDataType> {
    protected adapter: ActionHost;
    abstract actionName: ActionName;
    protected ctx: Context;
    payloadSchema?: z<PayloadType>;
    constructor(adapter: ActionHost);
    handle(payload: PayloadType, config: ParseMessageConfig): Promise<OB11Return<ReturnDataType | null>>;
    websocketHandle(payload: PayloadType, echo: unknown, config: ParseMessageConfig): Promise<OB11Return<ReturnDataType | null>>;
    protected abstract _handle(payload: PayloadType, config: ParseMessageConfig): Promise<ReturnDataType>;
}
export { BaseAction, z as Schema };
