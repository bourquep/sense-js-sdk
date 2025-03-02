import { SenseApiClient } from '@/api/SenseApiClient';
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
  });
});
