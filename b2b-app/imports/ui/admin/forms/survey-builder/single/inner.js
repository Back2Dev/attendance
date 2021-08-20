import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { atomFamily } from 'recoil'

import Item from './item'
import Question from '../question'
import { useListControls, useDidMountEffect } from '../hooks'

/** Single Choice question */
const SingleInner = ({ id, onChange, initialLabel, initialList }) => {
  const { values: answers, all, move, remove, update, add } = useListControls(
    `singleItems.${id}`,
    initialList
  )
  const [question, setQuestion] = useState('')

  useDidMountEffect(() => {
    onChange?.({ question, answers })
  }, [question, answers])

  return (
    <div>
      <Question
        placeholder="Type your question"
        label={initialLabel}
        onLabelChange={(text) => setQuestion(text)}
      />
      <ol>
        {all.map((c, i) => (
          <Item
            key={c.id}
            onMove={(direction) => move(i, direction)}
            onRemove={() => remove(i)}
            onAdd={() => add('', i)}
            disableMove={(direction) => i === (direction === 'up' ? 0 : all.length - 1)}
            disableRemove={all.length === 1}
            onTextChange={(value) => update(value, i)}
            text={c.value}
          />
        ))}
      </ol>
    </div>
  )
}

SingleInner.propTypes = {
  id: PropTypes.number,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
  /** default question label */
  initialLabel: PropTypes.string,
  /** sets the initial list. Defaults to `[{ id, value: '' }]` whose `id` is an auto incrementing unique int*/
  initialList: PropTypes.array,
}

SingleInner.defaultProps = {
  initialList: [''],
}

export default SingleInner
