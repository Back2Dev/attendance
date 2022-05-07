import React from 'react'
import { useSelectedPartData, useSelectedPartValue } from '$sb/recoil/hooks'

const DebugProps = () => {
  const part = useSelectedPartData()
  const selectedPart = useSelectedPartValue()
  return (
    <div style={{ overflowX: 'scroll' }}>
      Inspect part: {selectedPart}
      <pre>{JSON.stringify(part, null, 2)}</pre>
    </div>
  )
}

export { DebugProps }
