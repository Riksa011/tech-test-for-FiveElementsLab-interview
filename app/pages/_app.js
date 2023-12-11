import "../styles/globals.css";
import Head from "next/head";
import Link from "next/link";
import Moralis from 'moralis';
import { useState, useEffect } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from "ethers";
const {contractAddress, contractAbi} = require('../public/contractData.js')


export default function AppWrapper({ Component, pageProps }) {
  // backend

  const [address, setAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  var moralisStatus = false;

  //Function to start Moralis sdk
  const startMoralisHandler = async () => {
    if (!moralisStatus) {
      console.log('avvio moralis');
      try {
        const moralisApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjVjMWZlZmU1LWQ4NzctNDczNS04ZjA0LWVlM2M3MzFmMTA1NyIsIm9yZ0lkIjoiMzUwMDQyIiwidXNlcklkIjoiMzU5Nzg3IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiIxZWQyYzA1Yy1hN2I4LTQ0NDgtYmNhMi05ZTNkYTI0ZDAzNTMiLCJpYXQiOjE3MDE4ODA2MTYsImV4cCI6NDg1NzY0MDYxNn0.Pc6OECU9e1jrvK46mGrxLACYZz9r7CJ50V3DTubdVxA";
        Moralis.start({
          apiKey: moralisApiKey,
        });
        moralisStatus = true;
        console.log('moralis avviato');
      } catch (e) {
        console.error(e);
      }
    } else {
      console.log('moralis è già avviato')
    }
  };

  // Function to handle metamask wallet connection
  const connectWalletHandler = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        if (!connected) {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const provider = new Web3Provider(window.ethereum);
          const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider.getSigner());
          setAddress(accounts[0]);
          console.log('MetaMask connected successfully');
          setConnected(true);
          setProvider(provider);
          setContract(contractInstance);
          setSigner(provider.getSigner());

          console.log('fatto tutto')
          console.log(contractAddress)

        } else {
          setAddress('');
          console.log('Wallet disconnected');
          setConnected(false);
          setProvider(null);
          setContract(null);
        }
      } catch (err) {
        console.error(err.message)
      }
    } else {
      console.error('Please install MetaMask browser extension')
    }
  };


  // Effect to start Moralis sdk
  useEffect(() => {
    startMoralisHandler();
  }, []);


  //frontend
  return(
    <>
      <Head>
        <title>Riccardo Santi FiveElementsLab Tech Test</title>
      </Head>

      <div className="page-wrapper">
        {/* navbar */}
        <nav className="nav">
          <div className="navbar-content">

            {/* pages links */}
            <ul className="nav-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="https://www.linkedin.com/in/riccardo-santi/" target="_blank">My Linkedin</Link>
              </li>
              <li>
                <Link href="https://github.com/Riksa011" target="_blank">My Github</Link>
              </li>
            </ul>

            {/* connect wallet button */}
            <div className="connect-wallet">
              <button onClick={connectWalletHandler} className="connectWalletButton">
                {connected ? "Disconnect Wallet" : "Connect Wallet"}
              </button>
            </div>
          </div>
        </nav>

        {/* page parameters */}
        <div className="content">
          <Component {...pageProps}
            address={address}
            connected={connected}
            contract={contract}
          />
        </div>

        {/* footer */}
        <footer className="footer">
          <p>
            <strong>Riccardo Santi</strong> ©2023 FiveElementsLab Tech Test
          </p>
        </footer>
      </div>
    </>
  )
}
