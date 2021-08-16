import React from 'react'
import { atom, useSetRecoilState, useRecoilValue } from 'recoil'
import { Box } from '@material-ui/core'

import Single from './single'

export const partsAtom = atom({
  key: 'parts',
  default: [],
})

export const selectedPartAtom = atom({
  key: 'selectedPart',
  default: null,
})

// FIXME: on fresh load when adding a new Single in the story, get passing isSelected prop as DOM attrib error
const Canvas = () => {
  const parts = useRecoilValue(partsAtom)
  const setSelectedPart = useSetRecoilState(selectedPartAtom)

  return (
    <Box border="1px solid lightgrey" onClick={() => setSelectedPart(null)}>
      {parts.map((id) => (
        <Single key={id} id={id} />
      ))}
    </Box>
  )
}

export default Canvas
