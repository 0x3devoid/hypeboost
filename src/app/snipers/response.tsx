import React, { useEffect, useRef, useState, useCallback } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';

// Register the necessary components for financial charts
import {
    CandlestickController,
    CandlestickElement,
    OhlcController,
    OhlcElement
} from 'chartjs-chart-financial';

Chart.register(
    CandlestickController,
    CandlestickElement,
    OhlcController,
    OhlcElement
);

// Define TypeScript interfaces
interface PriceData {
    price: number;
    date: string; // ISO date string
}

interface OHLCData {
    x: number;
    o: number;
    h: number;
    l: number;
    c: number;
}

interface PaginationInfo {
    page: number;
    pageSize: number;
    hasMore: boolean;
    totalCount?: number;
}

interface ChartProps {
    apiEndpoint?: string;
    tokenSymbol?: string;
    refreshInterval?: number; // in milliseconds
}

const CandlestickChart2: React.FC<ChartProps> = ({
    apiEndpoint = 'https://api.example.com/token-prices',
    tokenSymbol = 'TOKEN',
    refreshInterval = 60000 // 1 minute default
}) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [priceData, setPriceData] = useState<PriceData[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        pageSize: 30,
        hasMore: false
    });

    // Refs for caching and API control
    const cacheRef = useRef<Map<string, { data: PriceData[], timestamp: number }>>(new Map());
    const abortControllerRef = useRef<AbortController | null>(null);
    const lastFetchRef = useRef<number>(0);
    const fetchIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Check if the device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Initial check
        checkMobile();

        // Add event listener
        window.addEventListener('resize', checkMobile);

        // Clean up
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Convert price data to OHLC format
    const convertToOHLC = useCallback((priceData: PriceData[]): OHLCData[] => {
        if (!priceData.length) return [];

        // Sort by date ascending
        const sortedData = [...priceData].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        const ohlcData: OHLCData[] = [];

        // Group data by day to create daily candles
        const dailyData: Map<string, PriceData[]> = new Map();

        for (const dataPoint of sortedData) {
            const date = new Date(dataPoint.date);
            const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

            if (!dailyData.has(dayKey)) {
                dailyData.set(dayKey, []);
            }

            dailyData.get(dayKey)?.push(dataPoint);
        }

        // Calculate historical volatility for better estimates
        const allPrices = sortedData.map(item => item.price);
        const volatilityFactor = calculateHistoricalVolatility(allPrices);

        // For each day, calculate OHLC
        for (const [, dayPrices] of dailyData.entries()) {
            if (dayPrices.length === 0) continue;

            if (dayPrices.length === 1) {
                // If we only have one price for the day, we'll estimate OHLC
                const timestamp = new Date(dayPrices[0].date).getTime();
                const price = dayPrices[0].price;
                const volatility = price * volatilityFactor;

                ohlcData.push({
                    x: timestamp,
                    o: price * (1 - volatilityFactor / 2),
                    h: price * (1 + volatilityFactor),
                    l: price * (1 - volatilityFactor),
                    c: price
                });
            } else {
                // For multiple prices in a day, calculate actual OHLC
                const timestamp = new Date(dayPrices[0].date).getTime();
                const openPrice = dayPrices[0].price;
                const closePrice = dayPrices[dayPrices.length - 1].price;

                const highPrice = Math.max(...dayPrices.map(p => p.price));
                const lowPrice = Math.min(...dayPrices.map(p => p.price));

                ohlcData.push({
                    x: timestamp,
                    o: openPrice,
                    h: highPrice,
                    l: lowPrice,
                    c: closePrice
                });
            }
        }

        return ohlcData;
    }, []);

    // Calculate historical volatility from price data
    const calculateHistoricalVolatility = (prices: number[], days: number = 14): number => {
        if (prices.length < 2) return 0.02; // Default 2% if not enough data

        // Calculate daily returns
        const returns: number[] = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push(Math.log(prices[i] / prices[i - 1]));
        }

        // Calculate standard deviation of returns
        const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
        const variance = returns.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / returns.length;
        const stdDev = Math.sqrt(variance);

        // Daily volatility (conservative estimate to prevent extreme values)
        return Math.min(stdDev * 2, 0.05); // Cap at 5%
    };

    // Fetch data from API with caching, pagination and error handling
    const fetchData = useCallback(async (page: number = 1, refresh: boolean = false) => {
        // Cancel any in-flight requests
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController();

        // Check cache first (if not forcing refresh)
        const cacheKey = `${tokenSymbol}-${page}-${pagination.pageSize}`;
        const now = Date.now();
        const cachedData = cacheRef.current.get(cacheKey);

        // Use cache if it's less than 5 minutes old and not forcing refresh
        if (!refresh && cachedData && (now - cachedData.timestamp < 5 * 60 * 1000)) {
            return cachedData.data;
        }

        // Set loading state if this is the first page or we don't have data yet
        if (page === 1 || priceData.length === 0) {
            setIsLoading(true);
        }

        // Clear any previous errors
        setError(null);

        try {
            // In a real app, fetch from actual API
            // const response = await fetch(
            //   `${apiEndpoint}?page=${page}&pageSize=${pagination.pageSize}&token=${tokenSymbol}`,
            //   { signal: abortControllerRef.current.signal }
            // );

            // if (!response.ok) {
            //   throw new Error(`API error: ${response.status}`);
            // }

            // const data = await response.json();

            // For demo: generate mock data instead of actual API call
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

            const mockData = generateMockPriceData(pagination.pageSize, page);

            // Cache the results
            cacheRef.current.set(cacheKey, {
                data: mockData,
                timestamp: now
            });

            // Update last fetch time
            lastFetchRef.current = now;

            // Update pagination info (in real app, this would come from API response headers)
            setPagination(prev => ({
                ...prev,
                page: page,
                hasMore: page < 3, // Mock - pretend we have 3 pages total
                totalCount: pagination.pageSize * 3
            }));

            // Return the fetched data
            return mockData;

        } catch (err) {
            // Handle errors, but ignore aborted requests
            if ((err as Error).name !== 'AbortError') {
                console.error('Error fetching price data:', err);
                setError(`Failed to load price data. ${(err as Error).message}`);
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [apiEndpoint, pagination.pageSize, tokenSymbol, priceData.length]);

    // Generate mock price data for demo
    const generateMockPriceData = (count: number, page: number): PriceData[] => {
        const data: PriceData[] = [];
        let price = 1000 * (page === 1 ? 1 : 0.9 ** page); // Starting price, lower for older data

        // Calculate date offset based on page
        const startOffset = count * (page - 1);

        for (let i = 0; i < count; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (startOffset + i));

            // Add some random price movement (more volatility in older data)
            const volatilityFactor = 0.03 * (page === 1 ? 1 : page * 0.7);
            price = price * (1 + (Math.random() * 2 * volatilityFactor - volatilityFactor));

            data.push({
                price: price,
                date: date.toISOString()
            });
        }

        // Sort newest to oldest (as an API would typically return)
        return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Load more data (pagination)
    const handleLoadMore = async () => {
        if (isLoading || !pagination.hasMore) return;

        const nextPage = pagination.page + 1;
        const newData = await fetchData(nextPage);

        if (newData) {
            // Append to existing data
            setPriceData(prev => [...prev, ...newData]);
        }
    };

    // Refresh data
    const handleRefresh = async () => {
        // Don't refresh if we've refreshed recently (throttle)
        if (Date.now() - lastFetchRef.current < 10000) return; // 10 second throttle

        const newData = await fetchData(1, true);

        if (newData) {
            // Replace first page data and keep the rest
            const remainingData = priceData.slice(pagination.pageSize);
            setPriceData([...newData, ...remainingData]);
        }
    };

    // Set up periodic refresh
    useEffect(() => {
        if (refreshInterval <= 0) return;

        fetchIntervalRef.current = setInterval(() => {
            handleRefresh();
        }, refreshInterval);

        return () => {
            if (fetchIntervalRef.current) {
                clearInterval(fetchIntervalRef.current);
            }
        };
    }, [refreshInterval]);

    // Initial data load
    useEffect(() => {
        const loadInitialData = async () => {
            const data = await fetchData(1);
            if (data) {
                setPriceData(data);
            }
        };

        loadInitialData();

        return () => {
            // Cancel any pending requests on unmount
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    // Create/update chart when data changes
    useEffect(() => {
        if (isLoading || priceData.length === 0) return;

        const createChart = () => {
            if (chartRef.current) {
                // Destroy previous chart instance if it exists
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const ctx = chartRef.current.getContext('2d');
                if (!ctx) return;

                // Convert price data to OHLC format
                const candleData = convertToOHLC(priceData);

                // Create new chart instance
                chartInstance.current = new Chart(ctx, {
                    type: 'candlestick',
                    data: {
                        datasets: [{
                            label: `${tokenSymbol} Price`,
                            data: candleData,
                            borderColor: "yellow",
                            backgroundColor: "purple",
                            
                            borderWidth: isMobile ? 1 : 2,
                            borderSkipped: false,
                            
                        
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                            padding: isMobile ? { left: 5, right: 5, top: 10, bottom: 5 } :
                                { left: 10, right: 10, top: 20, bottom: 10 }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: isMobile ? 'week' : 'day',
                                    displayFormats: {
                                        day: 'MMM d',
                                        week: 'MMM d'
                                    },
                                    tooltipFormat: 'MMM d, yyyy'
                                },
                                adapters: {
                                    date: {
                                        locale: enUS
                                    }
                                },
                                title: {
                                    display: !isMobile,
                                    text: 'Date',
                                    color: '#666',
                                    font: {
                                        size: isMobile ? 10 : 14,
                                        weight: 'bold'
                                    }
                                },
                                ticks: {
                                    maxRotation: isMobile ? 45 : 0,
                                    font: {
                                        size: isMobile ? 8 : 12
                                    },
                                    maxTicksLimit: isMobile ? 5 : 10
                                }
                            },
                            y: {
                                title: {
                                    display: !isMobile,
                                    text: 'Price ($)',
                                    color: '#666',
                                    font: {
                                        size: isMobile ? 10 : 14,
                                        weight: 'bold'
                                    }
                                },
                                ticks: {
                                    callback: function (value) {
                                        return '$' + value;
                                    },
                                    font: {
                                        size: isMobile ? 8 : 12
                                    },
                                    maxTicksLimit: isMobile ? 5 : 8
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                enabled: true,
                                mode: 'nearest',
                                intersect: false,
                                callbacks: {
                                    label: function (context) {
                                        const point = context.raw as OHLCData;
                                        return [
                                            `Open: $${point.o.toFixed(2)}`,
                                            `High: $${point.h.toFixed(2)}`,
                                            `Low: $${point.l.toFixed(2)}`,
                                            `Close: $${point.c.toFixed(2)}`,
                                            `Change: ${((point.c - point.o) / point.o * 100).toFixed(2)}%`
                                        ];
                                    }
                                }
                            },
                            legend: {
                                display: !isMobile,
                                position: 'top',
                                labels: {
                                    font: {
                                        size: isMobile ? 10 : 12
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: isMobile ? `${tokenSymbol} Price` : `${tokenSymbol} Price History`,
                                font: {
                                    size: isMobile ? 12 : 16,
                                    weight: 'bold'
                                },
                                padding: {
                                    top: isMobile ? 5 : 10,
                                    bottom: isMobile ? 10 : 20
                                }
                            }
                        }
                    }
                });
            }
        };

        createChart();

        // Handle resize
        const handleResize = () => {
            if (chartInstance.current) {
                setTimeout(createChart, 100);
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [priceData, isMobile, isLoading, convertToOHLC, tokenSymbol]);

    return (
        <div className="flex flex-col items-center justify-center w-full p-2 md:p-4">
            <div className="w-full h-64 md:h-96 border border-gray-300 rounded-lg shadow-lg bg-white p-2 md:p-4 overflow-hidden relative">
                {isLoading && priceData.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-gray-500">Loading price data...</div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="text-red-500 mb-2">{error}</div>
                        <button
                            onClick={() => fetchData(1, true)}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <canvas ref={chartRef} className="w-full h-full"></canvas>
                )}

                {/* Loading overlay for additional data */}
                {isLoading && priceData.length > 0 && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                        <div className="text-gray-700">Updating chart...</div>
                    </div>
                )}
            </div>

            <div className="flex justify-between w-full mt-4">
                <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm hover:bg-gray-200 disabled:opacity-50"
                >
                    Refresh
                </button>

                {pagination.hasMore && (
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50"
                    >
                        Load More Data
                    </button>
                )}
            </div>

            {!isLoading && !error && priceData.length > 0 && (
                <div className="mt-2 md:mt-4 text-gray-600 text-xs md:text-sm">
                    <div className="flex flex-wrap justify-center gap-x-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 opacity-30 border border-green-600 mr-1 md:mr-2"></div>
                            <span>Bullish (Price increased)</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 opacity-30 border border-red-600 mr-1 md:mr-2"></div>
                            <span>Bearish (Price decreased)</span>
                        </div>
                    </div>
                    <div className="text-center mt-1 text-xs text-gray-500">
                        Showing {priceData.length} data points
                        {pagination.totalCount && ` of ${pagination.totalCount}`}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CandlestickChart2;