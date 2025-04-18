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

import { Session } from '@/types/Session';

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
