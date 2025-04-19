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

import { Logger } from './Logger';

/** Configuration options for the Sense API client. */
export interface SenseApiClientOptions {
  /**
   * Optional logger instance for client logging.
   *
   * @defaultValue A _void_ logger instance that does nothing.
   */
  logger?: Logger;

  /**
   * Optional fetch function to use for HTTP requests.
   *
   * @defaultValue The global `fetch` function.
   */
  fetcher?: typeof fetch;

  /**
   * Base URL for the Sense REST API endpoints.
   *
   * @remarks
   * Overriding this value should never be necessary.
   * @defaultValue `https://api.sense.com/apiservice/api/v1`
   */
  apiUrl?: string;

  /**
   * Base URL for the Sense real-time WebSocket API endpoints.
   *
   * @remarks
   * Overriding this value should never be necessary.
   * @defaultValue `wss://clientrt.sense.com`
   */
  wssUrl?: string;

  /**
   * Whether to automatically reconnect to the real-time WebSocket API when the connection is lost.
   *
   * @defaultValue `true`
   */
  autoReconnectRealtimeUpdates?: boolean;
}
