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
