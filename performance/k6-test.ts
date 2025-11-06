import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 1,
  iterations: 5,
  ext: {
    loadimpact: {
      name: "Market API Performance Test",
    },
  },
};

export default function () {
  const baseUrl = __ENV.MARKET_API_BASE_URL || "http://localhost:4000/api/v1";
  const symbol = __ENV.SYMBOL || "AAPL";

  const healthRes = http.get(`${baseUrl}/health`);
  check(healthRes, { "Health check passes": (r) => r.status === 200});

  const dailyUrl = `${baseUrl}/stocks/${symbol}/daily`;
  const res = http.get(dailyUrl);
  check(res, {
    "Response status is 200:": (r) => r.status === 200,
    "Response time is below 500ms": (r) => r.timings.duration < 500,
    "Response has time series data": (r) => r.json("Time Series (Daily)") !== undefined,
    "Response has meta data": (r) => r.json("Meta Data") !== undefined,
  });

  sleep(1);
}
