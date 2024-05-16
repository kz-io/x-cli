/**
 * @copyright 2020-2024 integereleven. All rights reserved. MIT license.
 * @file Enums for the module.
 */

/**
 * The verbosity levels for {@link Cli} instances.
 */
export enum CliVerbosity {
  /**
   * All logging is enabled.
   */
  All,
  /**
   * Finer-grained information (than `Debug`) useful for debugging the CLI are logged.
   */
  Trace,

  /**
   * Fine-grained information useful for debugging the CLI are logged.
   */
  Debug,

  /**
   * Informational messages highlighting the progress of the CLI are logged.
   */
  Info,

  /**
   * Potentially harmful conditions are logged.
   */
  Warn,

  /**
   * Recoverable errors conditions are logged.
   */
  Error,

  /**
   * No logging is enabled.
   */
  None,
}
