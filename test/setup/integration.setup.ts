// Setup for integration tests
process.env.MARKET_API_BASE_URL =
  process.env.MARKET_API_BASE_URL ?? "http://localhost:4000/api/v1";
process.env.MARKET_API_TIMEOUT_MS =
  process.env.MARKET_API_TIMEOUT_MS ?? "5000";
