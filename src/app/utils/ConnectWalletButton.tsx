import { useWallet } from '../context/WalletContext'
import { Wallet } from 'lucide-react'

const ConnectWalletButton = () => {
  const { isConnected, isConnecting, address, connectWallet, disconnectWallet } = useWallet()
  
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }
  
  return (
    <button
      onClick={isConnected ? disconnectWallet : connectWallet}
      disabled={isConnecting}
      type='button'
      className="flex items-center justify-center text-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors px-2 py-1 rounded-lg text-black text-[14px] cursor-pointer mr-3"
    >
      <Wallet size={15} />
      {isConnecting ? (
        <span>Connecting...</span>
      ) : isConnected && address ? (
        <span>{formatAddress(address)}</span>
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>

    // bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors
  )
}

export default ConnectWalletButton