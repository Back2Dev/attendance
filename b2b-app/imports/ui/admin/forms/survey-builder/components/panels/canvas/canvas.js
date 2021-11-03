import React, { createElement } from 'react'
import { Box, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import debug from 'debug'

import { Placeholder } from '$sb/components/types'
import { usePartsValue, useSelectedPartState, useSetDrawer } from '$sb/recoil/hooks'
import { partsAtom } from '$sb/recoil/atoms'
import { DndDroppable, useBuilder } from '$sb/context'
import styled from 'styled-components'

const log = debug('builder:canvas')

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
  const parts = usePartsValue()
  const [selectedPart, setSelectedPart] = useSelectedPartState()
  const { isMobile } = useBuilder()
  const setDrawer = useSetDrawer()

  const canvasClicked = (e) => {
    // make sure to deselect only if canvas clicked. if it originated elsewhere, just ignore it
    if (e.target !== e.currentTarget) return
    if (isMobile) setDrawer(null)
    setSelectedPart(null)
  }

  return (
    <Box height="100%">
      <DndDroppable pid="canvas" listAtom={partsAtom} type="canvas">
        {(provided) => (
          <List
            onClick={canvasClicked}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {parts.map(({ _id, config: { component } }, index) =>
              createElement(component || Placeholder, {
                key: _id,
                pid: _id,
                index,
              })
            )}
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
