import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Rectangle from '../components/Rectangle'
import RectangleStatistics from '../components/RectangleStatistics'
import { ethers } from 'ethers'
import { config, supportedChains } from '../config.js';
import { useEthers, Goerli, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { RECTANGLE_TOKEN_ADDRESS_GOERLI, MASTER_TOKEN_ACCOUNT } from '../contracts';
import RectangleTokenABI from '../artifacts/contracts/Token/RectangleToken.sol/RectangleToken.json';
import TokenIssuer from '../components/TokenIssuer';

export default function Token(props) {
  const { chainId, account } = useEthers();
  // const [balance, setBalance] = useState(undefined);
  // const [totalAmountLeft, setTotalAmountLeft] = useState(undefined);
  // console.log("test", account);
  // useEffect(() => {
  //     (async () => {
  //       if(window!=undefined &&  window.ethereum != undefined && chainId == Goerli.chainId && account != undefined && (totalAmountLeft == undefined || balance == undefined)){   
  //         console.log("I am called");
  //         const rectangleToken = new ethers.Contract(RECTANGLE_TOKEN_ADDRESS_GOERLI, RectangleTokenABI.abi, new ethers.providers.Web3Provider(window.ethereum));
  //         const totalAmountLeft = await rectangleToken.balanceOf(MASTER_TOKEN_ACCOUNT);
  //         const balance = await rectangleToken.balanceOf(account); // run it, run it
  //         const formattedBalance = ethers.utils.formatEther(balance)
  //         setTotalAmountLeft(ethers.utils.formatEther(totalAmountLeft))
  //         setBalance(formattedBalance);
  //       }
  //     })();
 
  //   return () => {
  //     // setTotalAmountLeft(undefined)
  //     // setBalance(undefined);
  //     // this now gets called when the component unmounts
  //   };
  // }, [account]);

  return (
        <div className={styles.container}>
          <Head>
            <title>Rectangle Tokens</title>
          </Head>

          {
          !(chainId == `${Goerli.chainId}`)
          ?
            <main className='relative top-14 h-screen w-screen overflow-y-hidden'>
                <div className='absolute top-1/2 w-full text-center'>
                    <p>The current network is not supported. Please switch metamask to Goerli network!</p>
                </div>
            </main>
          :
            <main className='relative top-16 w-screen h-screen overflow-y-hidden'>
                <TokenIssuer/>
            </main>
          }
        </div>
  )
}

