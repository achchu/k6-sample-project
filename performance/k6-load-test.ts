import http from "k6/http";
import { check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 }, //Gradually ramp up the users
    { duration: "1m", target: 100 }, // Peak load
    { duration: "30s", target: 0 }, //Gradually ramp down the users
  ],
};

export default function () {
  const baseUrl = __ENV.MARKET_API_BASE_URL || "http://localhost:4000/api/v1";
  const symbols = ["AAPL", "MSFT", "GOOGL"];
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];

  const healthRes = http.get(`${baseUrl}/health`);
  check(healthRes, {
    "Health check passes": (r) => r.status === 200,
  });

  const dailyUrl = `${baseUrl}/stocks/${symbol}/daily`;
  const res = http.get(dailyUrl);

  check(res, {
    "Response status is 200:": (r) => r.status === 200,
    "Response time is below 500ms": (r) => r.timings.duration < 500,
    "Response has time series data": (r) => r.json("Time Series (Daily)") !== undefined,
    "Response has meta data": (r) => r.json("Meta Data") !== undefined,
  });

}

