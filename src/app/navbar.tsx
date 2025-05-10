"use client";
import React from 'react'
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useWallet } from './context/WalletContext'



const Navbar = () => {
    const pathname = usePathname();
    const { isConnected, disconnectWallet } = useWallet()


    const navItems = [
        { src: "/images/trade.png", label: "New Pairs", link: "/pairs" },
        { src: "/images/menu.png", label: "Snipers", link: "/snipers" },
        { src: "/images/activity.png", label: "Holdings", link: "/holdings" },
        { src: "/images/wallet-2.png", label: "Wallet Manager", link: "/wallet" },
        { src: "/images/book.png", label: "Copy Trading", link: "/copy" },
        { src: "/images/user.png", label: "Portfolio Analyzer", link: "/portfolio" },
    ];
    const mobilenavItems = [
        { src: "/images/trade.png", label: "New Pairs", link: "/pairs" },
        { src: "/images/menu.png", label: "Snipers", link: "/snipers" },
        { src: "/images/activity.png", label: "Holdings", link: "/holdings" },
        { src: "/images/wallet-2.png", label: "Wallet Manager", link: "/wallet" },
    ];
    return (
        <>
            {/* Sidebar for desktop only */}
            <nav className="hidden lg:flex w-75 flex-col p-6 text-white fixed h-full nav__bar">
                <div className="mb-10">
                    <h1 className="text-2xl font-bold">Logo</h1>
                </div>

                <ul className="flex flex-col gap-6 mt-10 nav__item">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.link;
                        return (
                            <Link key={index} href={item.link}>
                                <li
                                    className={`flex items-start ml-5 gap-3 cursor-pointer transition delay-100 ${isActive ? "active" : ""
                                        }`}
                                >
                                    <Image
                                        src={item.src}
                                        alt={item.label}
                                        width={25}
                                        height={25}
                                        className={isActive ? "item__img" : ""}
                                    />
                                    <span>{item.label}</span>
                                </li>
                            </Link>
                        );
                    })}

                    <div className="pt-10">
                        {isConnected && <button onClick={disconnectWallet} className='flex items-center gap-3 hover:text-red-400 transition cursor-pointer'>
                            <Image src="/images/logout.png" alt="Logout" width={25} height={25} />
                            <span>Logout</span>
                        </button>}
                    </div>
                </ul>
            </nav>


            <div className="lg:hidden fixed bottom-0 left-0 w-full flex justify-center pb-3 z-50">
                <nav className="w-[90%] max-w-[450px] border border-[#191919] bg-neutral-900 rounded-2xl">
                    <ul className="flex justify-between items-center px-6 py-3">
                        {mobilenavItems.map((item, index) => {
                            const isActive = pathname === item.link;
                            return (
                                <Link key={index} href={item.link}>
                                    <li
                                        className={`flex flex-col items-center justify-center gap-1 transition-all ${isActive ? "text-blue-400" : "text-gray-400"
                                            }`}
                                    >
                                        <Image
                                            src={item.src}
                                            alt={item.label}
                                            width={24}
                                            height={24}
                                            className={`${isActive ? "scale-110" : "opacity-75"}`}
                                        />
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                </nav>
            </div>


        </>
    )
}

export default Navbar
