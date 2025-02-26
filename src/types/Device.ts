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

import { DeviceIcon } from './DeviceIcon';
import { DeviceTags } from './DeviceTags';

/**
 * Represents a Sense monitored device with its identifying information and attributes.
 */
export interface Device {
  id: string;
  name: string;
  icon: DeviceIcon;
  tags: DeviceTags;
  location?: string;
  make?: string;
  model?: string;
  monitor_id?: number;
  type?: string;
  count?: number;
  stage?: string;
}
