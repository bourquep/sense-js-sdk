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

import { TrendsDevice } from './TrendsDevice';

/**
 * Trend data for device usage and energy statistics.
 */
export interface Trends {
  steps: number;
  start: string;
  end: string;
  consumption: {
    total: number;
    totals: number[];
    devices: TrendsDevice[];
    total_cost: number;
    total_costs: number[];
  };
  production: {
    total: number;
    total_cost: number;
  };
  // TODO: Why all these nulls?
  grid_to_battery: null;
  solar_to_home: null;
  solar_to_battery: null;
  battery_to_home: null;
  battery_to_grid: null;
  top_movers: null;
  to_grid: null;
  from_grid: null;
  consumption_cost_change_cents: null;
  consumption_percent_change: null;
  production_percent_change: null;
  to_grid_cost: null;
  from_grid_cost: null;
  trend_text: null;
  usage_text: null;
  trend_consumption: null;
  trend_cost: null;
  scale: string;
  solar_powered: null;
  net_production: number;
  production_pct: number;
  consumption_kwh_change: null;
}
