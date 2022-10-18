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
import SimpleSchema from 'simpl-schema'
import { cloneDeep } from 'lodash'

const log = debug('builder:canvas')

const defaultQuestion = {
  id: '',
  answers: [
    {
      name: 'Type the answer here...',
      id: Random.id(),
      type: 'text',
      max: '5',
      maxSize: 100,
    },
  ],
  prompt: 'New Question',
  type: 'text',
  rows: [{ name: 'New row..', id: Random.id() }],
  columns: [{ field: 'New column..', id: Random.id(), editable: true, width: 200 }],
}

const defaultSection = {
  id: `New-Section-${Random.id()}`,
  questions: [],
  name: 'New Section',
}

const sectionSchema = new SimpleSchema(
  {
    id: String,
    name: String,
    questions: Array,

    'questions.$': Object,

    'questions.$.id': String,
    'questions.$.value': String,
    'questions.$.prompt': String,
    'questions.$.name': String,
    'questions.$.type': String,

    'questions.$.answers': { type: Array, defaultValue: [defaultQuestion.answers] },
    'questions.$.answers.$': Object,
    'questions.$.answers.$.id': String,
    'questions.$.answers.$.value': String,
    'questions.$.answers.$.name': String,
    'questions.$.answers.$.type': String,
    'questions.$.answers.$.max': String,
    'questions.$.answers.$.maxSize': SimpleSchema.Integer,
    'questions.$.answers.$.accept': { type: Object, blackbox: true },

    'questions.$.rows': { type: Array, defaultValue: defaultQuestion.rows },
    'questions.$.rows.$': Object,
    'questions.$.rows.$.id': String,
    'questions.$.rows.$.value': String,
    'questions.$.rows.$.name': String,

    'questions.$.columns': { type: Array, defaultValue: defaultQuestion.columns },
    'questions.$.columns.$': Object,
    'questions.$.columns.$.id': String,
    'questions.$.columns.$.field': String,
    'questions.$.columns.$.value': String,
  },
  {
    clean: {
      trimStrings: false,
    },
  }
)

// FIXME in mobile, when drawer is open the last part is obscured when scrolling to the bottom
// TODO enable inertial scrolling
const Canvas = () => {
  const { editors } = useContext(EditorContext)
  const sections = editors[1].editorValue.sections || []
  const updateEditor = editors[1].updateEditor
  // const parts = usePartsValue()
  // const [selectedPart, setSelectedPart] = useSelectedPartState()
  // const { addPart } = useParts()
  // const { isMobile } = useBuilder()
  // const setDrawer = useSetDrawer()
  const [dndMove, setDndMove] = useState(null)

  // const canvasClicked = (e) => {
  //   // make sure to deselect only if canvas clicked. if it originated elsewhere, just ignore it
  //   if (e.target !== e.currentTarget) return
  //   if (isMobile) setDrawer(null)
  //   setSelectedPart(null)
  // }

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
      const newSection = cloneDeep(prev)
      newSection.sections[sIndex][key] = value
      return newSection
    })
  }

  const onQuestionChange = ({ sIndex, qIndex, key, value }) => {
    console.log('value', value, value.length)
    updateEditor((prev) => {
      const newSection = cloneDeep(prev)
      newSection.sections[sIndex].questions[qIndex][key] = value
      return newSection
    })
  }

  const onAnswerChange = ({ sIndex, qIndex, aIndex, key, value }) => {
    updateEditor((prev) => {
      const newSection = cloneDeep(prev)
      newSection.sections[sIndex].questions[qIndex].answers[aIndex][key] = value
      return newSection
    })
  }

  const onGridChange = ({ sIndex, qIndex, aIndex, key, value, type = 'rows' }) => {
    updateEditor((prev) => {
      let newSection = cloneDeep(prev)
      if (!newSection.sections[sIndex].questions[qIndex][type]) {
        newSection.sections[sIndex] = sectionSchema.clean(newSection.sections[sIndex])
      }
      newSection.sections[sIndex].questions[qIndex][type][aIndex][key] = value
      return newSection
    })
  }

  const onAddSection = ({ sIndex }) => {
    updateEditor((prev) => {
      const newSection = cloneDeep(prev)
      newSection.sections.splice(sIndex + 1, 0, defaultSection)
      return newSection
    })
  }

  const onAddQuestion = ({ sIndex, qIndex, question }) => {
    updateEditor((prev) => {
      const newSection = cloneDeep(prev)
      const newQuestion = {
        ...(question ?? defaultQuestion),
        id: `${newSection.sections[sIndex].id}-${Random.id()}`,
      }
      newSection.sections[sIndex].questions.splice(qIndex + 1, 0, newQuestion)

      return newSection
    })
  }

  const onAddAnswer = ({ sIndex, qIndex, aIndex, defaultAnswer }) => {
    updateEditor((prev) => {
      const newSection = cloneDeep(prev)

      newSection.sections[sIndex].questions[qIndex].answers.splice(
        aIndex + 1,
        0,
        defaultAnswer
      )

      return newSection
    })
  }

  const onAddGrid = ({ sIndex, qIndex, aIndex, defaultGrid, type = 'rows' }) => {
    updateEditor((prev) => {
      let newSection = cloneDeep(prev)
      if (!newSection.sections[sIndex].questions[qIndex][type]) {
        newSection.sections[sIndex] = sectionSchema.clean(newSection.sections[sIndex])
      }
      newSection.sections[sIndex].questions[qIndex][type].splice(
        aIndex + 1,
        0,
        defaultGrid
      )

      return newSection
    })
  }

  const onRemoveQuestion = ({ sIndex, qIndex }) => {
    updateEditor((prev) => {
      const newSection = cloneDeep(prev)

      newSection.sections[sIndex].questions.splice(qIndex, 1)

      return newSection
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
        prev.sections = sections
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
        const newSection = cloneDeep(prev)
        newSection.sections = sections
        return newSection
      })
    }
    //dnd grid
    else if (result.type.startsWith('grid')) {
      const gridType = result.type.includes('row') ? 'rows' : 'columns'
      sections.forEach((sec) => {
        sec.questions.forEach((que) => {
          if (`grid-${gridType}-${que.id}` === destination.droppableId) {
            que[gridType] = reorder(que[gridType], source.index, destination.index)
          }
        })
      })

      updateEditor((prev) => {
        const newSection = cloneDeep(prev)
        newSection.sections = sections
        return newSection
      })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} sensors={[DndSensor]}>
      {sections.map((section, sIndex) => {
        console.log('BeforecleanSection', section.questions[0].prompt.length)
        const cleanSection = sectionSchema.clean(section)
        console.log('cleanSection', cleanSection.questions[0])
        return (
          <Box style={{ marginTop: '1rem' }} key={cleanSection.id}>
            <Card>
              <Section
                section={cleanSection}
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
                onGridChange={({ qIndex, aIndex, key, value, type }) =>
                  onGridChange({ sIndex, qIndex, aIndex, key, value, type })
                }
                onRemoveQuestion={({ qIndex }) => onRemoveQuestion({ sIndex, qIndex })}
                onAddQuestion={({ qIndex, question }) =>
                  onAddQuestion({ sIndex, qIndex, question })
                }
                onAddAnswer={onAddAnswer}
                onAddGrid={onAddGrid}
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
        width: '40px',
        boxShadow: '1px 1px 3px lightgray',
        margin: '1rem auto',
      }}
      onClick={() => onAdd()}
    >
      <AddIcon />
    </IconButton>
  )
})
