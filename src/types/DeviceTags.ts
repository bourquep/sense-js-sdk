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

import { DeviceType } from './DeviceType';
import { PeerName } from './PeerName';

/** Various tags and attributes for a Sense monitored device. */
export interface DeviceTags {
  Alertable?: string;
  AlwaysOn?: string;
  DateCreated?: string;
  DateFirstUsage?: string;
  DefaultUserDeviceType?: DeviceType;
  UserDeviceType?: DeviceType;
  DefaultLocation?: string;
  DefaultMake?: string;
  DefaultModel?: string;
  DeployToMonitor?: string;
  DeviceListAllowed?: string;
  DeviceCount?: number;
  DCMActive?: string;
  DUID?: string;
  IntegrationType?: string;
  IntegratedDeviceType?: string;
  MergedDevices?: string;
  ModelCreatedVersion?: string;
  name_useredit?: string;
  NameUserGuess?: string;
  OriginalName?: string;
  OtherSuperseded?: string;
  OtherSupersededType?: string;
  PeerNames?: PeerName[];
  Pending?: string;
  Revoked?: string;
  SmartPlugModel?: string;
  SSIEnabled?: string;
  SSIModel?: string;
  Stage?: string;
  TimelineAllowed?: string;
  TimelineDefault?: string;
  Type?: string;
  UserAdded?: string;
  UserControlLock?: string;
  UserDeletable?: string;
  UserDeviceTypeDisplayString?: string;
  UserEditable?: string;
  UserEditableMeta?: string;
  UserMergeable?: string;
  UserShowBubble?: string;
  UserShowInDeviceList?: string;
  UserVisibleDeviceId?: string;
  Virtual?: string;
  ControlCapabilities?: string[];
}
