import type { ActionHost } from './BaseAction';
import { BaseAction } from './BaseAction';
export declare function initActionMap(adapter: ActionHost): Map<string, BaseAction<any, unknown>>;
