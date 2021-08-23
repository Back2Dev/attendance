import React from 'react'
import { useRecoilValue } from 'recoil'
import { selectedPartState } from '../canvas'
import { inspectorState } from './inspector'

const DebugProps = () => {
  const single = useRecoilValue(inspectorState)
  const selectedPart = useRecoilValue(selectedPartState)
  return (
    <div>
      Inspect part: {selectedPart}
      <pre>{JSON.stringify(single, null, 2)}</pre>
    </div>
  )
}

export default DebugProps
