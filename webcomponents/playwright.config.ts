import { defineConfig } from '@playwright/test';
import { join } from 'path';

export default defineConfig({
  testDir: join(__dirname, 'e2e'),
  use: {
    viewport: { width: 375, height: 667 },
    launchOptions: {
      args: ['--allow-file-access-from-files']
    }
  },
});
