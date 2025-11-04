import rawStocks from "../../fixtures/stocks.json";

export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type StockDataset = {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  daily: Record<string, Candle>;
  intraday: Record<string, Record<string, Candle>>;
}

const stocks = rawStocks as Record<string, StockDataset>;

const formatCandle = (candle: Candle) => ({
  "1. open": candle.open.toFixed(2),
  "2. high": candle.high.toFixed(2),
  "3. low": candle.low.toFixed(2),
  "4. close": candle.close.toFixed(2),
  "5. volume": candle.volume.toString(),
});

const sortEntriesDesc = <T>(entries: [string, T] []) =>
  entries.sort(([a], [b]) => (a<b ? 1 : a > b ? -1 : 0));

export const listStocks = () =>
  Object.values(stocks).map(({ symbol, name, sector, exchange, intraday }) => ({
    symbol,
    name, 
    sector,
    exchange,
    availableIntervals: Object.keys(intraday),
  }));

export const symbolExists = (symbol: string) =>
  Boolean(stocks[symbol.toUpperCase()]);

export const availableIntervalsFor = (symbol: string) => {
  const stock = stocks[symbol.toUpperCase()];
  return stock ? Object.keys(stock.intraday) : [];
};

export const buildDailyResponse = (symbol: string, limit?: number) => {
  const stock = stocks[symbol.toUpperCase()];
  if (!stock) {
    return null;
  }

  const sorted = sortEntriesDesc(Object.entries(stock.daily));
  const limited = typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  const timeSeries = limited.reduce<
    Record<string, ReturnType<typeof formatCandle>>
  >((acc, [timestamp, candle]) => {
    acc[timestamp] = formatCandle(candle);
    return acc;
  }, {});

  return {
    "Meta Data": {
      "1. Information": "Daily Prices (open, high, low, close) and Volumes",
      "2. Symbol": stock.symbol,
      "3. Last Refreshed": sorted[0]?.[0],
      "4. Output Size": typeof limit === "number" ? "compact" : "full",
      "5. Time Zone": "US/Eastern",
    },
    "Time Series (Daily)": timeSeries,
  };
};

export const buildIntradayResponse = (
  symbol: string,
  interval: string,
  limit?: number
) => {
  const stock = stocks[symbol.toUpperCase()];
  if (!stock) {
    return null;
  }

  const series = stock.intraday[interval];
  if (!series) {
    return undefined;
  }

  const sorted = sortEntriesDesc(Object.entries(series));
  const limited = typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  const timeSeries = limited.reduce<
    Record<string, ReturnType<typeof formatCandle>>
  >((acc, [timestamp, candle]) => {
    acc[timestamp] = formatCandle(candle);
    return acc;
  }, {});

  return {
    "Meta Data": {
      "1. Information": `Intraday (${interval}) prices and volumes`,
      "2. Symbol": stock.symbol,
      "3. Last Refreshed": sorted[0]?.[0],
      "4. Interval": interval,
      "5. Output Size": typeof limit === "number" ? "compact" : "full",
      "6. Time Zone": "US/Eastern",
    },
    [`Time Series (${interval})`]: timeSeries,
  };
};