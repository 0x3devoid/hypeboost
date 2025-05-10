"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'

// Import the web3modal config to ensure it's initialized
import '../web3modal.config'

interface WalletContextType {
  address: string | undefined
  isConnected: boolean
  isConnecting: boolean
  signer: JsonRpcSigner | null
  provider: BrowserProvider | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
}

const WalletContext = createContext<WalletContextType>({
  address: undefined,
  isConnected: false,
  isConnecting: false,
  signer: null,
  provider: null,
  connectWallet: async () => {},
  disconnectWallet: async () => {}
})

export const useWallet = () => useContext(WalletContext)

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [provider, setProvider] = useState<BrowserProvider | null>(null)
  
  const { open } = useWeb3Modal()
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  
  useEffect(() => {
    const setupProviderAndSigner = async () => {
      if (isConnected && walletProvider) {
        try {
          const ethersProvider = new BrowserProvider(walletProvider)
          setProvider(ethersProvider)
          
          const ethSigner = await ethersProvider.getSigner()
          setSigner(ethSigner)
        } catch (error) {
          console.error("Failed to setup provider and signer:", error)
          setSigner(null)
          setProvider(null)
        }
      } else {
        setSigner(null)
        setProvider(null)
      }
    }
    
    setupProviderAndSigner()
  }, [isConnected, walletProvider])
  
  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      await open()
    } catch (error) {
      console.error("Connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }
  
  const disconnectWallet = async () => {
    try {
      setIsConnecting(true)
      await open({ view: 'Account' })
    } catch (error) {
      console.error("Disconnect error:", error)
    } finally {
      setIsConnecting(false)
    }
  }
  
  const value = {
    address,
    isConnected,
    isConnecting,
    signer,
    provider,
    connectWallet,
    disconnectWallet
  }
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}