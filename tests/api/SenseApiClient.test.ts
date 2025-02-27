import { SenseApiClient } from '@/api/SenseApiClient';
import { Session } from '@/index';
import { describe, expect, it, test, vi } from 'vitest';

describe('SenseApiClient', () => {
  it('should be able to create a new instance', () => {
    const client = new SenseApiClient();
    expect(client).toBeDefined();
    expect(client.session).toBeUndefined();
  });

  it('should initialize itself with the session object', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    expect(client).toBeDefined();
    expect(client.session).toEqual(session);
  });

  test('isAuthenticated should return false if the session is not set', () => {
    const client = new SenseApiClient();
    expect(client.isAuthenticated).toBe(false);
  });

  test('isAuthenticated should return true if the session is set', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    expect(client.isAuthenticated).toBe(true);
  });

  it('should trigger the onSessionChange event when the session is set', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient();
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session;
    expect(spy).toHaveBeenCalledWith(session);
  });

  it('should trigger the onSessionChange event when the session is cleared', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = undefined;
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('should trigger the onSessionChange event when the session is updated', () => {
    const session1: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const session2: Session = { userId: '456', accessToken: 'ghi', refreshToken: 'jkl' };
    const client = new SenseApiClient(session1);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session2;
    expect(spy).toHaveBeenCalledWith(session2);
  });

  it('should not trigger the onSessionChange event when the session is not updated', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session;
    expect(spy).not.toHaveBeenCalled();
  });
});
