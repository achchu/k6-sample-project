import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 }, //Gradually ramp up the users
    { duration: "1m", target: 100 }, // Peak load
    { duration: "30s", target: 0 }, //Gradually ramp down the users
  ],
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

//This file is not part of CI/CD pipeline to avoid getting blocked by third party API rate limits
