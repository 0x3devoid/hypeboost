
import type { Metadata } from "next";
import Navbar from "./navbar";
import "./globals.css";
import { WalletProvider } from './context/WalletContext'


export const metadata: Metadata = {
  title: "HypeBoost | Home",
  description: "Hold $HypeBoost and earn $HYPE reward",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >

        <WalletProvider>




          <main>{children}</main>



        </WalletProvider>


      </body>
    </html>
  );
}
