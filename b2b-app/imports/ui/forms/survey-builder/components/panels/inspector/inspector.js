import React, { createElement } from 'react'
import debug from 'debug'

import {
  useSelectedPartValue,
  usePartsValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { list } from '/imports/ui/forms/survey-builder/utils'
import { EditProperty } from './edit-property'
import { Section } from './section'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}))

const log = debug('builder:inspector')

// FIXME: after tabbing out of textbox, try to edit property and instance gets unselected
// FIXME: hit enter on a textbox and instance gets unselected
// FIXME: swap choice positions and the +val get cleared
const Inspector = () => {
  const classes = useStyles()
  const selectedPart = useSelectedPartValue()
  const parts = usePartsValue()
  // FIXME add onClose/Open handlers for drawer

  if (!selectedPart) return null

  const part = list.findById(parts, selectedPart)
  if (!part) return null

  return (
    <div className={classes.root}>
      {selectedPart !== null && createElement(part.config.inspectorProperties)}
    </div>
  )
}

Inspector.Section = Section
Inspector.Property = EditProperty

export { Inspector }
