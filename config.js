
import { Mainnet, Goerli } from '@usedapp/core'
import { getDefaultProvider } from 'ethers'

export const config = {
    readOnlyChainId: Mainnet.chainId,
    readOnlyUrls: {
      [Mainnet.chainId]: getDefaultProvider('mainnet'),
      [Goerli.chainId]: getDefaultProvider('goerli',{
        alchemy: process.env.ALCHEMY_API_KEY_GOERLI,
      }),
    },
}