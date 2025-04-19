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

/** Represents the type of Sense device. */
export type DeviceType =
  // Appliances
  | 'AirCompressor'
  | 'AirFryer'
  | 'AirPurifier'
  | 'BeerFridge'
  | 'Blender'
  | 'BreadMaker'
  | 'CirculatorPump'
  | 'CoffeeGrinder'
  | 'CoffeeMaker'
  | 'CondensatePump'
  | 'CurlingIron'
  | 'Dehumidifier'
  | 'Dishwasher'
  | 'Disposal'
  | 'Drill'
  | 'Dryer'
  | 'ElectricDryer'
  | 'ElectricVehicle'
  | 'FoodProcessor'
  | 'Freezer'
  | 'Fridge'
  | 'GarageDoor'
  | 'GasDryer'
  | 'Griddle'
  | 'Grill'
  | 'HairCurler'
  | 'HairDryer'
  | 'HairStraightener'
  | 'HairStyler'
  | 'HeatPumpDryer'
  | 'HotTub'
  | 'Humidifier'
  | 'IceMaker'
  | 'Iron'
  | 'Kegerator'
  | 'Kiln'
  | 'KitchenAppliance'
  | 'LawnMower'
  | 'LeafBlower'
  | 'Microwave'
  | 'MilkFrother'
  | 'Mixer'
  | 'OtherAppliance'
  | 'Oven'
  | 'PaperShredder'
  | 'PoolPump'
  | 'PowerTool'
  | 'Pump'
  | 'RiceCooker'
  | 'SewagePump'
  | 'SewingMachine'
  | 'Skillet'
  | 'SlowCooker'
  | 'Smoker'
  | 'Steamer'
  | 'StoveTop'
  | 'SumpPump'
  | 'TeaKettle'
  | 'Toaster'
  | 'ToasterOven'
  | 'TrashCompactor'
  | 'Vacuum'
  | 'WaffleIron'
  | 'Washer'
  | 'WaterCooler'
  | 'WaterDispenser'
  | 'WaterPump'
  | 'WaterSoftener'
  | 'WellPump'
  | 'WineFridge'
  // Electronics
  | 'Aquarium'
  | 'CableBox'
  | 'Computer'
  | 'ElectricBlanket'
  | 'GameConsole'
  | 'MediaConsole'
  | 'OtherElectronics'
  | 'OtherHomeEntertainment'
  | 'OtherNetworkDevice'
  | 'OtherSmartHome'
  | 'PowerStrip'
  | 'Printer'
  | 'Router'
  | 'Servers'
  | 'SmartCam'
  | 'SmartPlug'
  | 'Speakers'
  | 'Stereo'
  | 'Terrarium'
  | 'TV'
  | 'VoiceAssistant'
  | 'WirelessExtender'
  // Lighting
  | 'ApplianceLight'
  | 'BathFanLight'
  | 'GarageDoorLight'
  | 'Light'
  // Cooling
  | 'AC'
  | 'CentralAC'
  | 'Fan'
  | 'OtherCooling'
  | 'WindowAC'
  // Heating
  | 'CentralHeat'
  | 'DrivewayHeater'
  | 'ElectricBaseboard'
  | 'ElectricFurnace'
  | 'ElectricWaterHeater'
  | 'FloorHeater'
  | 'Furnace'
  | 'GasWaterHeater'
  | 'HeatPump'
  | 'HeatPumpWaterHeater'
  | 'HydronicWaterBoiler'
  | 'InstantWaterHeater'
  | 'OtherHeater'
  | 'PelletStove'
  | 'PoolHeater'
  | 'RoofGutterHeater'
  | 'SaunaHeater'
  | 'SpaceHeater'
  | 'Thermostat'
  | 'TowelHeater'
  | 'WaterHeater'
  // Other
  | 'AlwaysOn'
  | 'DedicatedCircuit'
  | 'MysteryDevice'
  | 'MysteryHeat'
  | 'MysteryMotor'
  | 'OtherDevice'
  | 'SmartRelay';
