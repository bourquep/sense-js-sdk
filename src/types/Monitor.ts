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
