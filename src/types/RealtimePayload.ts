/*
sense-js-sdk
Copyright (C) 2025 Pascal Bourque

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { RealtimeDataChangePayload } from './RealtimeDataChangePayload';
import { RealtimeDeviceStatesPayload } from './RealtimeDeviceStatesPayload';
import { RealtimeHelloPayload } from './RealtimeHelloPayload';
import { RealtimeMonitorInfoPayload } from './RealtimeMonitorInfoPayload';
import { RealtimeUpdatePayload } from './RealtimeUpdatePayload';

/** Represents a realtime payload received from the Sense websocket connection. */
export type RealtimePayload =
  | { payload: RealtimeMonitorInfoPayload; type: 'monitor_info' }
  | { payload: RealtimeHelloPayload; type: 'hello' }
  | { payload: RealtimeDataChangePayload; type: 'data_change' }
  | { payload: RealtimeUpdatePayload; type: 'realtime_update' }
  | { payload: RealtimeDeviceStatesPayload; type: 'device_states' };
