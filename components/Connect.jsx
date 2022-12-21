import { useEthers, useEtherBalance } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import Image from 'next/image'
import truncateEthAddress from 'truncate-eth-address'
import { WalletIcon, UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/20/solid'

export default function Connect() {
  const { activateBrowserWallet, deactivate, account } = useEthers()
  const etherBalance = useEtherBalance(account)
  return (
      <div className="top-2 right-4 mb-4 fixed z-10">
        {account && etherBalance ? (
          <div className="dropdown dropdown-end cursor-pointer">
            <label tabIndex={0}>
              <UserIcon
                className="mr-3 h-10 w-10 fill-accent"
                aria-hidden="true"
              />
            </label>
            <ul
              tabIndex={0}
              className="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4"
            >
              <li>
                <a> <UserIcon className="mr-3 h-5 w-5 cursor-pointer"/> {truncateEthAddress(account)}</a>           
              </li>
              <li>
                <a> <WalletIcon className="mr-3 h-5 w-5 cursor-pointer"/> {formatEther(etherBalance.sub(etherBalance.mod(1e14)))}</a>
              </li>
              <li>
                <a onClick={() => deactivate()}> <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 cursor-pointer"/> Disconnect</a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn-primary rounded-md p-2 right-4 fixed"
            onClick={() => activateBrowserWallet()}
          >
            Connect
          </button>
        )}
      </div>
  )
}
