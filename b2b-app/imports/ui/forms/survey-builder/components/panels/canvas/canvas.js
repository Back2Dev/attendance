import React, { createElement, useState } from 'react'
import { Box, Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'

import debug from 'debug'
import { useRecoilCallback } from 'recoil'
import { Placeholder } from '/imports/ui/forms/survey-builder/components/types'
import {
  usePartsValue,
  useSelectedPartState,
  useSetDrawer,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { partsAtom } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { DndDroppable, useBuilder } from '/imports/ui/forms/survey-builder/context'
import styled from 'styled-components'
import { Undefined } from '$sb/components/types/undefined/undefined'

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
  const [sectionState, setSectionState] = useState(
    parts.reduce((acc, { type, _id }) => {
      if (type === 'section') {
        return { ...acc, [_id]: false }
      }
      return { ...acc }
    }, {})
  )
  console.log(parts)
  const canvasClicked = (e) => {
    // make sure to deselect only if canvas clicked. if it originated elsewhere, just ignore it
    if (e.target !== e.currentTarget) return
    if (isMobile) setDrawer(null)
    setSelectedPart(null)
  }
  // console.log(sectionState)

  // const getSource = useRecoilCallback(
  //   ({ snapshot }) =>
  //     () => {
  //       let parts = snapshot.getLoadable(partsAtom).contents
  //       let sectionID
  //       let sectionStatus = {}
  //       parts.reduce((acc, curr) => {
  //         const contents = snapshot.getLoadable(curr.config.atom(curr._id)).contents
  //         console.log('content', contents)
  //         const type = contents.type || curr.config.component.name.toLowerCase()

  //         curr['type'] = type
  //         if (type === 'section') {
  //           sectionID = contents.id || contents._id
  //           sectionStatus = { ...sectionStatus, [sectionID]: false }
  //         }
  //         curr['belongSection'] = sectionID
  //         return [...acc, curr]
  //       }, [])
  //       console.log(sectionStatus)
  //       setSectionState(sectionStatus)
  //       return parts
  //     },
  //   []
  // )

  // const [source] = useState(() => getSource())
  return (
    <Box height="100%">
      <DndDroppable pid="canvas" listAtom={partsAtom} type="canvas">
        {(provided) => (
          <List
            onClick={canvasClicked}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {parts.map(({ _id, type, config: { component }, belongSection }, index) => {
              return createElement(Undefined || Placeholder, {
                key: _id,
                pid: _id,
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
