/*
sense-js-sdk
Copyright (C) 2025 Pascal Bourque

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/** Interface for logging operations at different severity levels */
export interface Logger {
  /** Logs a debug message with optional metadata */
  debug(message: string, ...meta: any[]): void;

  /** Logs an info message with optional metadata */
  info(message: string, ...meta: any[]): void;

  /** Logs a warning message with optional metadata */
  warn(message: string, ...meta: any[]): void;

  /** Logs an error message with optional metadata */
  error(message: string, ...meta: any[]): void;
}

/** Logger implementation that silently discards all log messages. */
export class VoidLogger implements Logger {
  debug(message: string, ...meta: any[]): void {}
  info(message: string, ...meta: any[]): void {}
  warn(message: string, ...meta: any[]): void {}
  error(message: string, ...meta: any[]): void {}
}
