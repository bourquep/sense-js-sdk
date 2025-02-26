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

import { RealtimeDevice } from './RealtimeDevice';

/**
 * Represents a realtime payload containing up-to-date Sense monitor information, including device details and power
 * flow data.
 */
export interface RealtimeUpdatePayload {
  voltage?: number[];
  frame: number;
  devices: RealtimeDevice[];
  deltas: RealtimeUpdateDelta[];
  defaultCost: number;
  channels?: number[];
  hz?: number;
  w: number;
  c: number;
  grid_w: number;
  _stats: {
    brcv: number;
    mrcv: number;
    msnd: number;
  };
  power_flow: {
    grid: string[];
  };
  d_w: number;
  epoch: number;
}

/**
 * Represents a delta update in the realtime data stream from a Sense monitor, containing power consumption changes for
 * specific channels between frames.
 */
export interface RealtimeUpdateDelta {
  frame: number;
  channel: number;
  start_frame: number;
  w: number;
}
