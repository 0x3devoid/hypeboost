'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import { CHAINS } from './config/constants/chains'

// Your WalletConnect project ID - get it from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '2a82896056cb711d72df1bc4eae0e2d4'

// Metadata for your app
const metadata = {
  name: 'Chart App',
  description: 'Chart and Trading App',
  url: 'https://yourapp.com', // Update with your app's URL
  icons: ['https://yourapp.com/icon.png'] // Update with your app's icon
}

// Available networks - include the ones you want to support
// You can expand or modify this list as needed

const ethersConfig = defaultConfig({
    metadata,
    enableEIP6963: true, // true by default
    enableInjected: true, // true by default
    enableCoinbase: true, // true by default
    rpcUrl: "...", // used for the Coinbase SDK
    defaultChainId: 1, // used for the Coinbase SDK
  });

// Initialize the Web3Modal
createWeb3Modal({
  ethersConfig,
  chains: [CHAINS[0]],
  projectId,
  metadata,
  enableAnalytics: true, // Optional: Set to false to disable analytics
  themeVariables: {
    "--w3m-color-mix": "#000",
    "--w3m-color-mix-strength": 5,
    "--w3m-border-radius-master": "2px",
    "--w3m-accent": "rgba(81, 252, 139, 0.79)",
  },
})

// Export this module without any specific function - 
// just importing it will execute the createWeb3Modal