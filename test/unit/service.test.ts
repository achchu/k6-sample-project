import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockClient = {
  get: jest.fn(),
}

mockedAxios.create.mockReturnValue(mockClient as any);
mockedAxios.isAxiosError.mockImplementation(
  (error: any) => Boolean(error?.isAxiosError)
);

import { getDailyStockData, getIntradayData, listTrackedStocks } from "../../src/service";


describe("Service environment variables validation", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env.MARKET_API_BASE_URL = "http://localhost:4000/api/v1";
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it("should throw an error if API_KEY is missing", () => {
    process.env.MARKET_API_BASE_URL = "";

    expect(() => {
      jest.resetModules();
      require("../../src/service");
    }).toThrow(
      "Missing MARKET_API_BASE_URL: point it to the local market data API"
    );
  });
});

describe("Stock API Service", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockClient.get.mockReset();
  })

  const mockDailyResponse = {
    data: {
      "Time Series (Daily)": {
        "2025-01-10": {
          "1. open": "189.45",
          "2. high": "191.22",
          "3. low": "188.90",
          "4. close": "190.75",
          "5. volume": "98852000",
        },
      },
    },
  };

  describe("getDailyStockData", () => {
    it("returns daily data when the API call is successful", async () => {
      mockClient.get.mockResolvedValue(mockDailyResponse);
      const result = await getDailyStockData("AAPL");
      expect(mockClient.get).toHaveBeenCalledWith("/stocks/AAPL/daily" , {
        params: {},
      });
      expect(result).toEqual(mockDailyResponse.data);
    });

    it("passes optional limit parameter", async () => {
      mockClient.get.mockResolvedValue(mockDailyResponse);
      await getDailyStockData("AAPL", 3);
      expect(mockClient.get).toHaveBeenCalledWith("/stocks/AAPL/daily", {
        params: { limit: 3 },
      });
    });

    it("rethrows API errors", async () => {
      const apiError = Object.assign(new Error("Request failed"), {
        isAxiosError: true,
        response: { status: 500, data: "error" },
      });
      mockClient.get.mockRejectedValue(apiError);

      await expect(getDailyStockData("AAPL")).rejects.toBe(apiError);
    });

    it("logs unexpected errors", async () => {
      const unexpected = new Error("Boom");
      mockClient.get.mockRejectedValue(unexpected);

      const consoleSpy = jest.spyOn(console, "error");
      await expect(getDailyStockData("AAPL")).rejects.toThrow("Boom");
      expect(consoleSpy).toHaveBeenCalledWith(
        "API error fetching daily stock data:",
        unexpected
      );
    });
  });

  describe("getIntradayData", () => {
    const mockIntradayResponse = {
      data: {
        "Time Series (5min)": {
          "2025-01-10 09:30:00": {
            "1. open": "189.45",
            "2. high": "189.72",
            "3. low": "189.30",
            "4. close": "189.60",
            "5. volume": "612000",
          },
        },
      },
    };

    it("fetches intraday data with default interval", async () => {
      mockClient.get.mockResolvedValue(mockIntradayResponse);
      const result = await getIntradayData("AAPL");

      expect(mockClient.get).toHaveBeenCalledWith("/stocks/AAPL/intraday", {
        params: { interval: "5min" },
      });
      expect(result).toEqual(mockIntradayResponse.data);
    });

    it("allows overriding interval and limit", async () => {
      mockClient.get.mockResolvedValue(mockIntradayResponse);
      await getIntradayData("AAPL", "1min", 10);

      expect(mockClient.get).toHaveBeenCalledWith("/stocks/AAPL/intraday", {
        params: { interval: "1min", limit: 10 },
      });
    });

    it("rethrows API errors", async () => {
      const apiError = Object.assign(new Error("Timeout"), {
        isAxiosError: true,
        response: { status: 504, data: "Gateway Timeout" },
      });
      mockClient.get.mockRejectedValue(apiError);

      await expect(getIntradayData("AAPL")).rejects.toBe(apiError);
    });

    it("logs unexpected errors", async () => {
      const unexpected = new Error("Connection lost");
      mockClient.get.mockRejectedValue(unexpected);

      const consoleSpy = jest.spyOn(console, "error");
      await expect(getIntradayData("AAPL")).rejects.toThrow("Connection lost");
      expect(consoleSpy).toHaveBeenCalledWith(
        "API error fetching intraday data:",
        unexpected
      );
    });
  });

  describe("listTrackedStocks", () => {
    it("returns the tracked stocks list", async () => {
      const response = {
        data: { data: [{ symbol: "AAPL" }, { symbol: "MSFT" }] },
      };
      mockClient.get.mockResolvedValue(response);

      const result = await listTrackedStocks();
      expect(mockClient.get).toHaveBeenCalledWith("/stocks");
      expect(result).toEqual(response.data);
    });

    it("surface API errors when the list call fails", async () => {
      const apiError = Object.assign(new Error("Server down"), {
        isAxiosError: true,
      });
      mockClient.get.mockRejectedValue(apiError);

      await expect(listTrackedStocks()).rejects.toBe(apiError);
    });
  });
});
