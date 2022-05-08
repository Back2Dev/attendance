import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import debug from 'debug'

import { Content } from './content'
import { useParts } from '../../recoil/hooks'
import { MobileLayout } from 'imports/ui/forms/survey-builder/components/layouts/mobile'

const log = debug('builder:views/edit')

const EditView = ({ navigationController }) => {
  const [selected, setSelected] = useState(new Set())
  const { removePart } = useParts()

  const onSelect = (id, checked) => {
    const next = new Set(selected)
    if (checked) {
      next.add(id)
    } else {
      next.delete(id)
    }
    setSelected(next)
  }

  const deleteParts = () => {
    log(selected)
    selected.forEach((id) => {
      removePart(id)
    })
  }

  return (
    <MobileLayout
      navigationController={navigationController}
      backTitle="Builder"
      navRight={
        <IconButton onClick={deleteParts}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <Content onSelect={onSelect} />
    </MobileLayout>
  )
}

EditView.propTypes = {
  navigationController: PropTypes.object,
}

export { EditView }
