import React from 'react'
import { atomFamily, useRecoilState } from 'recoil'
import PropTypes from 'prop-types'

import { partsState, selectedPartState } from '../canvas'
import SingleInner from './inner'
import Frame from '../frame'
import { useListControls } from '../hooks'
import { makeNewItem } from '../hooks/list-controls'

export const defaultAnswer = { label: '', '+val': '' }

export const singleState = atomFamily({
  key: 'single',
  default: {
    question: { label: '', '+type': 'single', '+id': '' },
    answers: [makeNewItem(defaultAnswer)],
  },
})

const Single = ({ id }) => {
  const [selectedPart, setSelectedPart] = useRecoilState(selectedPartState)
  const { removeById, moveById } = useListControls(partsState)

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
      <SingleInner id={id} />
    </Frame>
  )
}

Single.propTypes = {
  /** id for this Single instance */
  id: PropTypes.number.isRequired,
}

export default Single
