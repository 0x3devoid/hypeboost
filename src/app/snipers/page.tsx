"use client"
import React, { useState } from 'react'
import Minibar from '../minibar'
import "./styles.css";
import Image from 'next/image';
import { EyeClosedIcon, BellIcon, ForwardIcon } from "lucide-react";
import CandlestickChart from './chart';
import CandlestickChart2 from './response'



const Snipers = () => {

  const [isBuy, setIsBuy] = useState(true);



  return (
    <div>
      <Minibar />


      <div className='m-auto text-9xl text-center relative top-50 left-0'>
      <h1>COMING SOON</h1>
    </div>


    </div>
  )
}

export default Snipers
