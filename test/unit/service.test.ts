import axios from 'axios';
import { getStockData, getIntradayData } from '../../src/service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Stock API Service', () => {
    beforeAll(() => {
        // Silence console.error during tests
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterAll(() => {
        // Restore console.error after tests
        jest.restoreAllMocks();
    });

    const mockSuccessResponse = {
        data: {
            'Time Series (Daily)': {
                '2024-01-01': { '1. open': '150.00', '2. high': '155.00', '3. low': '145.00', '4. close': '152.00' }
            }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
            url: 'https://www.alphavantage.co/query',
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getStockData', () => {
        it('should fetch stock data successfully', async () => {
            mockedAxios.get.mockResolvedValue(mockSuccessResponse);
            const result = await getStockData('AAPL');
            expect(result).toEqual(mockSuccessResponse.data);
        });

        it('should handle API errors', async () => {
            const errorResponse = { 
                response: { 
                    data: 'API Error',
                    status: 400 
                },
                isAxiosError: true,
                message: 'Request failed'
            };
            mockedAxios.get.mockRejectedValue(errorResponse);
            
            await expect(getStockData('INVALID')).rejects.toEqual(errorResponse);
        });

        it('should handle unexpected errors', async () => {
            const unexpectedError = new Error('Network error');
            mockedAxios.get.mockRejectedValueOnce(unexpectedError);
            
            const consoleSpy = jest.spyOn(console, 'error');
            await expect(getStockData('AAPL')).rejects.toThrow('Network error');
            
            expect(consoleSpy).toHaveBeenCalledWith(
                'Unexpected error fetching stock data:',
                unexpectedError
            );
        });
    });

    describe('getIntradayData', () => {
        it('should fetch intraday data successfully', async () => {
            const intradayResponse = {
                data: {
                    'Time Series (5min)': {
                        '2024-01-01 09:35:00': {
                            '1. open': '150.00',
                            '2. high': '155.00',
                            '3. low': '145.00',
                            '4. close': '152.00'
                        }
                    }
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                    url: 'https://www.alphavantage.co/query',
                    method: 'get'
                }
            };
            
            mockedAxios.get.mockResolvedValue(intradayResponse);
            const result = await getIntradayData('AAPL');
            expect(result).toEqual(intradayResponse.data);
        });

        it('should handle API errors for intraday data', async () => {
            const errorResponse = {
                response: {
                    data: 'API Error',
                    status: 500
                },
                isAxiosError: true,
                message: 'Server error'
            };
            mockedAxios.get.mockRejectedValue(errorResponse);
            
            await expect(getIntradayData('INVALID')).rejects.toEqual(errorResponse);
        });

        it('should use default interval of 5min', async () => {
            mockedAxios.get.mockResolvedValue(mockSuccessResponse);
            await getIntradayData('AAPL');
            expect(mockedAxios.get).toHaveBeenCalledWith(expect.any(String), {
                params: expect.objectContaining({
                    interval: '5min'
                })
            });
        });

        it('should handle unexpected errors for intraday data', async () => {
            const unexpectedError = new Error('Network error');
            mockedAxios.get.mockRejectedValueOnce(unexpectedError);
            
            const consoleSpy = jest.spyOn(console, 'error');
            await expect(getIntradayData('AAPL')).rejects.toThrow('Network error');
            
            expect(consoleSpy).toHaveBeenCalledWith(
                'Unexpected error fetching intraday data:',
                unexpectedError
            );
        });
    });
});