import React from 'react'
import { atomFamily, useRecoilState } from 'recoil'
import PropTypes from 'prop-types'

import { selectedPartState } from '../canvas'
import SingleInner from './inner'
import Frame from '../frame'
import { useListControls } from '../hooks'

export const singleState = atomFamily({
  key: 'single',
  default: {
    question: '',
    choices: [],
    tid: null,
    vals: [],
  },
})

const Single = ({ id }) => {
  const [selectedPart, setSelectedPart] = useRecoilState(selectedPartState)
  const { removeById, moveById } = useListControls('parts')
  const [single, setSingle] = useRecoilState(singleState(id))

  return (
    <Frame
      selected={selectedPart === id}
      onSelect={(isSelected) => setSelectedPart(isSelected ? id : null)}
      onRemove={() => {
        removeById(id)
        setSelectedPart(null)
      }}
      onMove={(dir) => moveById(id, dir)}
    >
      <SingleInner
        id={id}
        onChange={(newValue) => {
          setSingle({ ...single, ...newValue })
        }}
      />
    </Frame>
  )
}

Single.propTypes = {
  /** id for this Single instance */
  id: PropTypes.number.isRequired,
}

export default Single
