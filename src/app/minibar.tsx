"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { User2Icon, BellIcon, SearchIcon, X, Search, CoinsIcon, BitcoinIcon, DollarSignIcon } from "lucide-react";
import Link from 'next/link';
import ConnectWalletButton from "./utils/ConnectWalletButton"

interface Token {
    id: number;
    symbol: string;
    address: string;
    name: string;
    network: string
}

const Minibar = () => {

    const [isModalOpen, setisModalOpen] = useState(false);
    const [searchQuery, setsearchQuery] = useState('');
    const [searchResult, setsearchResult] = useState<Token[]>([]);
    const inputRef: any = useRef(null);

    const tokens = [
        { id: 1, symbol: 'ETH', name: 'Ethereum', network: 'Ethereum', address: "0x6284753789073689033335974" },
        { id: 2, symbol: 'BNB', name: 'Binance Coin', network: 'BSC', address: "0x6267894753789073689033335974" },
        { id: 3, symbol: 'MATIC', name: 'Polygon', network: 'Polygon', address: "0x45284753789073689033335974" },
        { id: 4, symbol: 'AVAX', name: 'Avalanche', network: 'Avalanche', address: "0x4793584753789073689033335974" },
        { id: 5, symbol: 'PEPE', name: 'Pepe', network: 'Ethereum', address: "0x9058284753789073689033335974" },
        { id: 6, symbol: 'SHIB', name: 'Shiba Inu', network: 'Ethereum', address: "0x793306284753789073689033335974" },

    ];

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setsearchResult([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = tokens.filter(token =>
            token.symbol.toLowerCase().includes(query) ||
            token.name.toLowerCase().includes(query)
        ) as Token[];


        setsearchResult(results);
    }, [searchQuery]);

    useEffect(() => {
        if (isModalOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isModalOpen]);

    useEffect(() => {
        const handleEsc = (e: any) => {
            if (e.key === 'Escape') {
                setisModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const openModal = () => setisModalOpen(true)
    const closeModal = () => {
        setisModalOpen(false);
        setsearchQuery('')
        setsearchResult([])
    }

    return (
        <>
            <div className='hidden lg:flex justify-between mb-5 w-full'>

                <div className='search cursor-pointer' onClick={openModal} >
                    <SearchIcon className="w-4 h-4 text-white lg:mt-1" />
                    <p className='ml-2 bg-transparent placeholder-gray-400'>
                        search your tokens...
                    </p>
                </div>


                <div className='mini__right__item'>
                    <div>

                        <ConnectWalletButton />
                    </div>

                    <div className='last__mini__item'>
                        <div className='alert mr-2'>

                            <BellIcon className="w-4 h-4 text-white" />


                        </div>

                        <div className='user'>

                            <div className='alert mr-1'>
                                <User2Icon className="w-4 h-4 text-white" />

                            </div>

                            <span className='text-sm'>User</span>

                        </div>
                    </div>
                </div>





            </div>

            <div className='lg:hidden'>

                <div className='flex justify-between p-2'>

                    <div>
                        <p className='text-gray-400 text-sm'>Welcome</p>
                        <h2 className='font-bold text-[20px]'>Alexander</h2>
                    </div>

                    <div className='flex gap-3 mt-5'>
                        <div className=''>

                            <BellIcon className="w-5 h-5 text-white" />


                        </div>

                        <div className=''>

                            <div className=''>
                                <User2Icon className="w-5 h-5 text-white" />

                            </div>


                        </div>
                    </div>

                </div>
                <div className='rounded-2xl mt-3 bg-[#212325] flex justify-between text-center w-full p-2 cursor-pointer' onClick={openModal} >
                    <p className='text-center text-gray-400 text-sm'>
                        Search Here
                    </p>
                    <SearchIcon className="w-5 h-5 text-[#77ED91]" />

                </div>

            </div>





            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-[#0a0a0a] bg-opacity-70">
                    <div className="bg-[#212325] w-full max-w-xl rounded-2xl overflow-hidden">
                        {/* Search input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-[#77ED91]" />
                            </div>
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setsearchQuery(e.target.value)}
                                placeholder="Search tokens..."
                                className="block w-full pl-10 pr-10 py-3 bg-[#212325] border-b border-gray-900 text-white placeholder-gray-400 outline-none"
                            />
                            <button
                                onClick={closeModal}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X size={20} className="text-gray-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Search results */}
                        <div className="max-h-96 overflow-y-auto">
                            {searchResult && searchResult.length > 0 ? (
                                <div className="py-2">
                                    {searchResult.map((token) => (
                                        <Link href={`/token/${token.address}`}>
                                            <div
                                                key={token.id}
                                                className="px-2 py-3 hover:bg-gray-700 cursor-pointer flex items-center justify-between text-sm"
                                            >
                                                <div>

                                                    <div className='flex gap'>
                                                        <BitcoinIcon className="w-5 h-5 text-orange-400"  />
                                                        <DollarSignIcon className="w-5 h-5 text-green-500" />
                                                        <h3> {token.name} </h3>

                                                    </div>

                                                    <div className='flex gap-1'>
                                                        <BitcoinIcon className="w-5 h-5 text-red-500" />
                                                        <p> {token.symbol} </p>
                                                    </div>
                                                  
                                                </div>
                                                {/* Last Item */}
                                                <div className='text-[11px]'>
                                                    <div className='flex justify-end gap-2'>
                                                        <p>$0.003</p>
                                                        <p className='text-gray-400'>1H <span className='text-red-600'>-0.25%</span> </p>
                                                        <p className='text-gray-400'>24H <span className='text-green-500'>3.25%</span> </p>
                                                    </div>
                                                    <div className='flex justify-end gap-2'>
                                                        <div className='flex gap-1 rounded border border-[gray] p-[1px] px-2'>
                                                          <span className='text-gray-400 text-[10px]'>LIQ</span>  <p>$30k</p>
                                                        </div>
                                                        <div className='flex gap-1 rounded border border-[gray] p-[1px] px-2'>
                                                          <span className='text-gray-400 text-[10px]'>VOL</span>  <p>$7k</p>
                                                        </div>
                                                        <div className='flex gap-1 rounded border border-[gray] p-[1px] px-2'>
                                                          <span className='text-gray-400 text-[10px]'>MCAP</span>  <p>$63k</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : searchQuery.trim() !== '' ? (
                                <div className="py-6 text-center text-gray-400">
                                    No token found for "{searchQuery}"
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Minibar
