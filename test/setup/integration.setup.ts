// Setup for integration tests
if (!process.env.ALPHA_VANTAGE_API_KEY) {
  throw new Error(
    "Integration tests require ALPHA_VANTAGE_API_KEY environment variable"
  );
}

if (!process.env.ALPHA_VANTAGE_API_URL) {
  throw new Error(
    "Integration tests require ALPHA_VANTAGE_API_URL environment variable"
  );
}
