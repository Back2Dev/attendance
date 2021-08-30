import React from 'react'
import PropTypes from 'prop-types'
import { selectorFamily, useSetRecoilState } from 'recoil'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTheme } from '@material-ui/core/styles'

import Item from './item'
import Question from '../../question'
import { useListControls } from '../../hooks'
import { defaultAnswer, singleState } from './single'
import produce from 'immer'

export const singleAnswersState = selectorFamily({
  key: 'singleAnswers',
  get: (pid) => ({ get }) => {
    const single = get(singleState(pid))
    return single.answers
  },
  set: (pid) => ({ get, set }, newValue) => {
    const single = get(singleState(pid))

    const nextState = produce(single, (draft) => {
      draft.answers = newValue
    })
    set(singleState(pid), nextState)
  },
})

const singleQuestionState = selectorFamily({
  key: 'singleQuestion',
  set: (pid) => ({ set, get }, newValue) => {
    const single = get(singleState(pid))
    const nextState = produce(single, (draft) => {
      draft.prompt = newValue
    })
    set(singleState(pid), nextState)
  },
})

/** Single Choice question */
const SingleInner = ({ pid, initialLabel, initialList }) => {
  const { all, remove, update, add } = useListControls(
    singleAnswersState(pid),
    initialList
  )
  const setQuestion = useSetRecoilState(singleQuestionState(pid))
  const theme = useTheme()

  const getStyle = (style, snapshot) => {
    if (!snapshot.isDragging) return style
    return {
      ...style,
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }

  return (
    <div>
      <Question
        placeholder="Type your question"
        label={initialLabel}
        onLabelChange={(text) => setQuestion(text)}
      />
      <Droppable droppableId={`single_item-${pid}`}>
        {(provided) => (
          <ol ref={provided.innerRef} {...provided.droppableProps}>
            {all.map((c, i) => (
              <Draggable
                draggableId={`single_item-${pid}-${c._id}`}
                index={i}
                key={c._id}
              >
                {(provided, snapshot) => (
                  <Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                    ref={provided.innerRef}
                    onRemove={() => remove(i)}
                    onAdd={() => add(defaultAnswer, i)}
                    disableRemove={all.length === 1}
                    onTextChange={(name) => update({ ...c, name }, i)}
                    text={c.name}
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
  /** single instance part id */
  pid: PropTypes.string.isRequired,
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
