"use client"
import { useEffect, useState } from 'react';
import { ethers, formatEther, formatUnits, BrowserProvider, JsonRpcProvider, Wallet } from 'ethers';
import { useWallet } from './context/WalletContext';
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import ConnectWalletButton from './utils/ConnectWalletButton';
import { ContractAbi, ContractAddress } from './config/constants/abi';




export default function TokenDashboard() {
  const [totalRewards, setTotalRewards] = useState("0");
  const [userRewards, setUserRewards] = useState("0");
  const [tokenInfo, setTokenInfo] = useState({ name: "Hype Boost", symbol: "HBOOST" });
  const [isLoading, setIsLoading] = useState(false);

  const { address, isConnected } = useWallet();
  const { walletProvider } = useWeb3ModalProvider();
  const FALLBACK_PRIVATE_KEY =
    "a340f57a5af0182ffa5e3abfeeadda409def53f0c62c8f47e3b7cba9d229ba1c";

  async function fetchContractData() {
    try {
      setIsLoading(true);
      const ethersProvider = walletProvider
        ? new BrowserProvider(walletProvider)
        : new JsonRpcProvider(
          "https://rpc.hyperliquid.xyz/evm"
        );
      const signer = walletProvider
        ? await ethersProvider.getSigner()
        : new Wallet(FALLBACK_PRIVATE_KEY, ethersProvider);
      const contract = new ethers.Contract(
        ContractAddress,
        ContractAbi,
        signer
      );

      // Get token name and symbol
      const name = await contract.name();
      const symbol = await contract.symbol();
      setTokenInfo({ name, symbol });

      // Get total rewards
      const totalDistributed = await contract.TotalAccumulatedFee();
      setTotalRewards(formatEther(totalDistributed));

      // Get user's rewards if connected
      if (isConnected && address) {
        const allAddress = await contract.getAllHolders();
        const userRewardsAmount = Number(totalRewards) / allAddress.length;
        setUserRewards(userRewardsAmount.toString());
      }
    } catch (error) {
      console.error("Error fetching contract data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchContractData();
  }, [isConnected, address, walletProvider]);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12">
          <div className="lg:flex justify-between items-center">
            <h1 className="text-3xl font-bold">{tokenInfo.name} ({tokenInfo.symbol}) Rewards Dashboard</h1>

            <ConnectWalletButton />
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="space-y-8">
          {/* Stats Card */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Token Rewards Distribution</h2>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-400 mb-2">Total Rewards Distributed</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold">{parseFloat(totalRewards).toLocaleString()}</p>
                    <p className="text-xl text-gray-400 mb-1">HYPE</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-400 mb-2">Current Distribution Rate</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold">2%</p>
                    <p className="text-xl text-gray-400 mb-1">{tokenInfo.symbol}/day</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Rewards Section */}
          <div className="bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Your Rewards</h2>

            {!isConnected ? (
              <div className="bg-gray-700 p-6 rounded-lg text-center">
                <p className="text-xl">Connect your wallet to view your rewards</p>
                <button
                  onClick={() => open()}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <p className="text-gray-400 mb-2">Your Total Rewards</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold">{parseFloat(userRewards).toLocaleString()}</p>
                    <p className="text-xl text-gray-400 mb-1">HYPE</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">Wallet Address</p>
                    <p className="text-gray-400">{address?.substring(0, 6) + '...' + address?.substring(address.length - 6)}</p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="font-medium">Last Reward Distribution</p>
                    <p className="text-gray-400">5mins ago</p>
                  </div>
                </div>
              </div>
            )}
          </div>


        </main>



        <footer className="mt-12 py-6 text-center">
          <p className="text-gray-400 mb-4">&copy; 2025 {tokenInfo.name} Rewards Dashboard</p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://t.me/hyboost"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm.14 19.018c-.868 0-.98-.002-1.32-.019a4.705 4.705 0 01-1.549-.298 3.234 3.234 0 01-1.862-1.863 4.724 4.724 0 01-.298-1.55c-.017-.338-.019-.45-.019-1.318s.002-.979.019-1.318c.017-.53.11-1.05.298-1.55a3.232 3.232 0 011.862-1.862c.499-.188 1.018-.281 1.55-.298.338-.017.45-.019 1.318-.019s.98.002 1.318.019c.532.017 1.051.11 1.55.298.853.325 1.537 1.009 1.862 1.862.188.499.281 1.018.298 1.55.017.338.019.45.019 1.318s-.002.98-.019 1.318a4.724 4.724 0 01-.298 1.55 3.232 3.232 0 01-1.862 1.862c-.499.188-1.018.281-1.55.298-.338.017-.45.019-1.318.019zm5.095-3.019c.031-.44.047-.894.047-1.35 0-1.022-.195-1.993-.55-2.888a6.571 6.571 0 00-1.497-2.184 6.608 6.608 0 00-2.183-1.497A6.59 6.59 0 0010.65 7.53c-.456 0-.909.016-1.35.047-.41-.455-.661-1.05-.661-1.695 0-1.41 1.15-2.56 2.56-2.56 1.41 0 2.56 1.15 2.56 2.56 0 .645-.25 1.24-.66 1.695.441-.031.894-.047 1.35-.047 1.022 0 1.993.195 2.888.55a6.571 6.571 0 012.184 1.497 6.608 6.608 0 011.497 2.183c.355.895.55 1.866.55 2.888 0 .456-.016.91-.047 1.35.455.41 1.05.66 1.695.66 1.41 0 2.56-1.15 2.56-2.56 0-1.41-1.15-2.56-2.56-2.56-.645 0-1.24.25-1.695.66z" />
              </svg>
              <span className="sr-only">Telegram</span>
            </a>
            <a
              href="https://x.com/HypeBoostToken"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="sr-only">Twitter (X)</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}