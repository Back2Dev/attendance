import { Box } from '@material-ui/core'
import React from 'react'

import { useSelectedPartValue } from '../recoil/hooks'
import EditProperty from './edit-property'
import Section from './section'

// FIXME: after tabbing out of textbox, try to edit property and instance gets unselected
// FIXME: hit enter on a textbox and instance gets unselected
// FIXME: swap choice positions and the +val get cleared
const Inspector = () => {
  const selectedPart = useSelectedPartValue()
  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      bottom={0}
      width="20%"
      border="1px solid lightgrey"
    >
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
    </Box>
  )
}

export default Inspector
