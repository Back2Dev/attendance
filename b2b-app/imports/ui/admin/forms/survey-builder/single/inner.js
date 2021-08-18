import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { atomFamily } from 'recoil'

import Item from './item'
import Question from '../question'
import { useListControls, useDidMountEffect } from '../hooks'

/** Single Choice question */
const SingleInner = ({ id, onChange, initialLabel, initialList }) => {
  const choices = useListControls(`singleItems.${id}`, initialList)
  const [question, setQuestion] = useState('')

  useDidMountEffect(() => {
    onChange?.({ question, choices: choices.values })
  }, [question, choices.values])

  return (
    <div>
      <Question
        placeholder="Type your question"
        label={initialLabel}
        onLabelChange={(text) => setQuestion(text)}
      />
      <ol>
        {choices.all.map((c, i) => (
          <Item
            key={c.id}
            onMove={(direction) => choices.move(i, direction)}
            onRemove={() => choices.remove(i)}
            onAdd={() => choices.add('', i)}
            disableMove={(direction) =>
              i === (direction === 'up' ? 0 : choices.all.length - 1)
            }
            disableRemove={choices.all.length === 1}
            onTextChange={(value) => choices.update(value, i)}
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
