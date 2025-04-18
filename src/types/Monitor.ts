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

import { MonitorAttributes } from './MonitorAttributes';

/** Represents a Sense Energy Monitor with its configuration and status details. */
export interface Monitor {
  id: number;
  date_created: string;
  serial_number: string;
  time_zone: string;
  solar_connected: boolean;
  solar_configured: boolean;
  online: boolean;
  attributes: MonitorAttributes;
  signal_check_completed_time: string;
  ethernet_supported: boolean;
  power_over_ethernet_supported: boolean;
  aux_ignore: boolean;
  aux_port: string;
  hardware_type: string;
  zigbee_supported: boolean;
}
