import { SenseApiError, UnauthenticatedError } from '@/api/Errors';
import { Logger } from '@/api/Logger';
import { SenseApiClient } from '@/api/SenseApiClient';
import { Device } from '@/types/Device';
import { MonitorOverview } from '@/types/MonitorOverview';
import { Session } from '@/types/Session';
import { Trends } from '@/types/Trends';
import dayjs from 'dayjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

// Helper function to create a JWT token with specific expiration
const createJwtToken = (expSeconds: number, userId: number = 123) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
  const payload = Buffer.from(JSON.stringify({ exp: expSeconds, userId })).toString('base64');
  const signature = 'dummy-signature';
  return `t1.v2.${header}.${payload}.${signature}`;
};

describe('SenseApiClient constructor', () => {
  it('should be able to create a new instance', () => {
    const client = new SenseApiClient();
    expect(client).toBeDefined();
    expect(client.session).toBeUndefined();
  });

  it('should initialize itself with the session object', () => {
    const session: Session = { userId: 123, monitorIds: [456], accessToken: 'abc', refreshToken: 'def' };
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
    userId: 123,
    monitorIds: [456],
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
    const session: Session = { userId: 123, monitorIds: [456], accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    expect(client.isAuthenticated).toBe(true);
  });
});

describe('SenseApiClient.session', () => {
  it('should trigger the onSessionChange event when set', () => {
    const session: Session = { userId: 123, monitorIds: [456], accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient();
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session;
    expect(spy).toHaveBeenCalledWith(session);
  });

  it('should trigger the onSessionChange event when cleared', () => {
    const session: Session = { userId: 123, monitorIds: [456], accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = undefined;
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it('should trigger the onSessionChange event when updated', () => {
    const session1: Session = { userId: 123, monitorIds: [456], accessToken: 'abc', refreshToken: 'def' };
    const session2: Session = { userId: 456, monitorIds: [789], accessToken: 'ghi', refreshToken: 'jkl' };
    const client = new SenseApiClient(session1);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session2;
    expect(spy).toHaveBeenCalledWith(session2);
  });

  it('should not trigger the onSessionChange event when not updated', () => {
    const session: Session = { userId: 123, monitorIds: [456], accessToken: 'abc', refreshToken: 'def' };
    const client = new SenseApiClient(session);
    const spy = vi.fn();
    client.emitter.on('sessionChanged', spy);
    client['session'] = session;
    expect(spy).not.toHaveBeenCalled();
  });
});

describe('SenseApiClient.login', () => {
  const mockFetch = vi.fn();
  const email = 'test@example.com';
  const password = 'password123';

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('successful login without MFA', () => {
    it('should authenticate successfully and create session', async () => {
      const mockAuthResponse = {
        user_id: 123,
        monitors: [{ id: 456 }, { id: 789 }],
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      });

      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      const sessionChangedSpy = vi.fn();
      client.emitter.on('sessionChanged', sessionChangedSpy);

      const result = await client.login(email, password);

      expect(result).toBeUndefined();
      expect(client.session).toEqual({
        userId: mockAuthResponse.user_id,
        monitorIds: [456, 789],
        accessToken: mockAuthResponse.access_token,
        refreshToken: mockAuthResponse.refresh_token
      });
      expect(sessionChangedSpy).toHaveBeenCalledWith(client.session);
      expect(mockFetch).toHaveBeenCalledWith('https://api.sense.com/apiservice/api/v1/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: expect.any(URLSearchParams)
      });

      const body = mockFetch.mock.calls[0][1].body;
      expect(body.get('email')).toBe(email);
      expect(body.get('password')).toBe(password);
    });

    it('should clear existing session before login attempt', async () => {
      const existingSession = {
        userId: 999,
        monitorIds: [888],
        accessToken: 'old-token',
        refreshToken: 'old-refresh'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user_id: 123,
            monitors: [{ id: 456 }],
            access_token: 'new-token',
            refresh_token: 'new-refresh'
          })
      });

      const client = new SenseApiClient(existingSession, { fetcher: mockFetch });
      const sessionChangedSpy = vi.fn();
      client.emitter.on('sessionChanged', sessionChangedSpy);

      await client.login(email, password);

      expect(sessionChangedSpy).toHaveBeenCalledTimes(2);
      expect(sessionChangedSpy).toHaveBeenNthCalledWith(1, undefined);
      expect(sessionChangedSpy).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          accessToken: 'new-token'
        })
      );
    });
  });

  describe('MFA required scenario', () => {
    it('should return MFA token when MFA is required', async () => {
      const mockMfaResponse = {
        mfa_token: 'test-mfa-token'
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve(mockMfaResponse)
      });

      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      const result = await client.login(email, password);

      expect(result).toBe('test-mfa-token');
      expect(client.session).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('should throw SenseApiError on authentication failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      });

      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      await expect(client.login(email, password)).rejects.toThrow(SenseApiError);
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      await expect(client.login(email, password)).rejects.toThrow('Network error');
    });
  });
});

