# k6 API Testing Project 🚀

![GitHub Workflow Status](https://github.com/achchu/k6-sample-project/actions/workflows/test.yml/badge.svg)

This project demonstrates API testing using:

- **Express** for local market data API server
- **Jest** for unit and integration testing
- **k6** for performance testing
- **GitHub Actions** for CI/CD automation

---

## 1. Project Setup

To set up this project locally, ensure you have the following installed:

- [Node.js (v20+)](https://nodejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [k6](https://k6.io/)

### Clone the Repository

```sh
git clone https://github.com/achchu/k6-sample-project.git
cd k6-sample-project
```

### Install Dependencies

```sh
npm install
```

### Set Up Environment Variables (Optional)

The project uses a local Express API server by default. If you need to customize the API URL, create a `.env` file:

```sh
MARKET_API_BASE_URL=http://localhost:4000/api/v1
MARKET_API_PORT=4000
MARKET_API_TIMEOUT_MS=5000
```

### Start the Local API Server

Before running k6 tests, start the local market data API server:

```sh
npm run dev:api
```

The API will be available at `http://localhost:4000/api/v1` by default.

### API Endpoints

The local API provides the following endpoints:

- `GET /api/v1/health` - Health check endpoint
- `GET /api/v1/stocks` - List all tracked stocks
- `GET /api/v1/stocks/:symbol` - Get symbol information
- `GET /api/v1/stocks/:symbol/daily` - Get daily stock data (optional `?limit=N` query param)
- `GET /api/v1/stocks/:symbol/intraday` - Get intraday data (requires `?interval=5min` query param, optional `?limit=N`)

### Environment Variables for k6

Since k6 doesn't support .env files, you can optionally export environment variables:

```sh
export MARKET_API_BASE_URL=http://localhost:4000/api/v1
export SYMBOL=AAPL
```

If not set, k6 tests will default to `http://localhost:4000/api/v1` and use `AAPL` as the test symbol.

---

## 2. Running Tests

### Run All Tests

```sh
npm test
```
---

## 3. Running k6 Performance Tests

Before running k6 tests, make sure the local API server is running:

```sh
npm run dev:api
```

In a separate terminal:

### Compile TypeScript to Javascript

Since k6 does not support TypeScript natively, compile the test scripts first:

```sh
npx tsc
```

### Run Basic k6 Performance Test

```sh
k6 run dist/performance/k6-test.js
```

This test simulates 1 virtual user making 5 API requests to the local market data API.

### Run k6 Load Test

```sh
k6 run dist/performance/k6-load-test.js
```

This load test ramps up from 0 to 50 users over 30 seconds, maintains 100 users for 1 minute, then ramps down to 0 over 30 seconds. It tests multiple stock symbols and endpoints.

---

## 4. GitHub Actions CI/CD

GitHub Actions workflow:

- Runs **Jest unit and integration tests** to validate API functionality.
- Compiles **TypeScript** to JavaScript.
- Starts the local API server.
- Runs **k6 performance tests** against the local API.

### Workflow File:

`.github/workflows/test.yml`
Each push triggers these automated tests.

View results in [GitHub Actions](https://github.com/achchu/api-performance-project/actions).

---

## 5. Why This Approach?

### Local API Server

Instead of relying on external APIs (which have rate limits and require API keys), this project uses a local Express server that provides market data from fixtures. This allows for:

- **Unlimited testing** without rate limit concerns
- **Deterministic test data** from fixtures
- **Full control** over API behavior and responses
- **Offline development** capability

### Performance Testing with k6

k6 tests run against the local API server

---

## 6. Resources

- [k6 Documentation](https://grafana.com/docs/k6/latest/)
- [Jest Documentation](https://jestjs.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)
