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

import { RealtimeDataChangePayload } from './RealtimeDataChangePayload';
import { RealtimeDeviceStatesPayload } from './RealtimeDeviceStatesPayload';
import { RealtimeHelloPayload } from './RealtimeHelloPayload';
import { RealtimeMonitorInfoPayload } from './RealtimeMonitorInfoPayload';
import { RealtimeUpdatePayload } from './RealtimeUpdatePayload';

/** Represents a realtime payload received from the Sense websocket connection. */
export type WssPayload =
  | { payload: RealtimeMonitorInfoPayload; type: 'monitor_info' }
  | { payload: RealtimeHelloPayload; type: 'hello' }
  | { payload: RealtimeDataChangePayload; type: 'data_change' }
  | { payload: RealtimeUpdatePayload; type: 'realtime_update' }
  | { payload: RealtimeDeviceStatesPayload; type: 'device_states' };
