import React from "react";
import Image from "next/image";
import { Bitcoin } from "lucide-react";

const data = [
  {
    name: "Bitcoin",
    icon: (
      <Image
        src="/images/btc.png"
        alt="Tron"
        width={20}
        height={20}
        className="inline-block"
      />
    ),
    change: "+14.25%",
    changeColor: "text-green-500",
    amount: "6,882",
    unit: "BTC",
    value: "$95,518.00",
    actions: ["Deposit", "Withdraw", "Distribute"],
  },
  {
    name: "Tron",
    icon: (
      <Image
        src="/images/usdt.png"
        alt="Tron"
        width={20}
        height={20}
        className="inline-block"
      />
    ),
    change: "+6.25%",
    changeColor: "text-green-500",
    amount: "1,450",
    unit: "TRX",
    value: "$0.24",
    actions: [],
    chart: (
      <Image
        src="/images/greenUp.png"
        alt="Tron"
        width={1000}
        height={1000}
        className="inline-block"
      />
    ),
  },
  {
    name: "Ethereum",
    icon: (
      <Image
        src="/images/eth.png"
        alt="Tron"
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-auto"
        unoptimized 
      
      />
    ),
    change: "-5.25%",
    changeColor: "text-red-500",
    amount: "5,356",
    unit: "ETH",
    value: "$950.51",
    actions: [],
    chart: (
      <Image
        src="/images/redDown.png"
        alt="Tron"
        width={0}
        height={0}
        sizes="100vw"
        className="w-auto h-auto"
        unoptimized // optional: skips Next.js optimization
      />
    ),
  },
];

const CryptoCards = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="bg-[#1C1C1C] text-white p-6 rounded-3xl shadow-lg flex-1 min-w-[250px]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {item.icon}
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            <span className={`text-xs font-semibold ${item.changeColor}`}>
              {item.change}
            </span>
          </div>
          <div className="text-3xl font-bold mb-2">
            {item.amount} <span className="text-sm font-medium">{item.unit}</span>
          </div>
          <div className="text-xs text-gray-400 mb-4">
            1 {item.unit} = {item.value}
          </div>
          {item.actions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {item.actions.map((action, idx) => (
                <button
                  key={idx}
                  className="w-full bg-transparent border border-[#77ED91] text-white text-sm py-2 rounded-3xl hover:bg-gray-800 transition"
                >
                  {action}
                </button>
              ))}
            </div>
          ) :

            <div>

              {item.chart}
            </div>


          }
        </div>
      ))}
    </div>
  );
};

export default CryptoCards;