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
}
