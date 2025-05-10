import React from 'react'
import Minibar from '../minibar'
import CryptoCards from './walletcard'
import "./styles.css"
import TransactionTable from './tnxtable'
import Image from 'next/image'
import { Cross, MoreVerticalIcon, SendIcon , AlertCircleIcon} from "lucide-react";

const Wallet = () => {
  return (
    <div>
      <Minibar />


      <div className='mt-5'>
        <h1>Wallet Manager</h1>
        <CryptoCards />


        <div className='mt-5 grid gap-5 grid-cols-1 lg:grid-cols-3'>

          <div className='col-span-1 lg:col-span-1'>
            <div className='flex justify-start gap-3'>

              <Image src="/images/btc.png" width={20} height={20} alt='.' />
              <h3>EVM Wallets</h3>

            </div>

            <div className='flex justify-between text-center gap-5 text-sm mt-5'>

              <div className='rounded bg-[#1C1C1C] p-2 cursor-pointer'>
                <p>Wallet</p>
              </div>

              <div className='rounded bg-[inherit] p-2 cursor-pointer'>
                <p>Tokens</p>

              </div>

              <div>
                <button type='button' className='button cursor-pointer rounded-2xl bg-[#77ED91] p-2 px-4 text-black text-sm font-bold flex gap-2'>
                  <Cross className="w-3 h-3 text-black mt-1" /> <p>New Wallet</p></button>
              </div>

            </div>

            <div className='grid gap-2 mt-5 text-sm'>

              <div className='flex justify-between gap-2 rounded-2xl bg-[#1C1C1C] p-2'>
                <div className='flex gap-3'>
                  <Image src="/images/usdt.png" width={25} height={20} alt='.' />
                  <p>
                    Tether (USDT)
                  </p>

                </div>
                <MoreVerticalIcon className="w-10 h-510text-white mt-1" />


              </div>

              <div className='flex justify-between gap-2 rounded-2xl bg-[#1C1C1C] p-2'>
                <div className='flex gap-3'>
                  <Image src="/images/usdt.png" width={25} height={20} alt='.' />
                  <p>
                    Tether (USDT)
                  </p>

                </div>
                <MoreVerticalIcon className="w-10 h-510text-white mt-1" />


              </div>

            </div>

          </div>


          <div className='grid grid-cols-2 gap-5 col-span-1 lg:col-span-2 lg:flex lg:justify-end'>
            <div>

              <div className='flex gap-3'>
              <SendIcon className="w-4 h-4 text-white mt-1" /> 
                <p>Withdraw Wallets</p>
              </div>
              <div className='mt-5'>
                <p className='font-bold'>0 verifed wallets</p>
              </div>

            </div>
            <div>

              <div className='mt-10'>
                <button type='button' className='button cursor-pointer rounded-2xl bg-[#77ED91] p-2 px-8 text-black text-sm font-bold flex gap-2'>
                  <Cross className="w-3 h-3 text-black mt-1" /> <p>Add Wallet</p></button>
              </div>

            </div>
          </div>




        </div>

        <TransactionTable />

      </div>
    </div>
  )
}

export default Wallet
