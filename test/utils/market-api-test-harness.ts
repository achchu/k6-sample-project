import { startServer } from "../../src/api/server";

const LOOPBACK_HOST = "127.0.0.1";
const PROXY_ENV_VARS = [
  "HTTP_PROXY",
  "http_proxy",
  "HTTPS_PROXY",
  "https_proxy",
] as const;

type ProxyEnvKey = (typeof PROXY_ENV_VARS)[number];
type ServiceModule = typeof import("../../src/service");

type HarnessApi = Pick<
  ServiceModule,
  "getDailyStockData" | "getIntradayData" | "listTrackedStocks"
>;

type SavedEnv = {
  MARKET_API_BASE_URL?: string;
  MARKET_API_TIMEOUT_MS?: string;
  NO_PROXY?: string;
  proxy: Partial<Record<ProxyEnvKey, string | undefined>>;
};

export type MarketApiTestHarness = {
  api: HarnessApi;
  stop: () => Promise<void>;
};

export const createMarketApiHarness = async ({
  port,
  timeoutMs = 2000,
}: {
  port: number;
  timeoutMs?: number;
}): Promise<MarketApiTestHarness> => {
  const baseUrl = `http://${LOOPBACK_HOST}:${port}/api/v1`;
  const savedEnv: SavedEnv = {
    MARKET_API_BASE_URL: process.env.MARKET_API_BASE_URL,
    MARKET_API_TIMEOUT_MS: process.env.MARKET_API_TIMEOUT_MS,
    NO_PROXY: process.env.NO_PROXY,
    proxy: {},
  };

  PROXY_ENV_VARS.forEach((key) => {
    savedEnv.proxy[key] = process.env[key];
    delete process.env[key];
  });

  process.env.NO_PROXY = "127.0.0.1,localhost";
  process.env.MARKET_API_BASE_URL = baseUrl;
  process.env.MARKET_API_TIMEOUT_MS = timeoutMs.toString();

  jest.resetModules();
  const service = await import("../../src/service");

  const server = startServer(port, LOOPBACK_HOST);

  const stop = async () => {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );

    const { MARKET_API_BASE_URL, MARKET_API_TIMEOUT_MS, NO_PROXY } = savedEnv;

    if (typeof MARKET_API_BASE_URL === "undefined") {
      delete process.env.MARKET_API_BASE_URL;
    } else {
      process.env.MARKET_API_BASE_URL = MARKET_API_BASE_URL;
    }

    if (typeof MARKET_API_TIMEOUT_MS === "undefined") {
      delete process.env.MARKET_API_TIMEOUT_MS;
    } else {
      process.env.MARKET_API_TIMEOUT_MS = MARKET_API_TIMEOUT_MS;
    }

    if (typeof NO_PROXY === "undefined") {
      delete process.env.NO_PROXY;
    } else {
      process.env.NO_PROXY = NO_PROXY;
    }

    PROXY_ENV_VARS.forEach((key) => {
      const value = savedEnv.proxy[key];
      if (typeof value === "undefined") {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  };

  return {
    api: {
      getDailyStockData: service.getDailyStockData,
      getIntradayData: service.getIntradayData,
      listTrackedStocks: service.listTrackedStocks,
    },
    stop,
  };
};
