import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL =
  process.env.MARKET_API_BASE_URL ?? "http://localhost:4000/api/v1";
const DEFAULT_TIMEOUT_MS = Number(process.env.MARKET_API_TIMEOUT_MS ?? 5000);

if (!BASE_URL) {
  throw new Error(
    "Missing MARKET_API_BASE_URL: point it to the local market data API."
  );
}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
});

const logError = (prefix: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    console.error(`${prefix}:`, error.response?.data ?? error.message);
  } else {
    console.error(`${prefix}:`, error);
  }
};

export const getDailyStockData = async (symbol: string, limit?: number) => {
  try {
    const params = typeof limit === "number" ? { limit } : {};
    const response = await client.get(`/stocks/${symbol}/daily`, { params });
    return response.data;
  } catch (error) {
    logError("API error fetching daily stock data", error);
    throw error;
  }
};

export const getIntradayData = async (
  symbol: string,
  interval: string = "5min",
  limit?: number
) => {
  try {
    const params = {
      interval,
      ...(typeof limit === "number" ? { limit } : {}),
    };
    const response = await client.get(`/stocks/${symbol}/intraday`, {
      params,
    });
    return response.data;
  } catch (error) {
    logError("API error fetching intraday data", error);
    throw error;
  }
};

export const listTrackedStocks = async () => {
  try {
    const response = await client.get("/stocks");
    return response.data;
  } catch (error) {
    logError("API error listing tracked stocks", error);
    throw error;
  }
};
