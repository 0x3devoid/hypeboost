import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { enUS, tr } from 'date-fns/locale';
import { LoaderCircleIcon, ArrowUp, MenuIcon } from 'lucide-react';

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
interface OHLCData {
  x: number;
  o: number;
  h: number;
  l: number;
  c: number;
}

const CandlestickChart: React.FC = () => {
  const [isLoaded, setLoading] = useState(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Generate demo data for the last 30 days
  const generateData = (): OHLCData[] => {
    const data: OHLCData[] = [];
    let price: number = 17;

    for (let i = 0; i < 55; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i));

      // Generate random price movements
      const volatility: number = (Math.random() * 3) + 0.5;
      const change: number = (Math.random() - 0.5) * volatility;
      price += change;

      // Generate OHLC data
      const open: number = price;
      const high: number = open + (Math.random() * 2);
      const low: number = open - (Math.random() * 2);
      const close: number = (Math.random() > 0.5) ?
        open + (Math.random() * (high - open)) :
        open - (Math.random() * (open - low));

      data.push({
        x: date.getTime(),
        o: open,
        h: high,
        l: low,
        c: close
      });
    }

    return data;
  };

  useEffect(() => {

    refresh()
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };

  }, []);

  const refresh = () => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef?.current.getContext('2d');
      if (!ctx) return;

      const candleData: OHLCData[] = generateData();

      // Create new chart instance
      chartInstance.current = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: 'Trump Coin Price',
            data: candleData,
            borderColor: '#ef5350',
            backgroundColor: 'rgba(38, 166, 154, 0.3)',
            borderWidth: 2,
            borderSkipped: false,

          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day',
                displayFormats: {
                  day: 'MMM d'
                },
                tooltipFormat: 'MMM d, yyyy'
              },
              adapters: {
                date: {
                  locale: enUS
                }
              },
              title: {
                display: false,
                text: 'Date',
                color: '#fff',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            },
            y: {
              title: {
                display: false,
                text: 'Price ($)',
                color: '#fff',
                font: {
                  size: 14,
                  weight: 'bold'
                }
              },
              ticks: {
                callback: function (value) {
                  return '$' + value;
                }
              }
            }
          },
          plugins: {
            tooltip: {
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
              display: false,
              position: 'top',
              labels: {
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: false,
              text: 'Trump Coin Price - Last 30 Days',
              font: {
                size: 16,
                weight: 'bold'
              },
              padding: {
                top: 10,
                bottom: 20
              }
            }
          }
        }
      });
      setLoading(false)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">

      <div className="w-full h-100 text-white  bg-[#0a0a0a] mt-10">
        <canvas ref={chartRef} className="w-full h-full"></canvas>

      </div>

      {isLoaded && <div className='flex justify-center mt-20 spin'><LoaderCircleIcon className="spin" size={40} /></div>}





      <div className='flex justify-between w-full mt-3'>

        <button type='button' className='cursor-pointer hover:bg-[#C8C8C81A] hover:rounded-4xl p-1 px-3 text-[10px]'>Max</button>
        <button type='button' className='cursor-pointer hover:bg-[#C8C8C81A] hover:rounded-4xl p-1 px-3 text-[10px]'>1H</button>
        <button type='button' className='cursor-pointer hover:bg-[#C8C8C81A] hover:rounded-4xl p-1 px-3 text-[10px]'>4H</button>
        <button type='button' className='cursor-pointer hover:bg-[#C8C8C81A] hover:rounded-4xl p-1 px-3 text-[10px]'>6H</button>
        <button type='button' className='cursor-pointer hover:bg-[#C8C8C81A] hover:rounded-4xl p-1 px-3 text-[10px]'>12H</button>
        <button type='button' className='cursor-pointer hover:bg-[#C8C8C81A] hover:rounded-4xl p-1 px-3 text-[10px]'>1D</button>
        <button type='button' className='cursor-pointer hover:bg-[#C8C8C81A] hover:rounded-4xl p-1 px-3 text-[10px]'>1W</button>
        <span>|</span>
        <ArrowUp width={20} />
        <MenuIcon width={20} />



      </div>


    </div>
  );
};

export default CandlestickChart;