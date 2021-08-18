import { Box } from '@material-ui/core'
import React from 'react'
import { selector, useRecoilValue } from 'recoil'
import { selectedPartState } from '../canvas'
import { singleState } from '../single/single'

const inspectorState = selector({
  key: 'inspector',
  get: ({ get }) => {
    const selectedPart = get(selectedPartState)
    if (selectedPart === null) return null
    const single = get(singleState(selectedPart))
    return single
  },
})

const Inspector = () => {
  const single = useRecoilValue(inspectorState)
  const selectedPart = useRecoilValue(selectedPartState)
  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      width="20%"
      border="1px solid lightgrey"
    >
      Inspect part: {selectedPart}
      <pre>{JSON.stringify(single, null, 2)}</pre>
    </Box>
  )
}

export default Inspector
