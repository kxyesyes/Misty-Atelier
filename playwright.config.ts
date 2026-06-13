import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./playwright",
  webServer: {
    command: "npm run dev -- -p 3001",
    url: "http://localhost:3001",
    reuseExistingServer: true,
  },
  use: {
    baseURL: "http://localhost:3001",
    viewport: { width: 1440, height: 1000 },
  },
});
