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

/** Represents a realtime payload containing Sense device information. */
export interface RealtimeDevice {
  id: string;
  name: string;
  tags: Record<string, never>;
  attrs: string[];
  w: number;
  c: number;
  sd?: {
    w?: number;
    i?: number;
    v?: number;
    e?: number;
    intensity?: number;
    extra?: {
      bri?: number;
      hue?: number;
      sat?: number;
      ct?: number;
    };
  };
  ao_w?: number;
  ao_st?: boolean;
}
