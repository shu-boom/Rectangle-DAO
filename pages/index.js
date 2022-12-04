import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Rectangle from '../components/Rectangle'
import RectangleStatistics from '../components/RectangleStatistics'
import { ethers } from 'ethers'
import { config, supportedChains } from '../config.js';
import { useEthers, Goerli, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { RECTANGLE_ADDRESS_GOERLI } from '../contracts';
import RectangleABI from '../artifacts/contracts/Rectangle.sol/Rectangle.json';

export default function Home(props) {
  const { chainId } = useEthers()
  console.log('CHAIN ID', chainId)
  console.log('props', props)

  return (
        <div className={styles.container}>
          <Head>
            <title>Rectangle DAO</title>
          </Head>

          {
          !(chainId == `${Goerli.chainId}`)
          ?
            <main className='relative top-10 h-screen w-screen overflow-y-hidden'>
                <div className='absolute top-1/2 w-full text-center'>
                    <p>The current network is not supported. Please switch metamask to Goerli network!</p>
                </div>
            </main>
          :
            <main className='flex flex-row relative top-10 h-screen overflow-y-hidden'>
                <div className="basis-2/3">
                  <Rectangle data={props.dimensions}/>
                </div>
                <div className="basis-1/3">
                  <RectangleStatistics data={props.dimensions}/>
                </div>
            </main>
          }
        </div>
  )
}

export async function getServerSideProps() {
  let provider
  if (process.env.ENVIRONMENT === 'local') {
    provider = new ethers.providers.JsonRpcProvider()
  } else if (process.env.ENVIRONMENT === 'testnet') {
    provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_GOERLI_URL)
  }
  // get the contract 
  const rectangle = new ethers.Contract(RECTANGLE_ADDRESS_GOERLI, RectangleABI.abi, provider)
  const length = await rectangle.length();
  const width = await rectangle.width();
  const area = await rectangle.getArea();

  const data = {length: length.toString(), width: width.toString(), area: area.toString()} // execute the method 
  return {
    props: {
      dimensions: JSON.parse(JSON.stringify(data))
    }
  }
}