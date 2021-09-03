import React from 'react'
import { useSelectedPartData, useSelectedPartValue } from '../recoil/hooks'

const DebugProps = () => {
  const part = useSelectedPartData()
  const selectedPart = useSelectedPartValue()
  return (
    <div>
      Inspect part: {selectedPart}
      <pre>{JSON.stringify(part, null, 2)}</pre>
    </div>
  )
}

export default DebugProps
