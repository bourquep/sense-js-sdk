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

import { SenseApiClient } from '@/api/SenseApiClient';
import { SenseApiError, UnauthenticatedError } from '@/index';
import { beforeEach, describe, expect, it } from 'vitest';

// Only run these tests if credentials are provided
const email = process.env.SENSE_TEST_EMAIL;
const password = process.env.SENSE_TEST_PASSWORD;
const mfaCode = process.env.SENSE_TEST_MFA_CODE;

// Skip all tests if credentials aren't available
const runTests = !!(email && password);

describe.runIf(runTests)('SenseApiClient E2E', () => {
  let client: SenseApiClient;

  it.runIf(mfaCode)('should perform full MFA authentication flow', async () => {
    client = new SenseApiClient();
    const mfaToken = await client.login(email!, password!);
    expect(mfaToken).toBeDefined();
    expect(mfaToken!.length).toBeGreaterThan(0);
    await client.completeMfaLogin(mfaToken!, mfaCode!, new Date());
    expect(client.isAuthenticated).toBe(true);
  });

  describe('Unauthenticated API Calls', () => {
    it('should throw for invalid username', async () => {
      client = new SenseApiClient();
      await expect(client.login('invalid@example.com', password!)).rejects.toThrow(SenseApiError);
    });

    it('should throw for invalid password', async () => {
      client = new SenseApiClient();
      await expect(client.login(email!, 'invalid')).rejects.toThrow(SenseApiError);
    });

    it('should fail to get monitor overview', async () => {
      client = new SenseApiClient();
      const monitorId = 123;
      await expect(client.getMonitorOverview(monitorId)).rejects.toThrow(UnauthenticatedError);
    });
  });

  describe('Authenticated API Calls', () => {
    beforeEach(async () => {
      // Authenticate before each test
      client = new SenseApiClient();
      const mfaToken = await client.login(email!, password!);
      if (mfaToken) {
        expect(mfaCode).toBeDefined();
        await client.completeMfaLogin(mfaToken!, mfaCode!, new Date());
      }
    });

    it('should reuse session', async () => {
      const client2 = new SenseApiClient(client.session);
      const monitorId = client.session!.monitorIds[0];
      const overview = await client2.getMonitorOverview(monitorId);

      expect(overview).toBeDefined();
      expect(overview.monitor_overview.monitor.id).toBe(monitorId);
    });

    it('should get monitor overview', async () => {
      const monitorId = client.session!.monitorIds[0];
      const overview = await client.getMonitorOverview(monitorId);

      expect(overview).toBeDefined();
      expect(overview.monitor_overview.monitor.id).toBe(monitorId);
    });

    it('should get monitor devices', async () => {
      const monitorId = client.session!.monitorIds[0];
      const devices = await client.getMonitorDevices(monitorId);

      expect(Array.isArray(devices)).toBe(true);
      if (devices.length > 0) {
        expect(devices[0].id).toBeDefined();
        expect(devices[0].id).toBeTypeOf('string');
        expect(devices[0].id.length).toBeGreaterThan(0);
        expect(devices[0].name).toBeDefined();
        expect(devices[0].name).toBeTypeOf('string');
        expect(devices[0].name.length).toBeGreaterThan(0);
      }
    });

    it('should get monitor trends', async () => {
      const monitorId = client.session!.monitorIds[0];
      const overview = await client.getMonitorOverview(monitorId);

      const trends = await client.getMonitorTrends(monitorId, overview.monitor_overview.monitor.time_zone, 'DAY');

      expect(trends).toBeDefined();
    });

    it('should connect to realtime updates and receive messages', async () => {
      const monitorId = client.session!.monitorIds[0];
      let receivedUpdate = false;

      // Listen for realtime updates
      client.emitter.on('realtimeUpdate', (id, data) => {
        expect(id).toBe(monitorId);
        expect(data).toBeDefined();
        receivedUpdate = true;
      });

      // Start realtime updates
      await client.startRealtimeUpdates(monitorId);

      // Wait for updates - realtime data typically arrives within a few seconds
      await new Promise<void>((resolve) => {
        const timeoutId = setTimeout(() => {
          // Timeout after 15 seconds
          client.stopRealtimeUpdates();
          resolve();
        }, 15000);

        const checkInterval = setInterval(() => {
          if (receivedUpdate) {
            clearTimeout(timeoutId);
            clearInterval(checkInterval);
            resolve();
          }
        }, 500);
      });

      // Stop the realtime updates
      await client.stopRealtimeUpdates();

      // Verify we received at least one update
      expect(receivedUpdate).toBe(true);
    }, 20000); // Increase timeout to 20 seconds

    it('should be able to stop realtime updates', async () => {
      const monitorId = client.session!.monitorIds[0];

      // Start realtime updates
      await client.startRealtimeUpdates(monitorId);

      // Ensure WebSocket is connected
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Stop the realtime updates
      await client.stopRealtimeUpdates();

      // Verify the connection is closed by attempting to start another one
      let secondConnectionStarted = false;

      client.emitter.on('realtimeUpdate', () => {
        secondConnectionStarted = true;
      });

      await client.startRealtimeUpdates(monitorId);

      // Wait a short time for a potential update to arrive
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Stop the second connection
      await client.stopRealtimeUpdates();

      // We expect to have successfully established a new connection after stopping the first one
      expect(secondConnectionStarted).toBe(true);
    }, 15000);

    it('should handle multiple calls to startRealtimeUpdates gracefully', async () => {
      const monitorId = client.session!.monitorIds[0];

      // Start realtime updates
      await client.startRealtimeUpdates(monitorId);

      // Try to start again without stopping - this should not throw an error
      await client.startRealtimeUpdates(monitorId);

      // Stop realtime updates
      await client.stopRealtimeUpdates();
    }, 10000);

    it('should handle multiple calls to stopRealtimeUpdates gracefully', async () => {
      // Call stop without starting first - should not throw
      await client.stopRealtimeUpdates();

      const monitorId = client.session!.monitorIds[0];

      // Start and then stop multiple times
      await client.startRealtimeUpdates(monitorId);
      await client.stopRealtimeUpdates();
      await client.stopRealtimeUpdates(); // Second stop should be a no-op

      // Should still be able to start again
      await client.startRealtimeUpdates(monitorId);
      await client.stopRealtimeUpdates();
    }, 10000);
  });
});
