import React from 'react'

const TransactionTable = () => {

    const TradeLog = [
        {
            date: "15/04/24",
            pair: "BNB/USDT",
            type: "Buy",
            price: 684783,
            amount: 256,
            status: "Pending"
        },
        {
            date: "15/04/24",
            pair: "BNB/USDT",
            type: "Sell",
            price: 64783,
            amount: 26,
            status: "Failed"
        }, {
            date: "15/04/24",
            pair: "BNB/USDT",
            type: "Buy",
            price: 684783,
            amount: 256,
            status: "Success"
        },
        {
            date: "15/04/24",
            pair: "BNB/USDT",
            type: "Buy",
            price: 684783,
            amount: 256,
            status: "Pending"
        },
        {
            date: "15/04/24",
            pair: "BNB/USDT",
            type: "Sell",
            price: 64783,
            amount: 26,
            status: "Failed"
        }, {
            date: "15/04/24",
            pair: "BNB/USDT",
            type: "Buy",
            price: 684783,
            amount: 256,
            status: "Success"
        }
    ]

    const statusColorMap: Record<string, string> = {
        Pending: "text-yellow-500",
        Failed: "text-red-500",
        Success: "text-green-500",
    };
    
    return (
        <div className='mt-5 bg-[#1C1C1C] rounded-2xl p-2 sm:p-4 text-xs sm:text-sm'>
            {/* Header section */}
            <div className='flex flex-col sm:flex-row justify-between gap-3 mb-4'>
                <div className='flex overflow-x-auto scrollbar-hide rounded-2xl bg-[#141414] p-2'>
                    <p className='text-green-500 whitespace-nowrap px-3'>
                        Trade History
                    </p>
                    <p className='whitespace-nowrap px-3'>
                        Open Orders
                    </p>
                    <p className='whitespace-nowrap px-3'>
                        Orders History
                    </p>
                </div>
                <div className='flex justify-end mt-2 sm:mt-0'>
                    <h3 className='text-yellow-500 font-bold cursor-pointer'>
                        View All
                    </h3>
                </div>
            </div>

            {/* Table section */}
            <div className="w-full overflow-x-auto rounded-lg">
                <table className="w-full text-left text-xs sm:text-sm text-white bg-[#1C1C1C] rounded">
                    <thead>
                        <tr className="bg-[#1C1C1C] border-b border-white">
                            <th className="px-2 py-2 sm:px-4 sm:py-3">Date/Time</th>
                            <th className="px-2 py-2 sm:px-4 sm:py-3">Pair</th>
                            <th className="px-2 py-2 sm:px-4 sm:py-3">Type</th>
                            <th className="px-2 py-2 sm:px-4 sm:py-3">Price</th>
                            <th className="px-2 py-2 sm:px-4 sm:py-3">Amount</th>
                            <th className="px-2 py-2 sm:px-4 sm:py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {TradeLog.map((trade, index) => (
                            <tr key={index} className="hover:bg-white/5 transition bg-[#1C1C1C] ">
                                <td className="px-2 py-2 sm:px-4">{trade.date}</td>
                                <td className="px-2 py-2 sm:px-4">{trade.pair}</td>
                                <td className="px-2 py-2 sm:px-4 font-medium" 
                                    style={{ color: trade.type === "Buy" ? "#16c784" : "#ea3943" }}>
                                    {trade.type}
                                </td>
                                <td className="px-2 py-2 sm:px-4">{trade.price}</td>
                                <td className="px-2 py-2 sm:px-4">{trade.amount}</td>
                                <td className={`px-2 py-2 sm:px-4 ${statusColorMap[trade.status] || "text-gray-400"}`}>
                                    {trade.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TransactionTable