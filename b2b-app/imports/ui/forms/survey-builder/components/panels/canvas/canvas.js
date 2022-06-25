import React, { createElement, useState } from 'react'
import { Box, Fab, IconButton } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { makeStyles } from '@material-ui/core/styles'
import debug from 'debug'
import { Placeholder } from '/imports/ui/forms/survey-builder/components/types'
import {
  usePartsValue,
  useSelectedPartState,
  useSetDrawer,
  useParts,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { partsAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { DndDroppable, useBuilder } from '/imports/ui/forms/survey-builder/context'
import styled from 'styled-components'
import { Undefined } from '$sb/components/types/undefined/undefined'

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

// FIXME in mobile, when drawer is open the last part is obscured when scrolling to the bottom
// TODO enable inertial scrolling
const Canvas = () => {
  const classes = useStyles()
  const parts = usePartsValue()
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { addPart } = useParts()
  const { isMobile } = useBuilder()
  const setDrawer = useSetDrawer()
  const [sectionState, setSectionState] = useState(
    parts.reduce((acc, { type, _id }) => {
      if (type === 'section') {
        return { ...acc, [_id]: false }
      }
      return { ...acc }
    }, {})
  )

  const canvasClicked = (e) => {
    // make sure to deselect only if canvas clicked. if it originated elsewhere, just ignore it
    if (e.target !== e.currentTarget) return
    if (isMobile) setDrawer(null)
    setSelectedPart(null)
  }

  let sectionID
  const newParts = parts.map((item) => {
    if (item.type === 'section') {
      sectionID = item._id
      return { ...item, belongSection: sectionID }
    } else {
      return { ...item, belongSection: sectionID }
    }
  })

  return (
    <Box height="100%">
      <DndDroppable pid="canvas" listAtom={partsAtom} type="canvas">
        {(provided) => (
          <List
            onClick={canvasClicked}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}> */}
            <IconButton
              variant="outlined"
              color="default"
              className={classes.addPartButton}
              onClick={() => addPart(0)}
            >
              <AddIcon />
            </IconButton>
            {/* </div> */}

            {newParts.map(({ _id, pid, type, belongSection }, index) => {
              return createElement(Undefined || Placeholder, {
                key: pid,
                pid,
                index,
                type,
                setSectionState,
                belongSection,
                sectionState: sectionState[belongSection],
              })
            })}
            {provided.placeholder}
          </List>
        )}
      </DndDroppable>
      {isMobile && selectedPart === null && (
        <AddButton
          color="primary"
          size="medium"
          aria-label="add"
          onClick={(e) => {
            e.stopPropagation()
            setDrawer('parts')
          }}
        >
          <AddIcon />
        </AddButton>
      )}
    </Box>
  )
}

export { Canvas }
