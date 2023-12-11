import { useState } from 'react'
import Moralis from 'moralis';

const Page = ({ address, connected, contract }) => {

  const [uniswapReqStatus, setUniswapReqStatus] = useState(false);
  const [uniswapFirstCheck, setUniswapFirstCheck] = useState(false);
  const [mintTxHash, setMintTxHash] = useState('');

  //Function to check if user has done a swap on uniswap in the last 24h
  const checkUniswapTx24h = async () => {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 1);

    try {
      let response = await Moralis.EvmApi.transaction.getWalletTransactions({
        "chain": "0xaa36a7",
        "fromDate": fromDate,
        "address": address,
        "limit": 50,
      });

      const uniswapUniversalRouterAddress = '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad';
      const uniswapWETHAddress = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14';
      
      const uniswapTransactions = response.raw.result.filter(tx => {
        const toAddressLower = tx.to_address?.toLowerCase();
        return toAddressLower === uniswapUniversalRouterAddress || toAddressLower === uniswapWETHAddress;
      });
      
      let hasUniswapTransactions = false;
      if (uniswapTransactions.length > 0) {
        hasUniswapTransactions = true;
      };
      setUniswapReqStatus(hasUniswapTransactions);
      setUniswapFirstCheck(true);

      console.log('check finito: ', hasUniswapTransactions);
      return hasUniswapTransactions;

      

    } catch (e) {
      console.error(e);
    }
  };

  //Function to handle Nft reward minting
  const nftMintHandler = async () => {
    try {
      var tx = await contract.mintRewardNft();
      setMintTxHash(tx.hash);
    } catch (e) {
      console.error(e);
    }
  };


  //frontend
  return (
    <>
    <div className="centered-container">
      {connected ? (
        <>
          {/* WALLET CONNECTED */}
          <h1>Your address: {address}</h1>
          <br></br>
          <hr></hr>
          <br></br>
          {uniswapFirstCheck ? (
            /* FIRST CHECK TRUE */
            <>
              {uniswapReqStatus ? (
                /* UNISWAP TX TRUE */
                <>
                  {mintTxHash ? (
                    <>
                      <br></br>
                      <h1 className='success'>You have successfully minted your reward Nft!</h1>
                      <h2>Transaction hash: {mintTxHash}</h2>
                      <h2><a href={`https://sepolia.etherscan.io/tx/${mintTxHash}`} target="_blank" rel="noopener noreferrer">(View on Etherscan)</a></h2>
                      <h2 className="center">To view your Nft on MetaMask click &apos;Import NFT&apos;, enter the contract address &apos;0x2FdD4893B95b9320c84658b7668496D0DE871cce&apos; and the token ID you want to view</h2>
                    </>
                  ) : (
                    <>
                      <h1>Congratulations!!!</h1>
                      <h1>You have made a swap on Uniswap in the last 24h so you can mint a reward NFT</h1>
                      <br></br>
                      <div>
                        <button onClick={nftMintHandler} className="mintReward">GET REWARD</button>
                      </div>
                      <br></br>
                    </>
                  )}
                </>
              ) : (
                /* UNISWAP TX FALSE */
                <>
                  <h1 className="not-connected">It looks like you haven&apos;t made a swap on Uniswap in the last 24h</h1>
                  <br></br>
                  <h1 className="not-connected">If you want to mint a reward NFT go and make a swap <a href="https://app.uniswap.org/swap" target="_blank" rel="noopener noreferrer"> (here) </a></h1>
                  <hr></hr>
                  <div>
                    <button onClick={checkUniswapTx24h} className="checkUniswap">CHECK</button>
                  </div>
                </>
              )}
            </>
          ) : (
            /* FIRST CHECK FALSE */
            <>
              <h1>Check if you have made a swap on Uniswap in the last 24h and you can mint a reward Nft</h1>
              <hr></hr>
              <div>
                <button onClick={checkUniswapTx24h} className="checkUniswap">CHECK</button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* WALLET NOT CONNECTED */}
          <h1 className="not-connected">Connect Metamask on Sepolia testnet to use the application</h1>
        </>
      )}
    </div>
    </>
  )
}

export default Page;
