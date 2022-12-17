import { useEffect, useRef } from 'react'
import { ethers } from 'ethers'
import { useEthers} from '@usedapp/core'

export default function RectangleStatistics(props) {
  const {data}=props;
  return (
    <div className="w-full my-8">
      <div>
        <h1 className='text-3xl'>Dimensions</h1>
        <p className='text-lg my-4'>Rectangle Width: {data.length}px</p>
        <p className='text-lg my-4'>Rectangle Height: {data.width}px</p>
      </div>
    </div>
  )
}

