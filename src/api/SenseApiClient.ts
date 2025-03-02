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
import { Device } from '@/types/Device';
import { MonitorOverview } from '@/types/MonitorOverview';
import { Session } from '@/types/Session';
import { Trends } from '@/types/Trends';
import { TrendScale } from '@/types/TrendScale';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import isEqual from 'lodash/isEqual';
import { SenseApiError, UnauthenticatedError } from './Errors';
import { Logger, VoidLogger } from './Logger';
import { SenseApiClientOptions } from './SenseApiClientOptions';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  weekStart: 1 // Monday is the first day of the week.
});

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

  /**
   * Gets the current session.
   *
   * @returns The current session object, if any.
   */
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

  /**
   * Returns whether the client currently has an active session.
   *
   * @returns True if the client has an active session, false otherwise.
   */
  get isAuthenticated(): boolean {
    return !!this.session;
  }

  /**
   * Creates a new SenseApiClient instance.
   *
   * @param session - Optional initial {@link Session} value.
   * @param options - Optional configuration {@link SenseApiClientOptions}.
   */
  constructor(session?: Session, options?: SenseApiClientOptions) {
    this._session = session;
    this._logger = options?.logger ?? new VoidLogger();
    this._fetcher = options?.fetcher ?? fetch;
    this._apiUrl = options?.apiUrl ?? 'https://api.sense.com/apiservice/api/v1';
    this._wssUrl = options?.wssUrl ?? 'wss://clientrt.sense.com';
  }

  /**
   * Retrieves an overview of a specific Sense monitor.
   *
   * @param monitorId - The ID of the Sense monitor to get an overview for.
   * @returns A promise that resolves to a {@link MonitorOverview} object containing the monitor's overview data.
   * @throws {@link SenseApiError} If the API request fails.
   * @throws {@link UnauthenticatedError} If there is no valid session.
   */
  async getMonitorOverview(monitorId: string): Promise<MonitorOverview> {
    const accessToken = await this.refreshAccessTokenIfNeeded();

    const response = await this._fetcher(`${this._apiUrl}/app/monitors/${monitorId}/overview`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new SenseApiError(response);
    }

    return response.json();
  }

  /**
   * Retrieves all devices detected by a specific Sense monitor.
   *
   * @param monitorId - The ID of the Sense monitor to get devices for.
   * @returns A promise that resolves to an array of {@link Device} objects representing the detected devices.
   * @throws {@link SenseApiError} If the API request fails.
   * @throws {@link UnauthenticatedError} If there is no valid session.
   */
  async getMonitorDevices(monitorId: string): Promise<Device[]> {
    const accessToken = await this.refreshAccessTokenIfNeeded();

    const response = await this._fetcher(`${this._apiUrl}/app/monitors/${monitorId}/devices`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new SenseApiError(response);
    }

    return response.json();
  }

  /**
   * Retrieves historical trend data for a Sense monitor.
   *
   * @param monitorId - The ID of the Sense monitor to get trends for.
   * @param timezone - The timezone to use for date calculations, in IANA format (e.g. 'America/New_York'). This should
   *   correspond to the timezone of the monitor, as found in the {@link Monitor} object returned by
   *   {@link getMonitorOverview}.
   * @param scale - The time scale for which to retrieve trends (e.g. `DAY`, `WEEK`, `MONTH`, `YEAR`, `CYCLE`).
   * @param startDate - Optional start date to retrieve trends from. If not provided, trends will start from the current
   *   date.
   * @returns A promise that resolves to a {@link Trends} object containing the trend data.
   * @throws {@link SenseApiError} If the API request fails.
   * @throws {@link UnauthenticatedError} If there is no valid session.
   */
  async getMonitorTrends(monitorId: string, timezone: string, scale: TrendScale, startDate?: Date): Promise<Trends> {
    const accessToken = await this.refreshAccessTokenIfNeeded();

    const dateUnit = this.getDayJsUnitTypeFromTrendScale(scale);
    const startDay = this.getTrendStartDay(timezone, startDate).startOf(dateUnit);

    const url = new URL(`${this._apiUrl}/app/history/trends`);
    url.searchParams.append('monitor_id', monitorId);
    url.searchParams.append('scale', scale);
    url.searchParams.append('start', startDay.toISOString());

    const response = await this._fetcher(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new SenseApiError(response);
    }

    return response.json();
  }

  /**
   * Refreshes the access token if it has expired or is expiring soon.
   *
   * @returns A promise that resolves to the refreshed access token.
   */
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

  /**
   * Determines the starting day for trend data based on provided timezone and optional start date.
   *
   * @param timezone - The timezone to use for date calculations, in IANA format (e.g. 'America/New_York').
   * @param startDate - Optional date to start trends from. If not provided, current date is used.
   * @returns A `dayjs` object representing the start day in the specified timezone.
   */
  private getTrendStartDay(timezone: string, startDate?: Date): dayjs.Dayjs {
    try {
      const startDay = startDate ? dayjs.tz(startDate, timezone) : dayjs.tz(undefined, timezone);
      if (startDay.isValid()) {
        return startDay;
      }

      this._logger.warn(`Failed to parse start date '${startDate}' as a valid date. Using current date instead.`);
      return dayjs.tz(timezone);
    } catch (error) {
      this._logger.warn(`Failed to parse timezone '${timezone}' with error: '${error}'. Using UTC instead.`);
      return dayjs.utc();
    }
  }

  /**
   * Converts a {@link TrendScale} value to its corresponding `dayjs` unit type.
   *
   * @param scale - The {@link TrendScale} value to convert (`DAY`, `WEEK`, `MONTH`, `YEAR`, or `CYCLE`).
   * @returns The corresponding `dayjs.OpUnitType` ('day', 'week', 'month', or 'year').
   */
  private getDayJsUnitTypeFromTrendScale(scale: TrendScale): dayjs.OpUnitType {
    switch (scale) {
      case 'DAY':
        return 'day';
      case 'WEEK':
        return 'week';
      case 'MONTH':
        return 'month';
      case 'YEAR':
        return 'year';
      case 'CYCLE':
        return 'day';
      default:
        this._logger.warn(`Unknown trend scale '${scale}'. Using 'day' instead.`);
        return 'day';
    }
  }
}
