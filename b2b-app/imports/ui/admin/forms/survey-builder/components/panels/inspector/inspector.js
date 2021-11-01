import React from 'react'
import debug from 'debug'

import { useSelectedPartValue } from '$sb/recoil/hooks'
import { EditProperty } from './edit-property'
import { Section } from './section'

const log = debug('builder:inspector')

// FIXME: after tabbing out of textbox, try to edit property and instance gets unselected
// FIXME: hit enter on a textbox and instance gets unselected
// FIXME: swap choice positions and the +val get cleared
const Inspector = () => {
  const selectedPart = useSelectedPartValue()
  // FIXME add onClose/Open handlers for drawer

  return (
    <div>
      {selectedPart !== null && (
        <div>
          <Section heading="Question">
            <EditProperty pid={selectedPart} path="id" />
          </Section>
          <Section heading="Answers">
            <EditProperty pid={selectedPart} path="answers" />
          </Section>
        </div>
      )}
    </div>
  )
}

export { Inspector }
