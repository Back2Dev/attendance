import { Box } from '@material-ui/core'
import React from 'react'
import debug from 'debug'

import { useDrawer, useSelectedPartValue } from '../recoil/hooks'
import EditProperty from './edit-property'
import Section from './section'
import Drawer from '../drawer'
import { ResponsiveWrap } from '../wrap-if'

const log = debug('builder:inspector')

// FIXME: after tabbing out of textbox, try to edit property and instance gets unselected
// FIXME: hit enter on a textbox and instance gets unselected
// FIXME: swap choice positions and the +val get cleared
const Inspector = () => {
  const selectedPart = useSelectedPartValue()
  const drawer = useDrawer()
  // FIXME add onClose/Open handlers for drawer
  log(selectedPart, drawer)
  return (
    <ResponsiveWrap
      mobile={<Drawer open={selectedPart !== null && drawer === 'inspector'} />}
      desktop={
        <Box
          position="absolute"
          top={0}
          right={0}
          bottom={0}
          width="20%"
          border="1px solid lightgrey"
        />
      }
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
    </ResponsiveWrap>
  )
}

export default Inspector
