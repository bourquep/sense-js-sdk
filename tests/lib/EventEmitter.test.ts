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
