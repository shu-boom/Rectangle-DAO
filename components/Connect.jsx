import { useEthers, useEtherBalance } from '@usedapp/core'
import { formatEther } from '@ethersproject/units'
import { BigNumber } from 'ethers'
import Image from 'next/image'
import profile from '../public/icons/profile.svg'
import wallet from '../public/icons/wallet.svg'
import truncateEthAddress from 'truncate-eth-address'
import { UserIcon } from '@heroicons/react/20/solid'

export default function Connect() {
  const { activateBrowserWallet, deactivate, account } = useEthers()
  const etherBalance = useEtherBalance(account)

  return (
    <div>
      <div className="absolute top-16 right-3">
        {!account ? (
          <button
            className="btn-primary rounded-md p-2"
            onClick={() => activateBrowserWallet()}
          >
            Connect
          </button>
        ) : (
          <div>
            <UserIcon className="mr-3 h-10 w-10 fill-accent" aria-hidden="true" />
          </div>
        )}
      </div>
    </div>
  )
}
