import React from 'react'
import PropTypes from 'prop-types'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useTheme } from '@material-ui/core/styles'

import Item from './item'
import Question from '../../question'
import { useAnswers, useQuestion } from '../../recoil/hooks'

/** Single Choice question */
const SingleInner = ({ pid }) => {
  const { all, add, update, remove } = useAnswers(pid)
  const [question, setQuestion] = useQuestion(pid)
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
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />
      <Droppable droppableId={`single_item-${pid}`}>
        {(provided) => (
          <ol ref={provided.innerRef} {...provided.droppableProps}>
            {all.map((c, i) => (
              <Draggable
                draggableId={`single_item-${pid}-${c.id || c._id}`}
                index={i}
                key={c.id || c._id}
              >
                {(provided, snapshot) => (
                  <Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                    ref={provided.innerRef}
                    onRemove={() => remove(i)}
                    onAdd={() => add(i)}
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
}

SingleInner.defaultProps = {
  initialList: [''],
}

export default SingleInner
