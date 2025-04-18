import 'dotenv/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: './tests',
    environment: 'node',
    reporters: ['vitest-ctrf-json-reporter', 'default']
  }
});
