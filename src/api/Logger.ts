/*
sense-js-sdk
Copyright (C) 2025 Pascal Bourque

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/** Interface for logging operations at different severity levels */
export interface Logger {
  /** Logs a debug message with optional metadata */
  debug(message: string, ...meta: unknown[]): void;

  /** Logs an info message with optional metadata */
  info(message: string, ...meta: unknown[]): void;

  /** Logs a warning message with optional metadata */
  warn(message: string, ...meta: unknown[]): void;

  /** Logs an error message with optional metadata */
  error(message: string, ...meta: unknown[]): void;
}

/** Logger implementation that silently discards all log messages. */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class VoidLogger implements Logger {
  debug(message: string, ...meta: unknown[]): void {}
  info(message: string, ...meta: unknown[]): void {}
  warn(message: string, ...meta: unknown[]): void {}
  error(message: string, ...meta: unknown[]): void {}
}
/* eslint-enable @typescript-eslint/no-unused-vars */
