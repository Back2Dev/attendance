import React, { useEffect, useState, useContext } from 'react'
import { Box, Card, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import debug from 'debug'
import { EditorContext } from '/imports/ui/forms/framework/framework'
import Section from '../../question/section'
import { DragDropContext } from 'react-beautiful-dnd'
import { Random } from 'meteor/random'
import SimpleSchema from 'simpl-schema'
import ClearIcon from '@material-ui/icons/Clear'

const log = debug('builder:canvas')

const defaultQuestion = {
  // id: '',
  // _id: '',
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
  // id: '',
  // _id:'',
  questions: [],
  name: 'New Section',
}

const sectionSchema = new SimpleSchema(
  {
    id: { type: String, defaultValue: '' },
    _id: {
      type: String,
      autoValue: function () {
        if (!this.isSet) {
          return Random.id()
        }
      },
    },
    name: String,
    questions: Array,
    value: String,

    'questions.$': Object,

    'questions.$.id': String,
    'questions.$._id': {
      type: String,
      autoValue: function () {
        if (!this.isSet) {
          return Random.id()
        }
      },
    },
    'questions.$.value': String,
    'questions.$.prompt': String,
    'questions.$.name': String,
    'questions.$.type': String,
    'questions.$.optional': Boolean,
    'questions.$.header': String,
    'questions.$.conditional': String,
    'questions.$.pipe': String,
    'questions.$.tooltip': String,

    'questions.$.answers': { type: Array, defaultValue: [defaultQuestion.answers] },
    'questions.$.answers.$': Object,
    'questions.$.answers.$.id': { type: String, defaultValue: '' },
    'questions.$.answers.$._id': {
      type: String,
      autoValue: function () {
        if (!this.isSet) {
          return Random.id()
        }
      },
    },
    'questions.$.answers.$.value': String,
    'questions.$.answers.$.name': String,
    'questions.$.answers.$.type': String,
    'questions.$.answers.$.optional': Boolean,
    'questions.$.answers.$.max': String,
    'questions.$.answers.$.maxSize': SimpleSchema.Integer,
    'questions.$.answers.$.accept': { type: Object, blackbox: true },
    'questions.$.answers.$.score': { type: SimpleSchema.Integer, defaultValue: 1 },
    'questions.$.answers.$.max': String,
    'questions.$.answers.$.skip': String,
    'questions.$.answers.$.note': String,
    'questions.$.answers.$.placeholder': String,
    'questions.$.answers.$.regEx': String,
    'questions.$.answers.$.errorMessage': String,
    'questions.$.answers.$.populate': String,
    'questions.$.answers.$.specify': String,

    'questions.$.rows': { type: Array, defaultValue: defaultQuestion.rows },
    'questions.$.rows.$': Object,
    'questions.$.rows.$.id': String,
    'questions.$.rows.$._id': {
      type: String,
      autoValue: function () {
        if (!this.isSet) {
          return Random.id()
        }
      },
    },
    'questions.$.rows.$.value': String,
    'questions.$.rows.$.name': String,

    'questions.$.columns': { type: Array, defaultValue: defaultQuestion.columns },
    'questions.$.columns.$': Object,
    'questions.$.columns.$.id': String,
    'questions.$.columns.$._id': {
      type: String,
      autoValue: function () {
        if (!this.isSet) {
          return Random.id()
        }
      },
    },
    'questions.$.columns.$.field': String,
    'questions.$.columns.$.value': String,
  },
  {
    clean: {
      trimStrings: false,
    },
  }
)

const Canvas = () => {
  const { editors } = useContext(EditorContext)

  const sections = (JSON.parse(editors[1].editorValue || '{}').sections || []).map(
    (section) => sectionSchema.clean(section)
  )
  const updateEditor = editors[1].updateEditor
  const [dndMove, setDndMove] = useState(null)

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

  const onSectionChange = ({ section }) => {
    updateEditor((prev) => {
      const next = JSON.parse(prev)

      sections.forEach((sec) => {
        if (sec._id === section._id) {
          sec = section
        }
      })
      next.sections = sections
      return JSON.stringify(next, null, 2)
    })
  }

  const onQuestionChange = ({ question }) => {
    updateEditor((prev) => {
      const next = JSON.parse(prev)
      sections.forEach((sec) => {
        sec.questions.forEach((que) => {
          if (que._id === question._id) {
            que = question
          }
        })
      })
      next.sections = sections

      return JSON.stringify(next, null, 2)
    })
  }

  const onAddSection = ({ sIndex }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev || '{"sections":[]}')
      const _id = Random.id()

      newSection.sections.splice(sIndex + 1, 0, {
        ...defaultSection,
        id: _id,
        _id,
      })
      return JSON.stringify(newSection, null, 2)
    })
  }

  const onAddQuestion = ({ sIndex, qIndex, question }) => {
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)
      const _id = Random.id()
      const newQuestion = {
        ...(question ?? defaultQuestion),
        id: _id,
        _id,
      }
      newSection.sections[sIndex].questions.splice(qIndex + 1, 0, newQuestion)

      return JSON.stringify(newSection, null, 2)
    })
  }

  const onAddAnswer = ({ sIndex, qIndex, aIndex, defaultAnswer }) => {
    const _id = Random.id()
    updateEditor((prev) => {
      const newSection = JSON.parse(prev)
      newSection.sections[sIndex].questions[qIndex].answers.splice(aIndex + 1, 0, {
        ...defaultAnswer,
        id: _id,
        _id,
      })

      return JSON.stringify(newSection, null, 2)
    })
    //focusing on the answer after it is added
    console.log('_id', _id)
    setTimeout(() => document.querySelector(`#${_id}`).focus(), 0)
  }

  const onAddGrid = ({ sIndex, qIndex, aIndex, defaultGrid, type = 'rows' }) => {
    updateEditor((prev) => {
      let newSection = JSON.parse(prev)
      const _id = Random.id()
      if (!newSection.sections[sIndex].questions[qIndex][type]) {
        newSection.sections[sIndex] = sectionSchema.clean(newSection.sections[sIndex])
      }
      newSection.sections[sIndex].questions[qIndex][type].splice(aIndex + 1, 0, {
        ...defaultGrid,
        id: _id,
        _id,
      })

      return JSON.stringify(newSection, null, 2)
    })
  }

  const onRemoveSection = ({ _id }) => {
    updateEditor((prev) => {
      const next = JSON.parse(prev)

      next.sections = sections.filter((sec) => {
        if (sec._id === _id) {
          return false
        }
        return true
      })

      return JSON.stringify(next, null, 2)
    })
  }

  const onRemoveQuestion = ({ _id }) => {
    updateEditor((prev) => {
      const next = JSON.parse(prev)

      next.sections = sections.map((sec) => {
        sec.questions = sec.questions.filter((que) => {
          if (que._id === _id) {
            return false
          }
          return true
        })

        return sec
      })
      return JSON.stringify(next, null, 2)
    })
  }

  //type: answers / rows /columns
  const onRemoveAnswer = ({ _id, type = 'answers' }) => {
    updateEditor((prev) => {
      const next = JSON.parse(prev)

      next.sections = sections.map((sec) => {
        sec.questions = sec.questions.map((que) => {
          que[type] = que[type].filter((ans) => {
            if (ans._id === _id) {
              return false
            }
            return true
          })
          return que
        })
        return sec
      })
      return JSON.stringify(next, null, 2)
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
        if (sec._id === destination.droppableId) {
          sec.questions = reorder(sec.questions, source.index, destination.index)
        }
      })

      updateEditor((prev) => {
        const next = JSON.parse(prev)
        next.sections = sections
        return JSON.stringify(next, null, 2)
      })
    }
    //dnd answers
    else if (result.type.startsWith('question')) {
      sections.forEach((sec) => {
        sec.questions.forEach((que) => {
          if (que._id === destination.droppableId) {
            que.answers = reorder(que.answers, source.index, destination.index)
          }
        })
      })

      updateEditor((prev) => {
        const next = JSON.parse(prev)
        next.sections = sections
        return JSON.stringify(next, null, 2)
      })
    }
    //dnd grid
    else if (result.type.startsWith('grid')) {
      const gridType = result.type.includes('row') ? 'rows' : 'columns'
      sections.forEach((sec) => {
        sec.questions.forEach((que) => {
          if (`grid-${gridType}-${que._id}` === destination.droppableId) {
            que[gridType] = reorder(que[gridType], source.index, destination.index)
          }
        })
      })

      updateEditor((prev) => {
        const next = JSON.parse(prev)
        next.sections = sections
        return JSON.stringify(next, null, 2)
      })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} sensors={[DndSensor]}>
      {!Boolean(sections.length) && <AddBtn onAdd={() => onAddSection({ sIndex: 0 })} />}
      {sections.map((section, sIndex) => {
        console.log(section)
        return (
          <Box style={{ marginTop: '1rem' }} key={section._id}>
            <Card>
              <Section
                section={section}
                sIndex={sIndex}
                onSectionChange={onSectionChange}
                onQuestionChange={onQuestionChange}
                onRemoveSection={onRemoveSection}
                onRemoveQuestion={onRemoveQuestion}
                onRemoveAnswer={onRemoveAnswer}
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

export const RemoveAnsBtn = React.memo(({ onRemoveAnswer }) => {
  return (
    <IconButton variant="outlined" color="default" onClick={onRemoveAnswer}>
      <ClearIcon />
    </IconButton>
  )
})
