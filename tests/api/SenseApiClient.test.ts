import { SenseApiError, UnauthenticatedError } from '@/api/Errors';
import { Logger } from '@/api/Logger';
import { SenseApiClient } from '@/api/SenseApiClient';
import { Session } from '@/types/Session';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('SenseApiClient constructor', () => {
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
});

describe('SenseApiClient constructor options', () => {
  const mockLogger: Logger = {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {}
  };

  const mockFetcher = vi.fn() as typeof fetch;
  const customApiUrl = 'https://custom-api.sense.com/v1';
  const customWssUrl = 'wss://custom-ws.sense.com';

  const session: Session = {
    userId: '123',
    accessToken: 'abc',
    refreshToken: 'def'
  };

  // Default values tests
  describe('default options', () => {
    it('should use default values when no options are provided', () => {
      const client = new SenseApiClient();
      expect(client['_logger']).toBeDefined();
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe('https://api.sense.com/apiservice/api/v1');
      expect(client['_wssUrl']).toBe('wss://clientrt.sense.com');
    });

    it('should use default values with only session provided', () => {
      const client = new SenseApiClient(session);
      expect(client.session).toEqual(session);
      expect(client['_logger']).toBeDefined();
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe('https://api.sense.com/apiservice/api/v1');
      expect(client['_wssUrl']).toBe('wss://clientrt.sense.com');
    });
  });

  // Individual options tests
  describe('individual options', () => {
    it('should use custom logger when provided', () => {
      const client = new SenseApiClient(undefined, { logger: mockLogger });
      expect(client['_logger']).toBe(mockLogger);
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe('https://api.sense.com/apiservice/api/v1');
      expect(client['_wssUrl']).toBe('wss://clientrt.sense.com');
    });

    it('should use custom fetcher when provided', () => {
      const client = new SenseApiClient(undefined, { fetcher: mockFetcher });
      expect(client['_logger']).toBeDefined();
      expect(client['_fetcher']).toBe(mockFetcher);
      expect(client['_apiUrl']).toBe('https://api.sense.com/apiservice/api/v1');
      expect(client['_wssUrl']).toBe('wss://clientrt.sense.com');
    });

    it('should use custom apiUrl when provided', () => {
      const client = new SenseApiClient(undefined, { apiUrl: customApiUrl });
      expect(client['_logger']).toBeDefined();
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe(customApiUrl);
      expect(client['_wssUrl']).toBe('wss://clientrt.sense.com');
    });

    it('should use custom wssUrl when provided', () => {
      const client = new SenseApiClient(undefined, { wssUrl: customWssUrl });
      expect(client['_logger']).toBeDefined();
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe('https://api.sense.com/apiservice/api/v1');
      expect(client['_wssUrl']).toBe(customWssUrl);
    });
  });

  // Combination tests
  describe('option combinations', () => {
    it('should handle all options together', () => {
      const client = new SenseApiClient(session, {
        logger: mockLogger,
        fetcher: mockFetcher,
        apiUrl: customApiUrl,
        wssUrl: customWssUrl
      });
      expect(client.session).toEqual(session);
      expect(client['_logger']).toBe(mockLogger);
      expect(client['_fetcher']).toBe(mockFetcher);
      expect(client['_apiUrl']).toBe(customApiUrl);
      expect(client['_wssUrl']).toBe(customWssUrl);
    });

    it('should handle logger and fetcher combination', () => {
      const client = new SenseApiClient(undefined, {
        logger: mockLogger,
        fetcher: mockFetcher
      });
      expect(client['_logger']).toBe(mockLogger);
      expect(client['_fetcher']).toBe(mockFetcher);
      expect(client['_apiUrl']).toBe('https://api.sense.com/apiservice/api/v1');
      expect(client['_wssUrl']).toBe('wss://clientrt.sense.com');
    });

    it('should handle apiUrl and wssUrl combination', () => {
      const client = new SenseApiClient(undefined, {
        apiUrl: customApiUrl,
        wssUrl: customWssUrl
      });
      expect(client['_logger']).toBeDefined();
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe(customApiUrl);
      expect(client['_wssUrl']).toBe(customWssUrl);
    });

    it('should handle logger and URLs combination', () => {
      const client = new SenseApiClient(undefined, {
        logger: mockLogger,
        apiUrl: customApiUrl,
        wssUrl: customWssUrl
      });
      expect(client['_logger']).toBe(mockLogger);
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe(customApiUrl);
      expect(client['_wssUrl']).toBe(customWssUrl);
    });

    it('should handle fetcher and URLs combination', () => {
      const client = new SenseApiClient(undefined, {
        fetcher: mockFetcher,
        apiUrl: customApiUrl,
        wssUrl: customWssUrl
      });
      expect(client['_logger']).toBeDefined();
      expect(client['_fetcher']).toBe(mockFetcher);
      expect(client['_apiUrl']).toBe(customApiUrl);
      expect(client['_wssUrl']).toBe(customWssUrl);
    });
  });

  // Session with options tests
  describe('session with options', () => {
    it('should handle session with partial options', () => {
      const client = new SenseApiClient(session, {
        logger: mockLogger,
        apiUrl: customApiUrl
      });
      expect(client.session).toEqual(session);
      expect(client['_logger']).toBe(mockLogger);
      expect(client['_fetcher']).toBe(fetch);
      expect(client['_apiUrl']).toBe(customApiUrl);
      expect(client['_wssUrl']).toBe('wss://clientrt.sense.com');
    });
  });
});

