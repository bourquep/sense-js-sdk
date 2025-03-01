import { Logger } from '@/api/Logger';
import { SenseApiClient } from '@/api/SenseApiClient';
import { Session } from '@/types/Session';
import { describe, expect, it, vi } from 'vitest';

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
