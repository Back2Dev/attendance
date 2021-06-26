import React, { useRef } from 'react'
import { AutoForm } from 'uniforms-material'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

import AvatarField from './avatar-field'
import StepButtons from './step-buttons'
import { avatarBridge } from '../form-bridge'

const useStyles = makeStyles({
  root: {
    gridTemplateColumns: '1fr',
    gridTemplateAreas: `'avatar'
      'stepButtons'
    `,
  },
})

const Avatar = ({ initialData }) => {
  const formRef = useRef()
  const classes = useStyles()
  return (
    <AutoForm
      schema={avatarBridge}
      placeholder
      ref={formRef}
      model={initialData}
      className={classes.root}
    >
      <AvatarField
        images={avatarBridge.schema.get('avatar', 'allowedValues')}
        style={{ gridArea: 'avatar' }}
      />
      <StepButtons formRef={formRef} />
    </AutoForm>
  )
}

Avatar.propTypes = {
  initialData: PropTypes.object,
}

Avatar.defaultProps = {
  initialData: {},
}

export default Avatar
