"use client"
import React, { useState } from 'react'
import "../../snipers/styles.css";
import { EyeClosedIcon, BellIcon, ForwardIcon, Share2Icon, StarIcon } from "lucide-react";
import CandlestickChart from '../../snipers/chart';
import Minibar from '@/app/minibar'
import { useParams } from 'next/navigation';
import ConnectWalletButton from '@/app/utils/ConnectWalletButton';
import { useWallet } from '@/app/context/WalletContext';
import TokenDetails from './tokenDetails'
import TransactionDetails from './transactionDetails'


const page = () => {
    const { isConnected } = useWallet();

    const param = useParams();

    const [isBuy, setIsBuy] = useState(true);



    return (
        <div>
            <div className='hidden lg:flex'>
                <Minibar />

            </div>


            <div>


                <div className='sniper__container'>

                    <div className='sniper__item'>

                        <div className='hidden lg:flex chart__header  justify-between'>

                            <div>
                                <div className='flex gap-2 chart__header__item1'>
                                    <h3>Trump</h3>
                                    <p>Trump coin</p>

                                    <EyeClosedIcon className="w-4 h-4 text-white" />
                                    <BellIcon className="w-4 h-4 text-white " />
                                </div>

                                <div className='chart__header__item3 flex mt-5'>
                                    <h1 className='mr-2 font-extrabold'>406.32</h1>

                                    <div>
                                        <p>+2.25</p>
                                        <p>+0.26%</p>
                                    </div>
                                </div>

                            </div>

                            <div className='chart__header__item2'>
                                <p>Avg Vol (3M)</p>
                                <p>Shares Outstanding</p>
                                <p>Mkt Cap</p>
                                <p>Div Yield</p>

                                <span>View all</span>
                            </div>


                            <div className='chart__header__item4'>
                                <p>21.7M</p>
                                <p>7.23B</p>
                                <p>3.02T</p>
                                <p>0.74%</p>
                                <p>
                                    <ForwardIcon className="w-4 h-4 text-white" />

                                </p>
                            </div>

                        </div>

                        <div className='lg:hidden'>

                            <div className='flex justify-between border-b border-[#C8C8C81A] p-2'>
                                <div>1</div>
                                <div className='flex'>
                                    <h3>TRUMP / USDT</h3>
                                    <select>
                                        <option></option>

                                    </select>
                                </div>
                                <div className='flex gap-2'>
                                    <StarIcon width={20} color='yellow' />
                                    <Share2Icon width={20} />

                                </div>
                            </div>

                            <div className='flex justify-center items-center gap-3  border-b border-[#C8C8C81A] p-2'>
                                <h3>TRUMP</h3>
                                <p>
                                    Trump meme token
                                </p>
                            </div>
                            <div className='flex justify-center items-center gap-3  border-b border-[#C8C8C81A] p-2'>
                                <h3>$12.4</h3>
                                <p>
                                    14:05
                                </p>
                            </div>

                        </div>





                        <div className="mx-auto">
                            <CandlestickChart />
                        </div>

                        <div className='hidden lg:grid'>
                            <TransactionDetails/>
                        </div>

                    </div>
                    <div className='sniper__item'
                    >

                        <button className='telegram__connect'>
                            Connect Telegram Bot Wallet
                        </button>

                        <div className='trader__header mt-2'>

                            <button className={isBuy ? `active__btn` : ``} onClick={() => setIsBuy(true)}>Buy</button>
                            <button className={isBuy ? `` : `active__btn__sell`} onClick={() => setIsBuy(false)}>Sell</button>

                        </div>

                        <div>
                            {isBuy ?
                                <div className='trade__option p-5'>

                                    {/* BUY */}

                                    <h3>Buy</h3>

                                    <form>
                                        <input type='number' placeholder='Buy Trump' step="any" required />

                                        <div className='edit__amount'>

                                            <span>
                                                10
                                            </span>
                                            <span>
                                                50
                                            </span>
                                            <span>
                                                100
                                            </span>
                                            <span>
                                                500
                                            </span>


                                        </div>

                                        {isConnected ? <button>Buy</button> : <ConnectWalletButton />}


                                    </form>


                                </div>
                                :
                                <div className='trade__option p-5'>

                                    {/* BUY */}

                                    <h3>Sell</h3>

                                    <form>
                                        <input type='number' placeholder='Sell Trump' step="any" required />

                                        <div className='edit__amount'>

                                            <span>
                                                10
                                            </span>
                                            <span>
                                                50
                                            </span>
                                            <span>
                                                100
                                            </span>
                                            <span>
                                                500
                                            </span>


                                        </div>


                                        {isConnected ? <button className='button__sell'>Sell</button> : <ConnectWalletButton />}


                                    </form>


                                </div>

                            }




                        </div>



                        {/* INFO */}

                        <div className='trade__info'>
                            <div className='trade__info__header'>
                                <h3 className='text-md'>Trade Info</h3>
                            </div>

                            <div className='trade__info__items mt-4'>

                                <div className='flex justify-between'>
                                    <p className='text-white/50'>Dev Holdings</p>
                                    <p>0%</p>
                                </div>

                                <div className='flex justify-between'>
                                    <p className='text-white/50'>Sniper Holdings</p>
                                    <p>0%</p>
                                </div>

                                <div className='flex justify-between'>
                                    <p className='text-white/50'>Bundler Holdings</p>
                                    <p>0%</p>
                                </div>

                            </div>
                        </div>



                        {/* <div className='trade__info mt-5'>
                            <div className='trade__info__header'>
                                <h3>Time & Sales</h3>
                            </div>

                            <div className='trade__info__items mt-4'>

                                <div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div><div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div><div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div><div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div>
                                <div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div><div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div><div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div><div className='flex justify-between'>
                                    <p>16:58:32</p>
                                    <p>420.56</p>
                                    <p>25</p>
                                </div>

                            </div>
                        </div> */}

                        <TokenDetails/>

                        <div className='lg:hidden'>
                            <TransactionDetails/>
                        </div>



                    </div>

                </div>

            </div>
        </div>
    )
}

export default page
