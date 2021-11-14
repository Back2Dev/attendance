import React from 'react'
import PropTypes from 'prop-types'
import { List } from '@material-ui/core'
import debug from 'debug'

import { DndDraggable, DndDroppable } from '../../context'
import { partsAtom } from '../../recoil/atoms'
import { usePartsValue } from '../../recoil/hooks'
import { EditItem } from './item'

const log = debug('builder:views/edit/content')

const Content = ({ onSelect }) => {
  const parts = usePartsValue()

  return (
    <DndDroppable pid="editCanvas" listAtom={partsAtom} type="editCanvas">
      {(provided) => (
        <List
          style={{ paddingLeft: 0 }}
          ref={provided.innerRef}
          dense
          {...provided.droppableProps}
        >
          {parts.map(({ _id, config }, index) => {
            return (
              <DndDraggable pid={_id} key={_id} index={index}>
                {(provided, _, lockAxis) => (
                  <EditItem
                    pid={_id}
                    type={config.type}
                    atom={config.atom}
                    index={index}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={lockAxis('y', provided.draggableProps.style)}
                    onSelect={(checked) => onSelect(_id, checked)}
                  />
                )}
              </DndDraggable>
            )
          })}
          {provided.placeholder}
        </List>
      )}
    </DndDroppable>
  )
}

Content.propTypes = {
  onSelect: PropTypes.func,
}

export { Content }
