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

/**
 * Represents an authenticated user session. This is the object that must be persisted by the application in order to
 * maintain the user's authentication state. This object contains sensitive information that should not be exposed to
 * untrusted parties. It is recommended to store this object securely and only share it with trusted parties.
 */
export interface Session {
  userId: number;
  monitorIds: number[];
  accessToken: string;
  refreshToken: string;
}
