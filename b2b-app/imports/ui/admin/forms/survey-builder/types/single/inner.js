import React, { useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import { selectorFamily, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import Item from './item'
import Question from '../../question'
import { useListControls } from '../../hooks'
import { defaultAnswer, singleState } from './single'
import produce from 'immer'
import { dndState } from '../../context/dnd'

export const singleAnswersState = selectorFamily({
  key: 'singleAnswers',
  get: (id) => ({ get }) => {
    const single = get(singleState(id))
    return single.answers
  },
  set: (id) => ({ get, set }, newValue) => {
    const single = get(singleState(id))

    const nextState = produce(single, (draft) => {
      draft.answers = newValue
    })
    set(singleState(id), nextState)
  },
})

const singleQuestionState = selectorFamily({
  key: 'singleQuestion',
  set: (id) => ({ set, get }, newValue) => {
    const single = get(singleState(id))
    const nextState = produce(single, (draft) => {
      draft.question.label = newValue
    })
    set(singleState(id), nextState)
  },
})

/** Single Choice question */
const SingleInner = ({ id, initialLabel, initialList }) => {
  const { all, move, remove, update, add } = useListControls(
    singleAnswersState(id),
    initialList
  )
  const setQuestion = useSetRecoilState(singleQuestionState(id))
  const [answers, setAnswers] = useRecoilState(singleAnswersState(id))
  console.log('all', all)
  return (
    <div>
      <Question
        placeholder="Type your question"
        label={initialLabel}
        onLabelChange={(text) => setQuestion(text)}
      />
      <Droppable droppableId={`${singleAnswersState(id).key}-${id}`}>
        {(provided) => (
          <ol ref={provided.innerRef} {...provided.droppableProps}>
            {all.map((c, i) => (
              <Draggable
                draggableId={`${singleAnswersState(id).key}-${id}-${c.id}`}
                index={i}
                key={c.id}
              >
                {(provided) => (
                  <Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onMove={(direction) => move(i, direction)}
                    onRemove={() => remove(i)}
                    onAdd={() => add(defaultAnswer, i)}
                    disableMove={(direction) =>
                      i === (direction === 'up' ? 0 : all.length - 1)
                    }
                    disableRemove={all.length === 1}
                    onTextChange={(label) => update({ label }, i)}
                    text={c.label}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
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
