import React from 'react'

const TokenDetails = () => {
    return (
        <div className='mt-5 text-gray-400'>

            <div className='border rounded-[8px] w-full p-1 flex justify-between bg-red  text-[12px]'>
                <div className='p-1 px-4 rounded bg-[#77ED91] text-black cursor-pointer text-bold'>
                    <p>Charts</p>
                </div>
                <div className='p-1 px-4 rounded cursor-pointer'>
                    <p>Checks</p>
                </div>
                <div className='p-1 px-4 rounded cursor-pointer'>
                    <p>Positions</p>
                </div>
            </div>


            <div className='w-full flex justify-between mt-3 gap-2'>

                <div className='rounded-[8px] border p-2 text-center w-full'>
                    <p className='text-[8px] font-bold'>PRICE (USD)</p>
                    <h3 className='font-extrabold text-white w-[fit-content] m-auto'>$6.34</h3>
                </div>
                <div className='rounded-[8px] border p-2 text-center w-full'>
                    <p className='text-[8px] font-bold'>PRICE</p>
                    <h3 className='font-extrabold text-white w-[fit-content] m-auto'>0.001235 BNB</h3>
                </div>

            </div>

            <div className='w-full flex justify-between mt-3 gap-2'>

                <div className='rounded-[8px] border p-2 text-center w-full'>
                    <p className='text-[8px] font-bold'>LIQUIDITY</p>
                    <h3 className='font-extrabold text-white w-[fit-content] m-auto'>$26K</h3>
                </div>
                <div className='rounded-[8px] border p-2 text-center w-full'>
                    <p className='text-[8px] font-bold'>FDV</p>
                    <h3 className='font-extrabold text-white w-[fit-content] m-auto'>$2.1M</h3>
                </div>

                <div className='rounded-[8px] border p-2 text-center w-full'>
                    <p className='text-[8px] font-bold'>MCAP</p>
                    <h3 className='font-extrabold text-white w-[fit-content] m-auto'>$2.1M</h3>
                </div>

            </div>


            <div className='w-full flex justify-between mt-3'>

                <div className='border p-1 text-center w-full'>
                    <p className='text-[10px] font-bold'>5M</p>
                    <h3 className='font-extrabold  w-[fit-content] m-auto text-green-400'>15.5%</h3>
                </div>
                <div className='border p-1 text-center w-full'>
                    <p className='text-[10px] font-bold'>1H</p>
                    <h3 className='font-extrabold text-green-400 w-[fit-content] m-auto'>26.5%</h3>
                </div>
                <div className='border p-1 text-center w-full'>
                    <p className='text-[10px] font-bold'>6H</p>
                    <h3 className='font-extrabold text-red-600 w-[fit-content] m-auto'>-6.5%</h3>
                </div>
                <div className='border p-1 text-center w-full'>
                    <p className='text-[10px] font-bold'>1H</p>
                    <h3 className='font-extrabold text-green-400 w-[fit-content] m-auto'>3,638%</h3>
                </div>

            </div>

            <div className='mt-2 p-2'>

                <div className='w-full flex justify-between'>

                    <div className='text-center mr-[100px]'>
                        <p className='text-[10px] font-bold'>TXNS</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>300</h3>
                    </div>

                    <div className='text-start w-full border-b-3 border-b-green-400'>
                        <p className='text-[10px] font-bold'>TXNS</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>158</h3>
                    </div>

                    <div className='text-end w-full border-b-3 border-b-red-600'>
                        <p className='text-[10px] font-bold'>TXNS</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>142</h3>
                    </div>

                </div>

                <div className='w-full flex justify-between mt-3'>

                    <div className='text-center mr-[95px]'>
                        <p className='text-[10px] font-bold'>VOLUME</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>$45K</h3>
                    </div>

                    <div className='text-start w-full border-b-3 border-b-green-400'>
                        <p className='text-[10px] font-bold'>BUY VOL</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>$30K</h3>
                    </div>

                    <div className='text-end w-[100px] border-b-3 border-b-red-600'>
                        <p className='text-[10px] font-bold'>SELL VOL</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>$10K</h3>
                    </div>

                </div>


                <div className='w-full flex justify-between mt-3'>

                    <div className='text-center mr-[90px]'>
                        <p className='text-[10px] font-bold'>MARKERS</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>570</h3>
                    </div>

                    <div className='text-start w-[250px] border-b-3 border-b-green-400'>
                        <p className='text-[10px] font-bold '>BUYERS</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>212</h3>
                    </div>

                    <div className='text-end w-full border-b-3 border-b-red-600'>
                        <p className='text-[10px] font-bold'>SELLERS</p>
                        <h3 className='font-extrabold text-white mt-[-8px]'>358</h3>
                    </div>

                </div>

            </div>


            <div className='mt-5'>

            </div>

        </div>
    )
}

export default TokenDetails