describe('SenseApiClient.completeMfaLogin', () => {
  const mockFetch = vi.fn();
  const mfaToken = 'test-mfa-token';
  const oneTimePassword = '123456';
  const clientDate = new Date('2024-01-01T12:00:00Z');

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe('successful MFA completion', () => {
    it('should complete MFA authentication and create session', async () => {
      const mockAuthResponse = {
        user_id: 123,
        monitors: [{ id: 456 }],
        access_token: 'mfa-access-token',
        refresh_token: 'mfa-refresh-token'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAuthResponse)
      });

      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      const sessionChangedSpy = vi.fn();
      client.emitter.on('sessionChanged', sessionChangedSpy);

      await client.completeMfaLogin(mfaToken, oneTimePassword, clientDate);

      expect(client.session).toEqual({
        userId: mockAuthResponse.user_id,
        monitorIds: [456],
        accessToken: mockAuthResponse.access_token,
        refreshToken: mockAuthResponse.refresh_token
      });
      expect(sessionChangedSpy).toHaveBeenCalledWith(client.session);
      expect(mockFetch).toHaveBeenCalledWith('https://api.sense.com/apiservice/api/v1/authenticate/mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: expect.any(URLSearchParams)
      });

      const body = mockFetch.mock.calls[0][1].body;
      expect(body.get('totp')).toBe(oneTimePassword);
      expect(body.get('mfa_token')).toBe(mfaToken);
      expect(body.get('client_time')).toBe(clientDate.toISOString());
    });

    it('should update existing session after MFA completion', async () => {
      const existingSession = {
        userId: 999,
        monitorIds: [888],
        accessToken: 'old-token',
        refreshToken: 'old-refresh'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            user_id: 123,
            monitors: [{ id: 456 }],
            access_token: 'new-token',
            refresh_token: 'new-refresh'
          })
      });

      const client = new SenseApiClient(existingSession, { fetcher: mockFetch });
      const sessionChangedSpy = vi.fn();
      client.emitter.on('sessionChanged', sessionChangedSpy);

      await client.completeMfaLogin(mfaToken, oneTimePassword, clientDate);

      expect(sessionChangedSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: 'new-token'
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw SenseApiError on MFA verification failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Invalid MFA code'
      });

      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      await expect(client.completeMfaLogin(mfaToken, oneTimePassword, clientDate)).rejects.toThrow(SenseApiError);
    });

    it('should handle network errors during MFA completion', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const client = new SenseApiClient(undefined, { fetcher: mockFetch });
      await expect(client.completeMfaLogin(mfaToken, oneTimePassword, clientDate)).rejects.toThrow('Network error');
    });
  });
});

