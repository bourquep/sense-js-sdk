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

import { EventEmitter as NodeEventEmitter } from 'node:events';

/**
 * Typed wrapper around Node's `EventEmitter` class.
 *
 * @remarks
 * Source: {@link https://blog.makerx.com.au/a-type-safe-event-emitter-in-node-js}
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export class EventEmitter<TEvents extends Record<string, any>> implements NodeJS.EventEmitter {
  private _emitter = new NodeEventEmitter();

  emit<TEventName extends keyof TEvents & string>(eventName: TEventName, ...eventArg: TEvents[TEventName]) {
    return this._emitter.emit(eventName, ...(eventArg as []));
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ) {
    this._emitter.on(eventName, handler as any);
    return this;
  }

  once<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ) {
    this._emitter.once(eventName, handler as any);
    return this;
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void
  ) {
    this._emitter.off(eventName, handler as any);
    return this;
  }

  addListener<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    listener: (...args: TEvents[TEventName]) => void
  ) {
    this._emitter.addListener(eventName, listener);
    return this;
  }

  removeListener<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    listener: (...args: TEvents[TEventName]) => void
  ) {
    this._emitter.removeListener(eventName, listener);
    return this;
  }

  removeAllListeners<TEventName extends keyof TEvents & string>(eventName?: TEventName | undefined) {
    this._emitter.removeAllListeners(eventName);
    return this;
  }

  setMaxListeners(n: number) {
    this._emitter.setMaxListeners(n);
    return this;
  }

  getMaxListeners(): number {
    return this._emitter.getMaxListeners();
  }

  listeners<TEventName extends keyof TEvents & string>(eventName: TEventName) {
    return this._emitter.listeners(eventName);
  }

  rawListeners<TEventName extends keyof TEvents & string>(eventName: TEventName) {
    return this._emitter.rawListeners(eventName);
  }

  listenerCount<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    listener?: (...args: TEvents[TEventName]) => void
  ) {
    return this._emitter.listenerCount(eventName, listener);
  }

  prependListener<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    listener: (...args: TEvents[TEventName]) => void
  ) {
    this._emitter.prependListener(eventName, listener);
    return this;
  }

  prependOnceListener<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    listener: (...args: TEvents[TEventName]) => void
  ) {
    this._emitter.prependOnceListener(eventName, listener);
    return this;
  }

  eventNames() {
    return this._emitter.eventNames();
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
