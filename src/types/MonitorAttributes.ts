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
