"use client"
import { useEffect, useState } from 'react';
import { ethers, formatEther, BrowserProvider, JsonRpcProvider, Wallet, Contract } from 'ethers';
import { useWallet } from './context/WalletContext';
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ContractAbi, ContractAddress } from './config/constants/abi';
import { BugPlayIcon, SendToBackIcon, SendHorizontalIcon } from 'lucide-react';
import Image from 'next/image';

interface GradientCardProps {
  children: React.ReactNode;
  className?: string;
}

interface StatisticDisplayProps {
  label: string;
  value: string | number;
  unit?: string;
}

interface TokenInfo {
  name: string;
  symbol: string;
}

// New components
const GradientCard: React.FC<GradientCardProps> = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-br from-green-900 via-green-800 to-green-900 rounded-2xl p-6 shadow-lg border border-green-700/30 ${className}`}>
    {children}
  </div>
);

const StatisticDisplay: React.FC<StatisticDisplayProps> = ({ label, value, unit }) => (
  <div className="flex flex-col">
    <p className="text-green-300 text-sm font-medium mb-1">{label}</p>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-bold text-white">{value}</span>
      {unit && <span className="text-green-400 text-lg">{unit}</span>}
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin h-10 w-10 border-4 border-green-400 rounded-full border-t-transparent"></div>
  </div>
);

const ConnectWalletButton: React.FC = () => {
  const { isConnected, connectWallet } = useWallet();

  return (
    <button
      onClick={connectWallet}
      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-300 focus:ring-4 focus:ring-green-500/30 flex items-center gap-2 shadow-lg shadow-green-900/30"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
      </svg>
      {isConnected ? "Connected" : "Connect Wallet"}
    </button>
  );
};

// Define the main component and its return type
export default function TokenDashboard() {
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [userRewards, setUserRewards] = useState<number>(0);
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({ name: "Hype Boost", symbol: "HBOOST" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allHolders, setAllHolders] = useState<number>(0);
  const [timeStamp, setTimeStamp] = useState<Date | null>(null);
  const [latestDistribution, setLatestDistribution] = useState<Date | null>(null);
  const [contractBalance, setContractBalance] = useState(0)
  const HypePrice: number = 25;

  const { address, isConnected } = useWallet();
  const { walletProvider } = useWeb3ModalProvider();
  const FALLBACK_PRIVATE_KEY: string =
    "a340f57a5af0182ffa5e3abfeeadda409def53f0c62c8f47e3b7cba9d229ba1c";

  async function fetchContractData(): Promise<void> {
    try {
      setIsLoading(true);
      const ethersProvider = walletProvider
        ? new BrowserProvider(walletProvider)
        : new JsonRpcProvider("https://rpc.hyperliquid.xyz/evm");

      const signer = walletProvider
        ? await ethersProvider.getSigner()
        : new Wallet(FALLBACK_PRIVATE_KEY, ethersProvider);

      const contract = new Contract(
        ContractAddress,
        ContractAbi,
        signer
      );

      const balance = await ethersProvider.getBalance(ContractAddress);

      setContractBalance(Number(formatEther(balance)));

      // Get token name and symbol
      const name: string = await contract.name();
      const symbol: string = await contract.symbol();
      setTokenInfo({ name, symbol });

      // Get total rewards
      const totalDistributed = await contract.totalDistributedEth();
      const allAddress: string[] = await contract.getAllHolders();
      setTotalRewards(Number(formatEther(totalDistributed)));
      setAllHolders(allAddress.length);

      const lastDistribution = await contract.lasttimeofdistribution();
      const timestamp: number = Number(lastDistribution);
      const readableDate = new Date(timestamp * 1000);
      setTimeStamp(readableDate);

      // Set a fake "last distribution" that's more recent
      const currentTime = new Date();
      setLatestDistribution(currentTime);

      // Get user's rewards if connected
      if (isConnected && address) {
        const userRewardsAmount = await contract.getEthReceivedByHolder(address);
        setUserRewards(Number(formatEther(userRewardsAmount)));
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

  // Calculate time since last distribution
  const getTimeSinceLastDistribution = (): string => {
    if (!timeStamp) return "N/A";

    const now = new Date();
    const diff = now.getTime() - timeStamp.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m ago`;
  };

  const LastR: string = getTimeSinceLastDistribution();

  const formatAddress = (addr: string | null | undefined): string => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 to-green-900 text-white">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden z-0 opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-green-600 blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-green-500 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-green-700 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <div className=" bg-green-600 rounded-full">
                  <Image src="/images/logo.png" alt="." width={40} height={40} className='rounded-full' />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{tokenInfo.name}</h1>
                  <p className="text-green-300">Rewards Dashboard</p>
                </div>
              </div>

              <ConnectWalletButton />
            </div>
          </header>

          {/* Main Dashboard */}
          <main className="space-y-8">
            {/* Overview Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GradientCard>
                <StatisticDisplay
                  label="Total Rewards"
                  value={totalRewards.toFixed(2)}
                  unit="HYPE"
                />
              </GradientCard>

              <GradientCard>
                <StatisticDisplay
                  label="Distribution Rate"
                  value="2%"
                  unit={`${tokenInfo.symbol}/day`}
                />
              </GradientCard>

              <GradientCard>
                <StatisticDisplay
                  label="Total Holders"
                  value={allHolders.toLocaleString()}
                />
              </GradientCard>

              <GradientCard>
                <StatisticDisplay
                  label="Last Distribution"
                  value={getTimeSinceLastDistribution()}
                />
              </GradientCard>
            </div>

            {/* User Rewards Section */}
            <GradientCard className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">Your Rewards Dashboard</h2>
              </div>

              {!isConnected ? (
                <div className="bg-green-800/40 p-8 rounded-xl text-center border border-green-700/30">
                  <div className="max-w-md mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-xl mb-6">Connect your wallet to view your rewards</p>
                    <div className='flex justify-center'><ConnectWalletButton /></div>
                  </div>
                </div>
              ) : isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-800/40 p-6 rounded-xl border border-green-700/30">
                      <div className="mb-1 text-green-300 text-sm font-medium">Your Total Rewards</div>
                      <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">{userRewards.toFixed(4)}</span>
                        <span className="text-xl text-green-400 mb-1">HYPE</span>
                      </div>
                      <div className="mt-2 text-green-300/70 text-sm">
                        Estimated value: ${(Number(userRewards) * HypePrice).toFixed(2)} USD
                      </div>
                    </div>

                    <div className="bg-green-800/40 p-6 rounded-xl border border-green-700/30">
                      <div className="mb-1 text-green-300 text-sm font-medium">Next Distribution</div>
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div className="text-xl font-semibold">~{contractBalance.toFixed(3)} HYPE</div>

                        </div>

                        <div className="text-xs text-green-400">Estimated time: 20m</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-800/40 p-6 rounded-xl border border-green-700/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-green-300">Connected Wallet</span>
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-green-800 rounded-lg text-sm mr-2">
                              {formatAddress(address)}
                            </span>
                            <button className="text-green-400 hover:text-green-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <span className="font-medium text-green-300">Last Received</span>
                          <span className="text-white">

                            {userRewards > 0 ? <>{LastR}</> : "Never"}

                          </span>
                        </div>

                      </div>

                      <div className="flex flex-col justify-center">
                        <a href="https://app.hyperswap.exchange/#/swap?use=V2"><button className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-all duration-300 mb-2 flex justify-center items-center gap-2">
                          <SendHorizontalIcon width={10} />   Buy More {tokenInfo.name}
                        </button></a>
                        {userRewards > 0 ? <>
                          <a href={`https://purrsec.com/address/${address}`}> <button className="w-full py-2 px-4 bg-transparent border border-green-600 hover:bg-green-800/30 rounded-lg font-medium transition-all duration-300 text-green-400 hover:text-green-300">
                            View Transaction History
                          </button></a>
                        </> :
                          ""}

                      </div>
                    </div>
                  </div>
                  {/* 
                  <div className="bg-green-800/40 p-6 rounded-xl border border-green-700/30">
                    <h3 className="text-lg font-medium mb-4 text-green-200">Recent Activity</h3>
                    <div className="space-y-4">
                      {latestDistribution && (
                        <div className="flex justify-between items-center pb-3 border-b border-green-700/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-700 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Distribution</p>
                              <p className="text-sm text-green-400">{latestDistribution.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">+0.42 HYPE</p>
                            <p className="text-sm text-green-400">$105.00</p>
                          </div>
                        </div>
                      )}

                      {timeStamp && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-700 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">Distribution</p>
                              <p className="text-sm text-green-400">{timeStamp.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">+0.38 HYPE</p>
                            <p className="text-sm text-green-400">$95.00</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div> */}
                </div>
              )}
            </GradientCard>

            {/* <GradientCard className="mt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-700 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold">Market Statistics</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-green-800/40 p-4 rounded-xl border border-green-700/30">
                  <p className="text-green-300 text-sm mb-1">Current Price</p>
                  <p className="text-2xl font-bold">$0.246</p>
                  <div className="flex items-center mt-1 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm">+5.2%</span>
                  </div>
                </div>

                <div className="bg-green-800/40 p-4 rounded-xl border border-green-700/30">
                  <p className="text-green-300 text-sm mb-1">Market Cap</p>
                  <p className="text-2xl font-bold">$12.5M</p>
                  <div className="flex items-center mt-1 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm">+3.8%</span>
                  </div>
                </div>

                <div className="bg-green-800/40 p-4 rounded-xl border border-green-700/30">
                  <p className="text-green-300 text-sm mb-1">24h Volume</p>
                  <p className="text-2xl font-bold">$1.8M</p>
                  <div className="flex items-center mt-1 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm">+12.3%</span>
                  </div>
                </div>

                <div className="bg-green-800/40 p-4 rounded-xl border border-green-700/30">
                  <p className="text-green-300 text-sm mb-1">Liquidity</p>
                  <p className="text-2xl font-bold">$4.2M</p>
                  <div className="flex items-center mt-1 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="text-sm">+1.5%</span>
                  </div>
                </div>
              </div>
            </GradientCard> */}
          </main>

          <footer className="mt-16 pt-8 border-t border-green-800/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-600 rounded-full">
                    <Image src="/images/logo.png" alt="." width={20} height={20} className='rounded-full' />

                  </div>
                  <h3 className="text-xl font-bold">{tokenInfo.name}</h3>
                </div>
                <p className="text-green-300 mb-4">The next-generation rewards token in the HyperEvm ecosystem.</p>
                <div className="flex space-x-4">
                  <a href="https://t.me/hypehboost" target="_blank" rel="noopener noreferrer" className="p-2 bg-green-800 hover:bg-green-700 rounded-full transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  </a>
                  <a href="/" target="_blank" rel="noopener noreferrer" className="p-2 bg-green-800 hover:bg-green-700 rounded-full transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">

                  <li>
                    <a href="https://app.hyperswap.exchange/#/swap?use=V2" className="text-green-300 hover:text-white transition-colors">Buy {tokenInfo.symbol}</a>
                  </li>
                  <li>
                    <a href={`https://dexscreener.com/hyperevm/${ContractAddress}`} className="text-green-300 hover:text-white transition-colors">Token Metrics</a>
                  </li>
                  <li>
                    <a href="https://t.me/hypehboost" className="text-green-300 hover:text-white transition-colors">Roadmap</a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Subscribe to Updates</h3>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email address"
                    required
                    className="px-4 py-2 bg-green-900 border border-green-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-600 flex-grow"
                  />
                  <a href='https://t.me/hypehboost'>
                    <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-r-lg transition-colors">
                      Subscribe
                    </button>
                  </a>
                </div>
                <p className="mt-3 text-sm text-green-400">Get the latest news and updates straight to your inbox.</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-green-800/50 text-center">
              <p className="text-green-400 text-sm">&copy; {new Date().getFullYear()} {tokenInfo.name}. All rights reserved.</p>
            </div>
          </footer>

        </div>
      </div>
    </div>

  )
}