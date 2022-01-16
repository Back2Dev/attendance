import React, { createElement } from 'react'
import debug from 'debug'

import { useSelectedPartValue, usePartsValue } from '$sb/recoil/hooks'
import { list } from '$sb/utils'
import { EditProperty } from './edit-property'
import { Section } from './section'

const log = debug('builder:inspector')

// FIXME: after tabbing out of textbox, try to edit property and instance gets unselected
// FIXME: hit enter on a textbox and instance gets unselected
// FIXME: swap choice positions and the +val get cleared
const Inspector = () => {
  const selectedPart = useSelectedPartValue()
  const parts = usePartsValue()
  // FIXME add onClose/Open handlers for drawer

  if (!selectedPart) return null

  const part = list.findById(parts, selectedPart)
  if (!part) return null

  return (
    <div>{selectedPart !== null && createElement(part.config.inspectorProperties)}</div>
  )
}

Inspector.Section = Section
Inspector.Property = EditProperty

export { Inspector }