import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "test/(.*)": "<rootDir>/test/$1",
  },
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testMatch: ["<rootDir>/test/unit/**/*.test.ts"],
      setupFiles: ["<rootDir>/test/setup/unit.setup.ts"],
    },
    {
      displayName: "integration",
      preset: "ts-jest",
      testMatch: ["<rootDir>/test/integration/**/*.test.ts"],
      setupFiles: ["<rootDir>/test/setup/integration.setup.ts"],
    },
  ],
};

export default config;
