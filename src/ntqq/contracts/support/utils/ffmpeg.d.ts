import type { Context } from 'cordis';
import type { FFmpegAPI } from '@luckylillia/plugin-sdk';
export type { FFmpegAudioFormat as AudioFormat, FFmpegMediaInfo as MediaInfo } from '@luckylillia/plugin-sdk';
export declare const FFMPEG_PLUGIN = "lucky-lillia-plugin-ffmpeg";
export declare class FFmpegUnavailableError extends Error {
    readonly code = "FFMPEG_PLUGIN_MISSING";
    constructor(message?: string);
}
export declare function isFFmpegUnavailableError(error: unknown): error is FFmpegUnavailableError;
/** Bridges the optional service to existing media helpers used by separately updated builtin packages. */
export declare function installFFmpegBridge(ctx: Context): void;
/** No native module is imported by the host. Availability follows the external plugin's lifecycle. */
export declare function tryGetFFmpegAddon(ctx?: Context): FFmpegAPI | undefined;
export declare function getFFmpegAddon(ctx?: Context): FFmpegAPI;
/** Kept for existing builtin npm packages that still forward the old executable setting. */
export declare function setFFMpegPath(ffmpegPath: string): void;