describe('SenseApiClient.isAuthenticated', () => {
  it('should return false if the session is not set', () => {
    const client = new SenseApiClient();
    expect(client.isAuthenticated).toBe(false);
  });

  it('should return true if the session is set', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    expect(client.isAuthenticated).toBe(true);
  });
});

describe('SenseApiClient.session', () => {
  it('should trigger the onSessionChange event when set', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient();
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session;
    expect(spy).toHaveBeenCalledWith(session);
  });

  it('should trigger the onSessionChange event when cleared', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = undefined;
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('should trigger the onSessionChange event when updated', () => {
    const session1: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const session2: Session = { userId: '456', accessToken: 'ghi', refreshToken: 'jkl' };
    const client = new SenseApiClient(session1);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session2;
    expect(spy).toHaveBeenCalledWith(session2);
  });

  it('should not trigger the onSessionChange event when not updated', () => {
    const session: Session = { userId: '123', accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session;
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('SenseApiClient.refreshAccessTokenIfNeeded', () => {
  const mockFetch = vi.fn();

  // Helper function to create a JWT token with specific expiration
  const createJwtToken = (expSeconds: number, userId: string = 'test-user') => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const payload = Buffer.from(JSON.stringify({ exp: expSeconds, userId })).toString('base64');
    const signature = 'dummy-signature';
    return `t1.v2.${header}.${payload}.${signature}`;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('error cases', () => {
    it('should throw UnauthenticatedError when no session exists', async () => {
      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      await expect(client['refreshAccessTokenIfNeeded']()).rejects.toThrow(UnauthenticatedError);
      await expect(client['refreshAccessTokenIfNeeded']()).rejects.toThrow(
        'An attempt was made to access a resource without a valid session'
      );
    });

    it('should throw UnauthenticatedError and clear session for invalid token format', async () => {
      const session: Session = {
        userId: 'test-user',
        accessToken: 'invalid-token',
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      await expect(client['refreshAccessTokenIfNeeded']()).rejects.toThrow(UnauthenticatedError);
      expect(client.session).toBeUndefined();
    });

    it('should throw UnauthenticatedError and clear session for token without expiration', async () => {
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
      const payload = Buffer.from(JSON.stringify({ userId: 'test-user' })).toString('base64');
      const token = `t1.v2.${header}.${payload}.signature`;

      const session: Session = {
        userId: 'test-user',
        accessToken: token,
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      await expect(client['refreshAccessTokenIfNeeded']()).rejects.toThrow(UnauthenticatedError);
      expect(client.session).toBeUndefined();
    });

    it('should throw UnauthenticatedError and clear session for token without userId', async () => {
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
      const payload = Buffer.from(JSON.stringify({ exp: dayjs().unix() })).toString('base64');
      const token = `t1.v2.${header}.${payload}.signature`;

      const session: Session = {
        userId: 'test-user',
        accessToken: token,
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      await expect(client['refreshAccessTokenIfNeeded']()).rejects.toThrow(UnauthenticatedError);
      expect(client.session).toBeUndefined();
    });
  });

  describe('token refresh scenarios', () => {
    it('should not refresh token if it is not expiring soon', async () => {
      const futureExp = dayjs().add(1, 'hour').unix();
      const session: Session = {
        userId: 'test-user',
        accessToken: createJwtToken(futureExp),
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      await client['refreshAccessTokenIfNeeded']();
      expect(mockFetch).not.toHaveBeenCalled();
      expect(client.session).toBe(session);
    });

    it('should refresh token if it is expiring soon', async () => {
      const soonExp = dayjs().add(10, 'minutes').unix();
      const session: Session = {
        userId: 'test-user',
        accessToken: createJwtToken(soonExp),
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token'
          })
      });

      await client['refreshAccessTokenIfNeeded']();

      expect(mockFetch).toHaveBeenCalledWith('https://api.sense.com/apiservice/api/v1/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: expect.any(URLSearchParams)
      });

      const body = mockFetch.mock.calls[0][1].body;
      expect(body.get('user_id')).toBe('test-user');
      expect(body.get('refresh_token')).toBe('refresh-token');
    });

    it('should handle non-prefixed JWT tokens', async () => {
      const soonExp = dayjs().add(10, 'minutes').unix();
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
      const payload = Buffer.from(JSON.stringify({ exp: soonExp, userId: 'test-user' })).toString('base64');
      const token = `${header}.${payload}.signature`;

      const session: Session = {
        userId: 'test-user',
        accessToken: token,
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'new-access-token',
            refresh_token: 'new-refresh-token'
          })
      });

      await client['refreshAccessTokenIfNeeded']();
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should throw SenseApiError when refresh request fails', async () => {
      const soonExp = dayjs().add(10, 'minutes').unix();
      const session: Session = {
        userId: 'test-user',
        accessToken: createJwtToken(soonExp),
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Invalid refresh token'
      });

      await expect(client['refreshAccessTokenIfNeeded']()).rejects.toThrow(SenseApiError);
      expect(client.session).toBeDefined(); // Session should not be cleared for transient errors
    });

    it('should update session with new tokens after successful refresh', async () => {
      const soonExp = dayjs().add(10, 'minutes').unix();
      const session: Session = {
        userId: 'test-user',
        accessToken: createJwtToken(soonExp),
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      const newTokens = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(newTokens)
      });

      const sessionChangedSpy = vi.fn();
      client.emitter.on('sessionChanged', sessionChangedSpy);

      await client['refreshAccessTokenIfNeeded']();

      expect(client.session).toEqual({
        ...session,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token
      });
      expect(sessionChangedSpy).toHaveBeenCalledWith(client.session);
    });
  });

  describe('return values', () => {
    it('should return the existing access token when not expired', async () => {
      const futureExp = dayjs().add(1, 'hour').unix();
      const existingToken = createJwtToken(futureExp);
      const session: Session = {
        userId: 'test-user',
        accessToken: existingToken,
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      const result = await client['refreshAccessTokenIfNeeded']();

      expect(result).toBe(existingToken);
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should return the new access token after successful refresh', async () => {
      const soonExp = dayjs().add(10, 'minutes').unix();
      const session: Session = {
        userId: 'test-user',
        accessToken: createJwtToken(soonExp),
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      const newAccessToken = 'new-access-token';
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: newAccessToken,
            refresh_token: 'new-refresh-token'
          })
      });

      const result = await client['refreshAccessTokenIfNeeded']();

      expect(result).toBe(newAccessToken);
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
