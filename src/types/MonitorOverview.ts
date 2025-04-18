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

/** Represents an overview of a Sense Energy Monitor's configuration and status. */
export interface MonitorOverview {
  checksum: string;
  device_data_checksum: string;
  monitor_overview: {
    monitor: Monitor;
    ndi_enabled: boolean;
    local_api_enabled: boolean;
    partner_channel: string;
    partner_tags: string[];
    num_devices: number;
    num_named_devices: number;
    num_unnamed_devices: number;
    notify_weak_connection: boolean;
  };
}
