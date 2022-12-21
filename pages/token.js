import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Rectangle from '../components/Rectangle'
import RectangleStatistics from '../components/RectangleStatistics'
import { ethers } from 'ethers'
import { config, supportedChains } from '../config.js'
import { useEthers, Goerli, DEFAULT_SUPPORTED_CHAINS } from '@usedapp/core'
import { useEffect, useState } from 'react'
import {
  RECTANGLE_TOKEN_ADDRESS_GOERLI,
  MASTER_TOKEN_ACCOUNT,
} from '../contracts'
import RectangleTokenABI from '../artifacts/contracts/Token/RectangleToken.sol/RectangleToken.json'
import TokenIssuer from '../components/TokenIssuer'

export default function Token(props) {
  const { chainId, account } = useEthers()

  return (
    <div className={styles.container}>
      <Head>
        <title>Rectangle Tokens</title>
      </Head>

      {!(chainId == `${Goerli.chainId}`) ? (
        <main className="relative top-14 h-screen w-screen overflow-y-hidden">
          <div className="absolute top-1/2 w-full text-center">
            <p>
              The current network is not supported. Please switch metamask to
              Goerli network!
            </p>
          </div>
        </main>
      ) : (
        <main className="relative top-16 w-screen h-screen overflow-y-hidden">
          <TokenIssuer />
          <div className="mt-8 flex flex-col space-y-6">
            <div className="mt-8 flex justify-center">
              <div className="alert alert-warning w-fit shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Each account can have a maximum of 100,000 tokens</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
              <div className="alert alert-info w-fit shadow-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current flex-shrink-0 h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>
                    Delegation is done on each transfer for simplicity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  )
}
