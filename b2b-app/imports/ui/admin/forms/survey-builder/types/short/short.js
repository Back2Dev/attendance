import React, { useState } from 'react'
import PropTypes from 'prop-types'
import TextFields from './short-text/textbox'
import Buttons from './icon-buttons/actionButtons'
import InlineEdit from '../../inline-edit'
import Question from '../../question'

import debug from 'debug'

import Frame from '../../frame'
import SimpleSchema from 'simpl-schema'

import TypeRegistry from '../type-registry'

import { shortAtom, shortSource } from '../../recoil/atoms/short-state'
import { useShortQuestion } from '../../recoil/hooks/use-short'

const log = debug('builder:short')

const schema = new SimpleSchema({
  id: String,
  prompt: String,
  answer: Object,
  'answer.title': String,
  'answer.val': { type: String, optional: true },
  'answer.score': { type: Number, optional: true },
}).newContext()

export const mapDataToAtom = (data) => {
  const state = {
    id: data.id,
    prompt: data.title,
    answer: {
      title: data.answers[0].title,
      val: data.answers[0].val,
      score: data.answers[0].score,
    },
  }
  schema.validate(state)
  if (!schema.isValid()) {
    log('expected', schema._schema)
    log('got', data)
    throw new Error('Invalid mapping from data to single state')
  }

  return state
}
const ShortText = React.forwardRef(({ pid, ...otherprops }, ref) => {
  const [index, changeIndex] = useState(0)
  const [question, setQuestion] = useShortQuestion(pid)
  // console.log(schema)

  return (
    <Frame pid={pid} {...otherprops} ref={ref}>
      <Question
        placeholder="Type your new questions"
        label={question.prompt}
        onLabelChange={(text) =>
          setQuestion((questionAtom) => {
            return { ...questionAtom, prompt: text }
          })
        }
      />

      <Buttons />
    </Frame>
  )
})

export default ShortText

TypeRegistry.register('text', ShortText, shortSource, mapDataToAtom, shortAtom)
