# k6 API Testing Project 🚀

![GitHub Workflow Status](https://github.com/achchu/k6-sample-project/actions/workflows/test.yml/badge.svg)

This project demonstrates API testing using:
- **Jest** for unit testing
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

### Set Up Environment Variables
Create a `.env` file in the root directory:
```sh
ALPHA_VANTAGE_API_KEY=your_api_key
ALPHA_VANTAGE_API_URL=https://www.alphavantage.co/query
```
You can obtain your API key here - https://www.alphavantage.co/support/#api-key

### Manually export the .env variables
Since k6 doesn't support .env files, you'll need to manually export the environment variables. So run the following commands in terminal
```sh
export ALPHA_VANTAGE_API_KEY=your_api_key
export ALPHA_VANTAGE_API_URL=https://www.alphavantage.co/query
```

---

## 2. Running Jest Unit Tests

### Run Unit Tests
```sh
npm test
```
---

## 3. Running k6 Performance Tests

Since k6 does not support TypeScript natively, you need to **compile the test scripts first**. I am using the stable way of running .ts tests with k6 using
the compatibility mode 

### Compile TypeScript to Javascript
```sh
npx tsc
```

### Run k6 Performance Tests
```sh
k6 run dist/k6-test.js
```

This test simulates a limited number of API requests to avoid exceeding free-tier API limits on Alpha.

---

## 4. GitHub Actions CI/CD

GitHub Actions workflow:
- Runs **Jest tests** to validate API functionality.
- Compiles **TypeScript** to JavaScript.
- Runs **k6 performance tests**.

### Workflow File: `.github/workflows/test.yml`
Each push triggers these automated tests.

🔗 View results in [GitHub Actions](https://github.com/achchu/k6-sample-project/actions).

---

## 5. Why This Approach?

### Environment Variables for Security
API keys are loaded via `.env` and **never committed to GitHub** to prevent exposure.

### Mocked API Calls in Jest
Instead of calling external APIs in Jest tests, mocked responses to ensure deterministic and reliable tests.

### Limited Requests in k6
To avoid exceeding API rate limits, the k6 test runs with:
```ts
export const options = {
  vus: 1, // Single virtual user
  iterations: 5 // Five API calls
};
```
This ensures controlled API usage while still demonstrating load-testing capabilities with k6.

---

## 6. Resources
- [k6 Documentation](https://grafana.com/docs/k6/latest/)
- [Jest Documentation](https://jestjs.io/docs/)
- [GitHub Actions](https://docs.github.com/en/actions)


