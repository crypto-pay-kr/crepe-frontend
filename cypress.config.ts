import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173", // 프론트엔드 서버 URL
    supportFile: "cypress/support/e2e.ts", // support 파일 경로
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});