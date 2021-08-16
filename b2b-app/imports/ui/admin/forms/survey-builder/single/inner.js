import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Item from './item'
import Question from '../question'
import { useListControls, useDidMountEffect } from '../hooks'

/** Single Choice question */
// FIXME: disallow removing choice if there's only 1
// FIXME: tab after inline-edit and it doesn't focus on controls until you tab 2 more times
// FIXME on first render, onChange gets called with empty data
const SingleInner = ({ onChange, initialLabel, initialList }) => {
  const choices = useListControls(initialList)
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
