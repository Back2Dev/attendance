import React, { useEffect, useState, useContext } from 'react'
import { Box, Card, IconButton, Paper, TextField } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import debug from 'debug'
import { Placeholder } from '/imports/ui/forms/survey-builder/components/old/types'
import {
  usePartsValue,
  useSelectedPartState,
  useSetDrawer,
  useParts,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { partsAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { DndDroppable, useBuilder } from '/imports/ui/forms/survey-builder/context'
import styled from 'styled-components'
import { Question } from '$sb/components/question'
import { ScrollTop } from '/imports/ui/components/scroll-to-top'
import { EditorContext } from '/imports/ui/forms/framework/framework'
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp'
import Section from '../../question/section'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Random } from 'meteor/random'

const log = debug('builder:canvas')

const defaultQuestion = {
  id: '',
  answers: [{ name: 'Type the answer here...', id: Random.id(), type: 'text' }],
  prompt: 'New Question',
  type: 'text',
}

const defaultSection = {
  id: `New-Section-${Random.id()}`,
  questions: [],
  name: 'New Section',
}

// FIXME in mobile, when drawer is open the last part is obscured when scrolling to the bottom
// TODO enable inertial scrolling
const Canvas = (props) => {
  const { editors } = useContext(EditorContext)
  const sections = JSON.parse(editors[1].editorValue).sections || []
  const updateEditor = editors[1].updateEditor
  const parts = usePartsValue()
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { addPart } = useParts()
  const { isMobile } = useBuilder()
  const setDrawer = useSetDrawer()
  const [dndMove, setDndMove] = useState(null)

  const canvasClicked = (e) => {
    // make sure to deselect only if canvas clicked. if it originated elsewhere, just ignore it
    if (e.target !== e.currentTarget) return
    if (isMobile) setDrawer(null)
    setSelectedPart(null)
  }

  const DndSensor = (api) => {
    const move = ({ dir, draggableId }) => {
      if (!draggableId) return

      const preDrag = api.tryGetLock(draggableId)
      if (!preDrag) return

      const actions = preDrag.snapLift()
      if (dir === 'up') {
        actions.moveUp()
      } else if (dir === 'down') {
        actions.moveDown()
      }
      setTimeout(actions.drop, 0) // wait for move animation to finish
    }

    useEffect(() => {
      setDndMove(() => move)
    }, [])
  }
  const onMove = (e, dir) => dndMove(e, dir)

  const onSectionChange = ({ sIndex, key, value }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)
      newSection.sections[sIndex][key] = value
      return JSON.stringify(newSection)
    })
  }

  const onQuestionChange = ({ sIndex, qIndex, key, value }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)
      newSection.sections[sIndex].questions[qIndex][key] = value
      return JSON.stringify(newSection)
    })
  }

  const onAnswerChange = ({ sIndex, qIndex, aIndex, key, value }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)
      newSection.sections[sIndex].questions[qIndex].answers[aIndex][key] = value
      return JSON.stringify(newSection)
    })
  }

  const onAddSection = ({ sIndex }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)
      newSection.sections.splice(sIndex + 1, 0, defaultSection)
      return JSON.stringify(newSection)
    })
  }

  const onAddQuestion = ({ sIndex, qIndex, copied }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)
      const newQuestion = {
        ...(copied ?? defaultQuestion),
        id: `${newSection.sections[sIndex].id}-${Random.id()}`,
      }
      newSection.sections[sIndex].questions.splice(qIndex + 1, 0, newQuestion)

      return JSON.stringify(newSection)
    })
  }

  const onRemoveQuestion = ({ sIndex, qIndex }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)

      newSection.sections[sIndex].questions.splice(qIndex, 1)

      return JSON.stringify(newSection)
    })
  }

  const reorder = (questions, startIndex, endIndex) => {
    const result = Array.from(questions)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  function onDragEnd(result) {
    const { source, destination } = result

    if (!destination) {
      return
    }

    if (source.droppableId !== destination.droppableId) {
      return
    }

    //dnd questions
    if (result.type.startsWith('section')) {
      sections.forEach((sec) => {
        if (sec.id === destination.droppableId) {
          sec.questions = reorder(sec.questions, source.index, destination.index)
        }
      })

      updateEditor((prev) => {
        prev.sections = JSON.stringify(sections)
        return prev
      })
    }
    //dnd answers
    else if (result.type.startsWith('question')) {
      sections.forEach((sec) => {
        sec.questions.forEach((que) => {
          if (que.id === destination.droppableId) {
            que.answers = reorder(que.answers, source.index, destination.index)
          }
        })
      })

      updateEditor((prev) => {
        const newSection = JSON.parse(prev)
        newSection.sections = sections
        return JSON.stringify(newSection)
      })
    }
  }

  console.log('sections', sections)
  return (
    <DragDropContext onDragEnd={onDragEnd} sensors={[DndSensor]}>
      {sections.map((section, sIndex) => {
        return (
          <Box style={{ marginTop: '1rem' }} key={section.id}>
            <Card>
              <Section
                section={section}
                sIndex={sIndex}
                onSectionChange={({ key, value }) =>
                  onSectionChange({ sIndex, key, value })
                }
                onQuestionChange={({ qIndex, key, value }) =>
                  onQuestionChange({ sIndex, qIndex, key, value })
                }
                onAnswerChange={({ qIndex, aIndex, key, value }) =>
                  onAnswerChange({ sIndex, qIndex, aIndex, key, value })
                }
                onRemoveQuestion={({ qIndex }) => onRemoveQuestion({ sIndex, qIndex })}
                onAddQuestion={({ qIndex }) => onAddQuestion({ sIndex, qIndex })}
                onMove={onMove}
              />
            </Card>
            <AddBtn onAdd={() => onAddSection({ sIndex })} />
          </Box>
        )
      })}
    </DragDropContext>
  )
}

export { Canvas }

export const AddBtn = React.memo(({ onAdd }) => {
  return (
    <IconButton
      variant="outlined"
      color="default"
      style={{
        background: 'white',
        borderRadius: '10px',
        display: 'block',
        width: '50px',
        boxShadow: '1px 1px 3px lightgray',
        margin: '1rem auto',
      }}
      onClick={() => onAdd()}
    >
      <AddIcon />
    </IconButton>
  )
})
