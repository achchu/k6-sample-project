import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const API_URL = process.env.ALPHA_VANTAGE_API_URL;

if (!API_KEY) {
  throw new Error(
    "Missing API_KEY: Ensure ALPHA_VANTAGE_API_KEY is set in environment variables."
  );
}

if (!API_URL) {
  throw new Error(
    "Missing API_URL: Ensure ALPHA_VANTAGE_API_URL is set in environment variables."
  );
}

export const getStockData = async (symbol: string) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        function: "TIME_SERIES_DAILY",
        symbol,
        apikey: API_KEY,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error?.isAxiosError) {
      console.error(
        "API Error fetching stock data:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error fetching stock data:", error);
    }
    throw error;
  }
};

export const getIntradayData = async (
  symbol: string,
  interval: string = "5min"
) => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        function: "TIME_SERIES_INTRADAY",
        symbol,
        interval,
        apikey: API_KEY,
      },
    });
    return response.data;
  } catch (error: any) {
    if (error?.isAxiosError) {
      console.error(
        "API Error fetching intraday data:",
        error.response?.data || error.message
      );
    } else {
      console.error("Unexpected error fetching intraday data:", error);
    }
    throw error;
  }
};
