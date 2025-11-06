#API Performance Testing Project (k6) 🚀

![GitHub Workflow Status](https://github.com/achchu/k6-sample-project/actions/workflows/test.yml/badge.svg)

Performance testing with k6, InfluxDB, and Grafana visualization.

## Prerequisites

- Node.js (v20+), TypeScript, k6 (v0.53.0+), Docker

## Quick Start

```sh
# Install dependencies
npm install

# Start visualization stack (InfluxDB + Grafana)
npm run docker:up

# Start API server (in separate terminal)
npm run dev:api

# Run performance tests
npm run test:perf        # Basic test with metrics
npm run test:perf:load   # Load test with metrics
npm run test:perf:simple # Quick test without metrics
```

## Visualization Setup

1. Start services: `npm run docker:up`
2. Open Grafana: http://localhost:3000 (`admin` / `adminpassword`)
3. Import dashboard: **+** → **Import** → ID `2587` → Select **"k6 InfluxDB"** → **Import**
4. Run tests and view results in Grafana

## API Endpoints

- `GET /api/v1/health` - Health check
- `GET /api/v1/stocks` - List stocks
- `GET /api/v1/stocks/:symbol/daily` - Daily data
- `GET /api/v1/stocks/:symbol/intraday` - Intraday data (`?interval=5min`)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:api` | Start API server |
| `npm test` | Run all tests |
| `npm run docker:up` | Start InfluxDB + Grafana |
| `npm run docker:down` | Stop services |
| `npm run test:perf` | Performance test with metrics |
| `npm run test:perf:load` | Load test with metrics |

## Resources

- [k6 Docs](https://grafana.com/docs/k6/latest/)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
