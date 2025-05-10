
import type { Metadata } from "next";
import Navbar from "./navbar";
import "./globals.css";
import { WalletProvider } from './context/WalletContext'


export const metadata: Metadata = {
  title: "Chart App | Home",
  description: "Chart and Trading App",
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
