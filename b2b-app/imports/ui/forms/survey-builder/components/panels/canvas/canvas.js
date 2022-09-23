import React, { createElement, useState, useContext } from 'react'
import { Box, Fab, IconButton, Paper, TextField } from '@material-ui/core'
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

const log = debug('builder:canvas')

const useStyles = makeStyles(() => ({
  hideButton: {
    display: 'none',
  },
  addPartButton: {
    background: 'white',
    borderRadius: '10px',
    display: 'block',
    width: '100px',
    boxShadow: '1px 1px 3px lightgray',
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  cardBody: {
    paddingTop: '0px',
  },
  gridPadding: {
    padding: '0 1rem',
  },
}))

const AddButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}))

const List = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: theme.spacing(2),
  margin: 0,
  '& > * + *': {
    margin: theme.spacing(2, 0, 0, 0),
  },
}))

const randomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const defaultColor = [
  '#8B0000',
  '#A52A2A',
  '#FF7F50',
  '#6495ED',
  '#8B008B',
  '#8FBC8F',
  '#FF1493',
  '#1E90FF',
]

const colorList = [...defaultColor, ...Array.from({ length: 100 }, () => randomColor())]

// FIXME in mobile, when drawer is open the last part is obscured when scrolling to the bottom
// TODO enable inertial scrolling
const Canvas = (props) => {
  const classes = useStyles()
  const { editors } = useContext(EditorContext)
  const sections = JSON.parse(editors[1].editorValue).sections || []
  const parts = usePartsValue()
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { addPart } = useParts()
  const { isMobile } = useBuilder()
  const setDrawer = useSetDrawer()

  const canvasClicked = (e) => {
    // make sure to deselect only if canvas clicked. if it originated elsewhere, just ignore it
    if (e.target !== e.currentTarget) return
    if (isMobile) setDrawer(null)
    setSelectedPart(null)
  }

  console.log('sections', sections)
  return (
    <Box>
      {sections.map((section, index) => {
        return (
          <Paper
            elevation={3}
            key={section.id}
            style={{ margin: '1rem 0' }}
            // style={{ border: `2px ${colorList[index]} solid` }}
          >
            <Box style={{ padding: '1rem 2rem 0rem 2rem' }}>
              <TextField
                fullWidth
                value={section.name}
                // onChange={handleChange}
                // label="Section"
              />
            </Box>
            {section.questions.map((question) => {
              // <h4 key={question.id}>{question.prompt}</h4>
              console.log(question)
              return (
                <DndDroppable pid="canvas" listAtom={partsAtom} type="canvas">
                  {(provided) => (
                    <List
                      onClick={canvasClicked}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {/* <IconButton
                        variant="outlined"
                        color="default"
                        className={classes.addPartButton}
                        onClick={() => addPart(0)}
                      >
                        <AddIcon />
                      </IconButton> */}
                      {createElement(Question || Placeholder, {
                        index,
                        type: question.type,
                        question,
                      })}

                      {provided.placeholder}
                    </List>
                  )}
                </DndDroppable>
              )
            })}
          </Paper>
        )
      })}
    </Box>
    // <Box height="100%">
    //   <DndDroppable pid="canvas" listAtom={partsAtom} type="canvas">
    //     {(provided) => (
    //       <List
    //         onClick={canvasClicked}
    //         {...provided.droppableProps}
    //         ref={provided.innerRef}
    //       >
    //         <IconButton
    //           variant="outlined"
    //           color="default"
    //           className={classes.addPartButton}
    //           onClick={() => addPart(0)}
    //         >
    //           <AddIcon />
    //         </IconButton>

    //         {newParts.map(({ _id, pid, type, belongSection, color }, index) => {
    //           return createElement(Question || Placeholder, {
    //             key: pid,
    //             pid,
    //             index,
    //             type,
    //             setSectionState,
    //             belongSection,
    //             sectionState: sectionState[belongSection],
    //             color,
    //           })
    //         })}
    //         {provided.placeholder}
    //       </List>
    //     )}
    //   </DndDroppable>
    //   {isMobile && selectedPart === null && (
    //     <AddButton
    //       color="primary"
    //       size="medium"
    //       aria-label="add"
    //       onClick={(e) => {
    //         e.stopPropagation()
    //         setDrawer('parts')
    //       }}
    //     >
    //       <AddIcon />
    //     </AddButton>
    //   )}

    //   <ScrollTop {...props}>
    //     <Fab color="secondary" size="small" aria-label="scroll back to top">
    //       <KeyboardArrowUpIcon />
    //     </Fab>
    //   </ScrollTop>
    // </Box>
  )
}

export { Canvas }
