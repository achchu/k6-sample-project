"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = void 0;
exports.default = default_1;
const http_1 = __importDefault(require("k6/http"));
const k6_1 = require("k6");
exports.options = {
    vus: 1,
    iterations: 5,
};
function default_1() {
    const apiKey = `${__ENV.ALPHA_VANTAGE_API_KEY}`;
    const apiUrl = `${__ENV.ALPHA_VANTAGE_API_URL}`;
    const url = `${apiUrl}?function=TIME_SERIES_DAILY&symbol=AAPL&apiKey=${apiKey}`;
    const res = http_1.default.get(url);
    (0, k6_1.check)(res, {
        "Response status is 200:": (r) => r.status === 200,
        "Response time is below 500ms": (r) => r.timings.duration < 500,
    });
    (0, k6_1.sleep)(1);
}
