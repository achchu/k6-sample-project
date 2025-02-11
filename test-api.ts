import { getStockData, getIntradayData } from './src/service';

const testApi = async () => {
    try {
        console.log('Fetching Daily Stock Data....');
        const stockData = await getStockData('AAPL');
        console.log('Stock Data Response:', JSON.stringify(stockData, null, 2));

        console.log('\nFetching Intraday Stock Data....');
        const intradayData = await getIntradayData('AAPL', '5min');
        console.log('Intraday Data Response:', JSON.stringify(intradayData, null, 2));
    } catch (error) {
        console.error('API test failed:', error);
    }
}

testApi();