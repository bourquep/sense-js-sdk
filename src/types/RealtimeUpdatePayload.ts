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
