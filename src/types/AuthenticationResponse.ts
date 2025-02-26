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

import { Monitor } from './Monitor';
import { Settings } from './Settings';

/**
 * Response object returned after successful authentication
 */
export interface AuthenticationResponse {
  /** Whether the authentication was successful */
  authorized: boolean;

  /** Unique identifier for the account */
  account_id: number;

  /** Unique identifier for the user */
  user_id: number;

  /** JWT token for accessing protected resources */
  access_token: string;

  /** User's application settings */
  settings: Settings;

  /** JWT token for obtaining new access tokens */
  refresh_token: string;

  /** List of monitors associated with the account */
  monitors: Monitor[];

  /** URL of the bridge server */
  bridge_server: string;

  /** ISO 8601 timestamp when the account was created */
  date_created: string;

  /** Whether two-factor authentication is enabled */
  totp_enabled: boolean;

  /** A/B testing cohort assignment */
  ab_cohort?: string;
}
