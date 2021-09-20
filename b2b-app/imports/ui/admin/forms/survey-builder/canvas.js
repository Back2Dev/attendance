import React, { createElement } from 'react'
import { Box } from '@material-ui/core'
import debug from 'debug'

import { Placeholder } from './types'
import { usePartsValue, useSetSelectedPart } from './recoil/hooks'
import TypeRegistry from './types/type-registry'
import { DndDraggable, DndDroppable } from '../survey-builder/context/dnd'
import parseWithOptions from 'date-fns/fp/parseWithOptions'
import { partsAtom } from './recoil/atoms'

const log = debug('builder:canvas')

const Canvas = () => {
  const parts = usePartsValue()
  const setSelectedPart = useSetSelectedPart()

  return (
    <div>
      <Box
        position="absolute"
        top={0}
        bottom={0}
        left="20%"
        right="20%"
        border="1px solid lightgrey"
        onClick={() => setSelectedPart(null)}
        overflow="auto"
      >
        <DndDroppable pid="canvas" listAtom={partsAtom}>
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {parts.map(({ _id, type }, index) => (
                <DndDraggable pid={type} itemId={_id} index={index} key={_id}>
                  {(provided) =>
                    createElement(TypeRegistry.get(type)?.component || Placeholder, {
                      key: _id,
                      pid: _id,
                      ...provided.draggableProps,
                      ...provided.dragHandleProps,
                      ref: provided.innerRef,
                    })
                  }
                </DndDraggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </DndDroppable>
      </Box>
    </div>
  )
}

export default Canvas
