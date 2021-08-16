import React from 'react'
import { useRecoilState } from 'recoil'
import PropTypes from 'prop-types'

import { selectedPartAtom } from '../canvas'
import SingleInner from './inner'
import Frame from '../frame'

const Single = ({ id }) => {
  const [selectedPart, setSelectedPart] = useRecoilState(selectedPartAtom)

  return (
    <Frame
      selected={selectedPart === id}
      onSelect={(isSelected) => setSelectedPart(isSelected ? id : null)}
    >
      <SingleInner />
    </Frame>
  )
}

Single.propTypes = {
  /** id for this Single instance */
  id: PropTypes.number.isRequired,
}

export default Single
