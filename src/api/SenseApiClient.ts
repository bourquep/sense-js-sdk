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
import isEqual from 'lodash/isEqual';

/** Defines the event types for the SenseApiClient. */
export type SenseApiClientEventTypes = {
  /**
   * Event emitted when the session changes.
   *
   * @param session - The new session object or undefined if session was cleared.
   */
  sessionChanged: [session: Session | undefined];
};

/** A client for interacting with the Sense API. */
export class SenseApiClient {
  /** The current session object, if any. */
  private _session?: Session;

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
  constructor(session?: Session) {
    this._session = session;
  }
}
