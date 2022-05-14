import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextFields from './short-text/textbox'
import Buttons from './icon-buttons/actionButtons'
import InlineEdit from '../../inline-edit'
import Question from '../../question'

import debug from 'debug'

import Frame from '../../frame'
import SimpleSchema from 'simpl-schema'
import { singleAtom, singleSource, singleSource } from '../../recoil/atoms'
import TypeRegistry from '../type-registry'
import { useQuestion } from '../../recoil/hooks'

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
