import http from "k6/http";
import { check, sleep } from "k6";
import { Options } from "k6/options";

export const options: Options = {
  vus: 1,
  iterations: 5,
};

export default function () {
  const apiKey: string = `${__ENV.ALPHA_VANTAGE_API_KEY}`;
  const apiUrl: string = `${__ENV.ALPHA_VANTAGE_API_URL}`;
  const url: string = `${apiUrl}?function=TIME_SERIES_DAILY&symbol=AAPL&apiKey=${apiKey}`;

  const res = http.get(url);

  check(res, {
    "Response status is 200:": (r) => r.status === 200,
    "Response time is below 500ms": (r) => r.timings.duration < 500,
  });

  sleep(1);
}
