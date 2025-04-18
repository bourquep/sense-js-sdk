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

import { EventEmitter } from '@/lib/EventEmitter';
import { beforeEach, describe, expect, it } from 'vitest';

type TestEventTypes = {
  noParams: [];
  withParams: [param1: string, param2: number];
  withOptionalParams: [param1: string, param2?: number];
};

describe('EventEmitter', () => {
  let emitter = new EventEmitter<TestEventTypes>();

  beforeEach(() => {
    emitter = new EventEmitter<TestEventTypes>();
  });

  it('should emit events', () => {
    let emittedCount = 0;
    emitter.on('noParams', () => {
      emittedCount++;
    });

    emitter.emit('noParams');
    expect(emittedCount).toBe(1);
  });

  it('should emit events with parameters', () => {
    let emittedCount = 0;
    emitter.on('withParams', (param1, param2) => {
      emittedCount++;
      expect(param1).toBe('test');
      expect(param2).toBe(42);
    });

    emitter.emit('withParams', 'test', 42);
    expect(emittedCount).toBe(1);
  });

  it('should emit events with optional parameters', () => {
    let emittedCount = 0;
    emitter.on('withOptionalParams', (param1, param2) => {
      emittedCount++;
      expect(param1).toBe('test');
      expect(param2).toBe(42);
    });

    emitter.emit('withOptionalParams', 'test', 42);
    expect(emittedCount).toBe(1);
  });

  it('should emit events with missing optional parameters', () => {
    let emittedCount = 0;
    emitter.on('withOptionalParams', (param1, param2) => {
      emittedCount++;
      expect(param1).toBe('test');
      expect(param2).toBeUndefined();
    });

    emitter.emit('withOptionalParams', 'test');
    expect(emittedCount).toBe(1);
  });

  it('should only emit events with the correct event name', () => {
    let emittedCount = 0;
    emitter.on('noParams', () => {
      emittedCount++;
    });

    emitter.emit('withParams', 'test', 42);
    expect(emittedCount).toBe(0);
  });

  it('should emit events to all listeners', () => {
    let emittedCount = 0;
    emitter.on('noParams', () => {
      emittedCount++;
    });
    emitter.on('noParams', () => {
      emittedCount++;
    });

    emitter.emit('noParams');
    expect(emittedCount).toBe(2);
  });

  it('should not emit events to removed listeners', () => {
    let emittedCount = 0;
    const listener = () => {
      emittedCount++;
    };
    emitter.on('noParams', listener);
    emitter.off('noParams', listener);

    emitter.emit('noParams');
    expect(emittedCount).toBe(0);
  });
});
