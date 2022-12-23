import { useEffect, useRef } from 'react'
import panzoom from 'panzoom'

export default function Rectangle(props) {
  const svgContainer = useRef(null)
  const {data}=props;
  const length = data.length + 'px'
  const width = data.width + 'px'

  useEffect(() => {
    panzoom(svgContainer.current)
  })

  return (
    <div className="flex h-3/4 bg-neutral m-10">
      <svg className="flex-grow">
        <g ref={svgContainer} className="fill-primary">
          <rect width={width} height={length} />
        </g>
      </svg>
    </div>
  )
}
