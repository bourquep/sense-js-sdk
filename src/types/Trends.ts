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

import { TrendsDevice } from './TrendsDevice';

/** Trend data for device usage and energy statistics. */
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
