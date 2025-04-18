# Sense Energy Monitor JavaScript SDK

A JavaScript SDK for accessing the Sense Energy Monitor API.

## Description

This SDK provides a simple and intuitive way to interact with the Sense Energy Monitor API, allowing developers to
easily retrieve and manipulate data from their Sense Energy Monitor devices.

## Disclaimer

This SDK was developed without the consent of the Sense company, and makes use of an undocumented and unsupported API.
Use at your own risk, and be aware that Sense may change the API at any time and break this repository permanently.

## Installation

### Prerequisites

- You must own a [Sense Energy Monitor](https://sense.com) device or have credentials to access a working monitor.
- Node.js version 22.4.0 or higher.

```bash
# Using npm
npm install @bourquep/sense-js-sdk

# Using yarn
yarn add @bourquep/sense-js-sdk

# Using pnpm
pnpm add @bourquep/sense-js-sdk
```

## Using

The Sense SDK provides a simple interface to interact with the Sense Energy Monitor API.

### Basic Authentication

```typescript
import { SenseApiClient } from '@bourquep/sense-js-sdk';

// Create a new client
const client = new SenseApiClient();

// Login with your Sense credentials
const mfaToken = await client.login('your-email@example.com', 'your-password');

// If MFA is required, you'll receive an MFA token
if (mfaToken) {
  // Complete login with MFA code
  await client.completeMfaLogin(mfaToken, '123456', new Date());
}
```

### Getting Monitor Data

Once authenticated, you can access your monitor data:

```typescript
// Get the first monitor ID from your session
const monitorId = client.session?.monitorIds[0];

if (monitorId) {
  // Get monitor overview (power usage, etc.)
  const overview = await client.getMonitorOverview(monitorId);
  console.log('Current power usage:', overview.consumption.power);

  // Get devices detected by your monitor
  const devices = await client.getMonitorDevices(monitorId);
  console.log(
    'Detected devices:',
    devices.map((d) => d.name)
  );

  // Get trends (historical data)
  const trends = await client.getMonitorTrends(
    monitorId,
    'America/New_York', // Use your monitor's timezone
    'WEEK' // Scale: DAY, WEEK, MONTH, YEAR, or CYCLE
  );
  console.log('Weekly usage:', trends.consumption);
}
```

### Real-time Updates

The SDK also supports real-time updates through WebSockets:

```typescript
// Start real-time updates for your monitor
await client.startRealtimeUpdates(monitorId);

// Listen for updates
client.emitter.on('realtimeUpdate', (monitorId, data) => {
  console.log('Real-time update:', data);

  // Depending on the type of update, you'll get different data
  if (data.type === 'monitor_info') {
    console.log('Monitor info:', data.payload);
  } else if (data.type === 'data_change') {
    console.log('Power data:', data.payload);
  }
});

// When done, stop real-time updates
await client.stopRealtimeUpdates();
```

### Error Handling

The SDK provides specific error types to handle API errors:

```typescript
import { SenseApiError, UnauthenticatedError } from '@bourquep/sense-js-sdk';

try {
  const overview = await client.getMonitorOverview(monitorId);
} catch (error) {
  if (error instanceof UnauthenticatedError) {
    console.error('Session expired, please login again');
    // Handle re-authentication
  } else if (error instanceof SenseApiError) {
    console.error('API error:', error.message, error.status);
    // Handle API errors
  } else {
    console.error('Unexpected error:', error);
  }
}
```

### Advanced Configuration

You can customize the client with various options:

```typescript
import { SenseApiClient, Logger } from '@bourquep/sense-js-sdk';

// Custom logger implementation
class CustomLogger implements Logger {
  debug(message: string, ...args: any[]) {
    console.debug(`[SENSE]`, message, ...args);
  }
  info(message: string, ...args: any[]) {
    console.info(`[SENSE]`, message, ...args);
  }
  warn(message: string, ...args: any[]) {
    console.warn(`[SENSE]`, message, ...args);
  }
  error(message: string, ...args: any[]) {
    console.error(`[SENSE]`, message, ...args);
  }
}

// Create client with custom options
const client = new SenseApiClient(undefined, {
  logger: new CustomLogger(),
  apiUrl: 'https://api.sense.com/apiservice/api/v1', // Custom API URL if needed
  wssUrl: 'wss://clientrt.sense.com', // Custom WebSocket URL if needed
  autoReconnectRealtimeUpdates: true, // Auto-reconnect WebSocket if disconnected
  fetcher: customFetch // Custom fetch implementation if needed
});
```

## Contributing

If you want to contribute to this project, please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

`sense-js-sdk` is licensed under the GNU Public License v3. This means you are free to use, modify and redistribute this
software, provided that any derivative works you create are also licensed under GPL v3 and make their source code
available. The GPL v3 ensures that this software and any modifications remain free and open source.

## Copyright

© 2025 Pascal Bourque

## Support

For bug reports and feature requests, please use the [GitHub Issues](https://github.com/bourquep/sense-js-sdk/issues)
page.

For general questions and discussions, join our
[Discussion Forum](https://github.com/bourquep/sense-js-sdk/discussions).
