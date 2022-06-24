import React, { useState } from 'react'

import Question from '../../../question'

import debug from 'debug'

import { Frame } from '$sb/components/frame'

import { singleAtom, singleSource, singleSource } from '$sb/recoil/atoms'
import TypeRegistry from '$sb/components/types/type-registry'
import { useQuestion } from '$sb/recoil/hooks'

export const mapDataToAtom = (data) => {
  const state = {
    id: data.id,
    prompt: data.title,
    answers: data.answers.map(({ id, title, val }) => ({ id, name: title, val })),
  }
  schema.validate(state)
  if (!schema.isValid()) {
    log('expected', schema._schema)
    log('got', data)
    // throw new Error('Invalid mapping from data to single state')
  }

  return state
}
const Email = React.forwardRef(({ pid, ...otherprops }, ref) => {
  const [index, changeIndex] = useState(0)
  const [question, setQuestion] = useQuestion(pid)
  return (
    <Frame pid={pid} {...otherprops} ref={ref}>
      <Question
        placeholder="Email"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />
    </Frame>
  )
})

export default ShortText

TypeRegistry.register('email', Email, singleSource, mapDataToAtom, singleAtom)