describe('SenseApiClient.refreshAccessTokenIfNeeded', () => {
  const mockFetch = vi.fn();

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
        userId: 123,
        monitorIds: [456],
        accessToken: 'invalid-token',
        refreshToken: 'refresh-token'
      };
      const client = new SenseApiClient(session, { fetcher: mockFetch });

      await expect(client['refreshAccessTokenIfNeeded']()).rejects.toThrow(UnauthenticatedError);
      expect(client.session).toBeUndefined();
    });

    it('should throw UnauthenticatedError and clear session for token without expiration', async () => {
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
      const payload = Buffer.from(JSON.stringify({ userId: 123 })).toString('base64');
      const token = `t1.v2.${header}.${payload}.signature`;

      const session: Session = {
        userId: 123,
        monitorIds: [456],
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
        userId: 123,
        monitorIds: [456],
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
        userId: 123,
        monitorIds: [456],
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
        userId: 123,
        monitorIds: [456],
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
      expect(body.get('user_id')).toBe('123');
      expect(body.get('refresh_token')).toBe('refresh-token');
    });

    it('should handle non-prefixed JWT tokens', async () => {
      const soonExp = dayjs().add(10, 'minutes').unix();
      const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
      const payload = Buffer.from(JSON.stringify({ exp: soonExp, userId: 123 })).toString('base64');
      const token = `${header}.${payload}.signature`;

      const session: Session = {
        userId: 123,
        monitorIds: [456],
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
        userId: 123,
        monitorIds: [456],
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
        userId: 123,
        monitorIds: [456],
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
        userId: 123,
        monitorIds: [456],
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
        userId: 123,
        monitorIds: [456],
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

describe('SenseApiClient.getMonitorOverview', () => {
  const mockFetch = vi.fn();
  const monitorId = 456;
  const validSession: Session = {
    userId: 123,
    monitorIds: [456],
    accessToken: createJwtToken(dayjs().add(1, 'hour').unix()),
    refreshToken: 'refresh-token'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should fetch monitor overview successfully', async () => {
    const mockOverview = mock<MonitorOverview>();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockOverview)
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    const result = await client.getMonitorOverview(monitorId);

    expect(result).toEqual(mockOverview);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.sense.com/apiservice/api/v1/app/monitors/${monitorId}/overview`,
      {
        headers: {
          Authorization: `Bearer ${validSession.accessToken}`
        }
      }
    );
  });

  it('should throw SenseApiError when request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    await expect(client.getMonitorOverview(monitorId)).rejects.toThrow(SenseApiError);
  });

  it('should throw UnauthenticatedError when no session exists', async () => {
    const client = new SenseApiClient(undefined, { fetcher: mockFetch });
    await expect(client.getMonitorOverview(monitorId)).rejects.toThrow(UnauthenticatedError);
  });
});

describe('SenseApiClient.getMonitorDevices', () => {
  const mockFetch = vi.fn();
  const monitorId = 456;
  const validSession: Session = {
    userId: 123,
    monitorIds: [456],
    accessToken: createJwtToken(dayjs().add(1, 'hour').unix()),
    refreshToken: 'refresh-token'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should fetch monitor devices successfully', async () => {
    const mockDevices = mock<Device[]>();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockDevices)
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    const result = await client.getMonitorDevices(monitorId);

    expect(result).toEqual(mockDevices);
    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.sense.com/apiservice/api/v1/app/monitors/${monitorId}/devices`,
      {
        headers: {
          Authorization: `Bearer ${validSession.accessToken}`
        }
      }
    );
  });

  it('should throw SenseApiError when request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    await expect(client.getMonitorDevices(monitorId)).rejects.toThrow(SenseApiError);
  });

  it('should throw UnauthenticatedError when no session exists', async () => {
    const client = new SenseApiClient(undefined, { fetcher: mockFetch });
    await expect(client.getMonitorDevices(monitorId)).rejects.toThrow(UnauthenticatedError);
  });
});

describe('SenseApiClient.getMonitorTrends', () => {
  const mockFetch = vi.fn();
  const monitorId = 456;
  const timezone = 'America/New_York';
  const validSession: Session = {
    userId: 123,
    monitorIds: [456],
    accessToken: createJwtToken(dayjs().add(1, 'hour').unix()),
    refreshToken: 'refresh-token'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should fetch trends successfully with default start date', async () => {
    const mockTrends = mock<Trends>();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTrends)
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    const result = await client.getMonitorTrends(monitorId, timezone, 'DAY');

    expect(result).toEqual(mockTrends);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.toSatisfy((url: URL) => url.toString().startsWith(`${client['_apiUrl']}/app/history/trends`)),
      expect.any(Object)
    );
  });

  it('should fetch trends successfully with custom start date', async () => {
    const startDate = new Date('2023-01-01');
    const mockTrends = mock<Trends>();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTrends)
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    const result = await client.getMonitorTrends(monitorId, timezone, 'DAY', startDate);

    expect(result).toEqual(mockTrends);
    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get('monitor_id')).toBe(monitorId.toString());
    expect(url.searchParams.get('scale')).toBe('DAY');
    expect(url.searchParams.get('start')).toBeDefined();
  });

  it('should handle invalid timezone gracefully', async () => {
    const mockTrends = mock<Trends>();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTrends)
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    const result = await client.getMonitorTrends(monitorId, 'Invalid/Timezone', 'DAY');

    expect(result).toEqual(mockTrends);
  });

  it('should throw SenseApiError when request fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found'
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    await expect(client.getMonitorTrends(monitorId, timezone, 'DAY')).rejects.toThrow(SenseApiError);
  });

  it('should throw UnauthenticatedError when no session exists', async () => {
    const client = new SenseApiClient(undefined, { fetcher: mockFetch });
    await expect(client.getMonitorTrends(monitorId, timezone, 'DAY')).rejects.toThrow(UnauthenticatedError);
  });

  it('should handle different trend scales correctly', async () => {
    const mockTrends = mock<Trends>();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTrends)
    });

    const client = new SenseApiClient(validSession, { fetcher: mockFetch });
    await client.getMonitorTrends(monitorId, timezone, 'WEEK');

    const url = new URL(mockFetch.mock.calls[0][0]);
    expect(url.searchParams.get('scale')).toBe('WEEK');
  });
});
