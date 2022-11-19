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
    <div>
      <div className="absolute top-16 right-3">
        {account && etherBalance ? (
          <div className="dropdown dropdown-end">
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
                <a> <UserIcon className="mr-3 h-5 w-5"/> {truncateEthAddress(account)}</a>           
              </li>
              <li>
                <a> <WalletIcon className="mr-3 h-5 w-5"/> {formatEther(etherBalance.sub(etherBalance.mod(1e14)))}</a>
              </li>
              <li>
                <a onClick={() => deactivate()}> <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5"/> Disconnect</a>
              </li>
            </ul>
          </div>
        ) : (
          <button
            className="btn-primary rounded-md p-2"
            onClick={() => activateBrowserWallet()}
          >
            Connect
          </button>
        )}
      </div>
    </div>
  )
}
