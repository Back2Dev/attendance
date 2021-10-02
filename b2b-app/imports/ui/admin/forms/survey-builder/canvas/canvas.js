import React, { createElement } from 'react'
import { Box, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import debug from 'debug'

import { Placeholder } from '../types'
import { usePartsValue, useSelectedPartState, useSetDrawer } from '../recoil/hooks'
import TypeRegistry from '../types/type-registry'
import { partsAtom } from '../recoil/atoms'
import { DndDroppable, useBuilder } from '../context'
import { ResponsiveWrap } from '../wrap-if'
import styled from 'styled-components'

const log = debug('builder:canvas')

const AddButton = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
}))
// FIXME in mobile, when drawer is open the last part is obscured when scrolling to the bottom
// TODO enable inertial scrolling
// TODO make dragging move vertically only
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
    <div>
      <ResponsiveWrap
        mobile={
          <Box
            onClick={canvasClicked}
            border="1px solid lightgrey"
            minHeight="calc(100vh - 60px)"
            px={1}
          />
        }
        desktop={
          <Box
            onClick={canvasClicked}
            position="absolute"
            top={0}
            bottom={0}
            left="20%"
            right="20%"
            border="1px solid lightgrey"
            overflow="auto"
            padding={2}
          />
        }
      >
        <DndDroppable pid="canvas" listAtom={partsAtom} type="canvas">
          {(provided) => (
            <ul
              style={{ paddingLeft: 0 }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {parts.map(({ _id, type }, index) =>
                createElement(TypeRegistry.get(type)?.component || Placeholder, {
                  key: _id,
                  pid: _id,
                  index,
                })
              )}
              {provided.placeholder}
            </ul>
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
      </ResponsiveWrap>
    </div>
  )
}

export default Canvas
