import React from 'react'
import { atomFamily, useRecoilState } from 'recoil'
import PropTypes from 'prop-types'

import { selectedPartState } from '../canvas'
import SingleInner from './inner'
import Frame from '../frame'
import { useListControls } from '../hooks'
import produce from 'immer'
import { set } from 'lodash'

export const singleState = atomFamily({
  key: 'single',
  default: {
    question: { label: '', '+type': 'single', '+id': '' },
    answers: [{ label: '', '+val': '' }],
  },
})

/**
 * TODO: given a shape state like above it auto renders something like:
<Section title="question">
  <TextField label="+id" value='' onChange={} />
</Section>

<Section title="answers">
  <ListField>
    <ListItem>{answers[0].text}</ListItem>
    <ListField>
      <ListItem>
        <TextField label='+val' value='' onChange={} />
      </ListItem>
    </ListField>
  </ListField>
</Section>
*/

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
          const nextState = produce(single, (draft) => {
            draft.question.label = newValue.question
            newValue.answers.forEach((label, i) => {
              set(draft, `answers[${i}].label`, label)
            })
          })
          setSingle(nextState)
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
