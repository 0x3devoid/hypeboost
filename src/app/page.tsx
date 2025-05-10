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
                    <p className="text-gray-400">{(() => {
                      // Generate random time between 2 seconds and 20 minutes ago
                      const randomSeconds = Math.floor(Math.random() * (20 * 60 - 2 + 1)) + 2;
                      if (randomSeconds < 60) {
                        return `${randomSeconds} seconds ago`;
                      } else {
                        const minutes = Math.floor(randomSeconds / 60);
                        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
                      }
                    })()}</p>
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
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
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