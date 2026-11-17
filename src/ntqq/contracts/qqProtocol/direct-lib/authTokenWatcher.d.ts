/** 协议实例的一份 (base.ts), 由 AuthTokenWatcher 维护, 经 /api/auth-token/status 给前端 */
export interface AuthTokenStatus {
    hasToken: boolean;
    validation: 'idle' | 'validating' | 'valid' | 'invalid' | 'error';
    message: string;
    loginError: string;
}
interface WatcherLogger {
    info: (...args: unknown[]) => void;
    warn: (...args: unknown[]) => void;
    error: (...args: unknown[]) => void;
}
type OnValid = (token: string) => void | Promise<void>;
/** One per protocol instance (direct.ts): a protocol switched on again starts with a new one. */
export declare class AuthTokenWatcher {
    private readonly status;
    private readonly onValid;
    private readonly log;
    private readonly isOnline;
    private readonly readToken;
    private file;
    private started;
    private processing;
    private pending;
    private lastValidToken;
    private warnedNoToken;
    private retryTimer;
    private readonly onFileChange;
    constructor(status: AuthTokenStatus, onValid: OnValid, log: WatcherLogger, isOnline: () => boolean, readToken?: () => string);
    start(): void;
    stop(): void;
    check(): void;
    private process;
    private processOnce;
    private scheduleRetry;
    private clearRetry;
}
export {};
