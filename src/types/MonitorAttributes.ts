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

/** Various attributes of a Sense Energy Monitor. */
export interface MonitorAttributes {
  id: number;
  name: string;
  state?: string;
  cost?: number;
  sell_back_rate?: number;
  user_set_cost?: boolean;
  cycle_start?: number;
  basement_type?: string;
  home_size_type?: string;
  home_type?: string;
  number_of_occupants?: string;
  occupancy_type?: string;
  year_built_type?: string;
  basement_type_key?: string;
  home_size_type_key?: string;
  home_type_key?: string;
  occupancy_type_key?: string;
  year_built_type_key?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  electricity_cost?:
    | number
    | {
        id: number;
        location: string;
        abbreviation: string;
        cost: number;
        national_electricity_cost: {
          id: number;
          location: string;
          abbreviation: string;
          cost: number;
        };
        national_electricity_cost_id: number;
      };
  show_cost?: boolean;
  tou_enabled?: boolean;
  solar_tou_enabled?: boolean;
  power_region?: string;
  to_grid_threshold?: number;
  panel?: string;
  home_info_survey_progress?: string;
  device_survey_progress?: string;
  user_set_sell_back_rate?: boolean;
}
