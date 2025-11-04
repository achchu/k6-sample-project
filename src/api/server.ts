import express, { Request, Response } from "express";
import {
  availableIntervalsFor,
  buildDailyResponse,
  buildIntradayResponse,
  listStocks,
  symbolExists,
} from "./utils/stock-dataset";

const DEFAULT_PORT = Number(process.env.MARKET_API_PORT ?? 4000);
const MAX_DELAY_MS = 10_000;

const coerceToString = (value: unknown) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return typeof value === "string" ? value : undefined;
};

const parseLimit = (value: unknown) => {
  const raw = coerceToString(value);
  if (!raw) {
    return undefined;
  }
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }
  return parsed;
};

const parseDelay = (value: unknown) => {
  const raw = coerceToString(value);
  if (!raw) {
    return 0;
  }
  const parsed = Number.parseInt(raw, 10);
  if (Number.isNaN(parsed) || parsed < 0) {
    return 0;
  }
  return Math.min(parsed, MAX_DELAY_MS);
};

const respond = (res: Response, payload: unknown, delayMs: number) => {
  if (delayMs > 0) {
    setTimeout(() => {
      res.json(payload);
    }, delayMs);
    return;
  }
  res.json(payload);
};

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.get("/api/v1/health", (req: Request, res: Response) => {
    const delay = parseDelay(req.query.delay);
    respond(
      res,
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV ?? "development",
      },
      delay
    );
  });

  app.get("/api/v1/stocks", (req: Request, res: Response) => {
    const delay = parseDelay(req.query.delay);
    respond(res, { data: listStocks() }, delay);
  });

  app.get("/api/v1/stocks/:symbol", (req: Request, res: Response) => {
    const symbol = req.params.symbol.toUpperCase();
    if (!symbolExists(symbol)) {
      res.status(404).json({
        error: "SymbolNotFound",
        message: `Symbol '${symbol}' is not available in the dataset.`,
      });
      return;
    }

    const delay = parseDelay(req.query.delay);
    const intervals = availableIntervalsFor(symbol);
    respond(
      res,
      {
        data: {
          symbol,
          availableIntervals: intervals,
        },
      },
      delay
    );
  });

  app.get("/api/v1/stocks/:symbol/daily", (req: Request, res: Response) => {
    const symbol = req.params.symbol.toUpperCase();
    const limit = parseLimit(req.query.limit);

    const response = buildDailyResponse(symbol, limit);
    if (!response) {
      res.status(404).json({
        error: "SymbolNotFound",
        message: `Symbol '${symbol}' is not available in the dataset.`,
      });
      return;
    }

    respond(res, response, parseDelay(req.query.delay));
  });

  app.get("/api/v1/stocks/:symbol/intraday", (req: Request, res: Response) => {
    const symbol = req.params.symbol.toUpperCase();
    const interval = coerceToString(req.query.interval);
    const limit = parseLimit(req.query.limit);

    if (!interval) {
      res.status(400).json({
        error: "MissingInterval",
        message: "Query parameter 'interval' is required (e.g. 5min).",
      });
      return;
    }

    const response = buildIntradayResponse(symbol, interval, limit);
    if (response === null) {
      res.status(404).json({
        error: "SymbolNotFound",
        message: `Symbol '${symbol}' is not available in the dataset.`,
      });
      return;
    }

    if (response === undefined) {
      res.status(404).json({
        error: "IntervalNotFound",
        message: `Interval '${interval}' is not available for symbol '${symbol}'.`,
      });
      return;
    }

    respond(res, response, parseDelay(req.query.delay));
  });

  return app;
};

export const startServer = (
  port: number = DEFAULT_PORT,
  host: string = "0.0.0.0"
) => {
  const app = createApp();
  const server = app.listen(port, host, () => {
    console.log(
      `Market data API listening on ${host}:${port} (NODE_ENV=${
        process.env.NODE_ENV ?? "development"
      })`
    );
  });
  return server;
};

if (require.main === module) {
  const port = Number(process.env.MARKET_API_PORT ?? DEFAULT_PORT);
  startServer(port);
}

export default createApp;
