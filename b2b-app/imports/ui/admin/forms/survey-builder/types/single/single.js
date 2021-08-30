import React from 'react'
import { atomFamily, selectorFamily, useRecoilState } from 'recoil'
import PropTypes from 'prop-types'

import { partsState, selectedPartState } from '../../canvas'
import SingleInner from './inner'
import Frame from '../../frame'
import { useListControls } from '../../hooks'
import { makeNewItem } from '../../hooks/list-controls'

export const defaultAnswer = { name: '', val: '' }

export const singleState = atomFamily({
  key: 'single',
  default: () => ({
    prompt: '',
    id: '',
    type: 'single',
    answers: [makeNewItem(defaultAnswer)],
  }),
})

// transforms single state to source
export const singleSourceState = selectorFamily({
  key: 'singleSource',
  get: (pid) => ({ get }) => {
    const { prompt, id, answers } = get(singleState(pid))
    const source = [
      `Q: ${prompt}`,
      `+id: ${id}`,
      '+type: single',
      answers.map(({ name, val }) => [`A: ${name}`, val && `+val: ${val}`]),
    ]
      .flat(2)
      .filter(Boolean)
      .join('\n')

    return source
  },
})

const Single = ({ pid }) => {
  const [selectedPart, setSelectedPart] = useRecoilState(selectedPartState)
  const { removeById, moveById } = useListControls(partsState)

  return (
    <Frame
      selected={selectedPart === pid}
      onSelect={(isSelected) => setSelectedPart(isSelected ? pid : null)}
      onRemove={() => {
        removeById(pid)
        setSelectedPart(null)
      }}
      onMove={(dir) => moveById(pid, dir)}
    >
      <SingleInner pid={pid} />
    </Frame>
  )
}

Single.propTypes = {
  /** id for this Single instance part */
  pid: PropTypes.string.isRequired,
}

export default Single
