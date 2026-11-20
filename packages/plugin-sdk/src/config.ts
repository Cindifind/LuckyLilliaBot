/**
 * Compatibility API for trusted adapters that expose the legacy get_config / set_config actions.
 * Obtain with ctx.get('config') after declaring the config service dependency.
 * Ordinary plugins should keep their settings in their own configuration and storage.
 */
export interface HostConfig {
  readonly version: string
  /** Includes adapter settings and their credentials; do not log the result. */
  getLegacy(): Record<string, any>
  /** Merge only supplied settings, keeping instance and command-line overrides. */
  patchLegacy(partial: Record<string, any>, options?: { rules?: boolean }): Promise<void>
}
