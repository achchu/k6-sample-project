import type { MarketApiTestHarness } from "../utils/market-api-test-harness";
import { createMarketApiHarness } from "../utils/market-api-test-harness";

const TEST_PORT = 4050;

describe("Integration tests for market data service", () => {
  let harness: MarketApiTestHarness;
  let api: MarketApiTestHarness["api"];

  beforeAll(async () => {
    harness = await createMarketApiHarness({ port: TEST_PORT });
    api = harness.api;
  });

  afterAll(async () => {
    await harness.stop();
  });

  it("fetches daily stock data successfully", async () => {
    const result = await api.getDailyStockData("AAPL");
    expect(result).toHaveProperty("Time Series (Daily)");
    expect(result["Time Series (Daily)"]).toHaveProperty("2025-01-10");
  });

  it("fetches intraday data for the configured interval", async () => {
    const result = await api.getIntradayData("AAPL", "5min", 2);
    expect(result).toHaveProperty("Time Series (5min)");
    expect(Object.keys(result["Time Series (5min)"]).length).toBeLessThanOrEqual(
      2
    );
  });

  it("lists the tracked stocks", async () => {
    const response = await api.listTrackedStocks();
    expect(response).toHaveProperty("data");
    const symbols = response.data.map((entry: { symbol: string }) => entry.symbol);
    expect(symbols).toEqual(expect.arrayContaining(["AAPL", "MSFT", "GOOGL"]));
  });

  it("surfaces 404s for unknown symbols", async () => {
    await expect(api.getDailyStockData("INVALID")).rejects.toMatchObject({
      response: { status: 404 },
    });
  });
});
