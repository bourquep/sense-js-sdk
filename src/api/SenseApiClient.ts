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

import { EventEmitter } from '@/lib/EventEmitter';
import { Session } from '@/types/Session';
import dayjs from 'dayjs';
import isEqual from 'lodash/isEqual';
import { SenseApiError, UnauthenticatedError } from './Errors';
import { Logger, VoidLogger } from './Logger';
import { SenseApiClientOptions } from './SenseApiClientOptions';

/** Defines the event types for the SenseApiClient. */
export type SenseApiClientEventTypes = {
  /**
   * Event emitted when the session changes.
   *
   * @remarks
   * You should subscribe to this event and persist the session object whenever it changes.
   * @param session - The new session object or undefined if session was cleared.
   */
  sessionChanged: [session: Session | undefined];
};

/** A client for interacting with the Sense API. */
export class SenseApiClient {
  /** The current session object, if any. */
  private _session?: Session;

  /** The logger instance used by the client. */
  private _logger: Logger;

  /** The fetcher function used by the client. */
  private _fetcher: typeof fetch;

  /** The base URL for the Sense API. */
  private _apiUrl: string;

  /** The base URL for the Sense WebSocket API. */
  private _wssUrl: string;

  /**
   * Event emitter for client events.
   *
   * @see {@link SenseApiClientEventTypes} for the possible events and their payloads.
   */
  readonly emitter = new EventEmitter<SenseApiClientEventTypes>();

  /** Gets the current session. */
  get session() {
    return this._session;
  }

  /**
   * Sets the current session and emits a sessionChanged event if changed.
   *
   * @param session - The new session value.
   */
  private set session(session: Session | undefined) {
    if (!isEqual(session, this._session)) {
      this._session = session;
      this.emitter.emit('sessionChanged', session);
    }
  }

  /** Returns whether the client currently has an active session. */
  get isAuthenticated(): boolean {
    return !!this.session;
  }

  /**
   * Creates a new SenseApiClient instance.
   *
   * @param session - Optional initial session.
   */
  constructor(session?: Session, options?: SenseApiClientOptions) {
    this._session = session;
    this._logger = options?.logger ?? new VoidLogger();
    this._fetcher = options?.fetcher ?? fetch;
    this._apiUrl = options?.apiUrl ?? 'https://api.sense.com/apiservice/api/v1';
    this._wssUrl = options?.wssUrl ?? 'wss://clientrt.sense.com';
  }

  /** Refreshes the access token if it has expired or is expiring soon. */
  private async refreshAccessTokenIfNeeded(): Promise<string> {
    if (!this.session) {
      throw new UnauthenticatedError('An attempt was made to access a resource without a valid session.');
    }

    this._logger.debug('Parsing access token to determine expiration time...');

    const { accessToken, refreshToken } = this.session;
    const jwtAccessToken = accessToken.startsWith('t1.v2.') ? accessToken.substring(7) : accessToken;

    let payload: { exp?: number; userId?: string };
    try {
      const splitToken = jwtAccessToken.split('.');
      if (splitToken.length !== 3) {
        throw new Error('Invalid access token format.');
      }

      payload = JSON.parse(Buffer.from(splitToken[1], 'base64').toString());
      if (!payload.exp) {
        throw new Error('No expiration time in access token.');
      }
      if (!payload.userId) {
        throw new Error('No subject id in access token.');
      }
    } catch (error) {
      this.session = undefined;
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new UnauthenticatedError(`An attempt was made to access a resource without a valid session: ${message}`);
    }

    if (dayjs.unix(payload.exp).isAfter(dayjs().add(15, 'minutes'))) {
      this._logger.debug('Access token is still valid, not renewing.');
      return accessToken;
    }

    this._logger.debug('Access token is expiring, renewing...');

    const response = await this._fetcher(`${this._apiUrl}/renew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        user_id: payload.userId,
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      // Don't clear this.session as this may be a transient error.
      this._logger.error('Failed to renew access token.', response.statusText);
      throw new SenseApiError(response);
    }

    const responseData = await response.json();

    this.session = {
      ...this.session,
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token
    };

    return responseData.access_token;
  }
}
