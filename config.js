
import { Mainnet, Goerli, Localhost} from '@usedapp/core'
import { getDefaultProvider } from 'ethers'

export const config = {
    networks:[Mainnet, Goerli, Localhost],
    readOnlyChainId: Goerli.chainId,
    readOnlyUrls: {
      [Mainnet.chainId]: getDefaultProvider('mainnet'),
      [Goerli.chainId]: getDefaultProvider('goerli',{
        alchemy: process.env.ALCHEMY_API_KEY_GOERLI,
      })
    }
  }

export const supportedChains = ["5"]