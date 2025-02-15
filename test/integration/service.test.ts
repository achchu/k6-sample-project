import { getIntradayData, getStockData } from "../../src/service";

describe("Integration tests for stock data service", () => {
  it("should fetch daily stock data successfully", async () => {
    const result = await getStockData("AAPL");
    expect(result).toHaveProperty("Time Series (Daily)");
  });

  it("should fetch intraday stock data successfully", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const result = await getIntradayData("AAPL", "5min");
    expect(result).toHaveProperty("Time Series (5min)");
  });

  it("should return an error for invalid stock symbol", async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await expect(getStockData("INAVLID_SYMBOL")).resolves.toHaveProperty(
      "Error Message"
    ); //Checking resposne instead of error due to nature of API
  });
});
