'use client'

import React from 'react'
import { WalletProvider } from './context/WalletContext'

// This is a client component that wraps all providers
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  )
}