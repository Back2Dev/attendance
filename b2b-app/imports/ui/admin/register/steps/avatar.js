import React, { useRef } from 'react'
import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm } from 'uniforms-material'
import PropTypes from 'prop-types'

import AvatarField from './avatar-field'
import StepButtons from './step-buttons'

const AvatarSchema = new SimpleSchema({
  avatar: {
    type: String,
    defaultValue: 'default.jpg',
    allowedValues: [
      'default.jpg',
      '1.jpg',
      '2.jpg',
      '3.jpg',
      '4.jpg',
      '5.jpg',
      '6.jpg',
      '7.jpg',
      '8.jpg',
      '9.jpg',
      '10.jpg',
      '11.jpg',
      '12.jpg',
      '13.jpg',
      '14.jpg',
      '15.jpg',
      '16.jpg',
      'test11.png',
      'test14.png',
      'test16.png',
      'test17.png',
      'test18.png',
      'test19.png',
      'test20.png',
      'test21.png',
      'test24.png',
      'test25.png',
      'test26.png',
      'test28.png',
      'test29.png',
    ],
  },
})

const schema = new SimpleSchema2Bridge(AvatarSchema)

const Avatar = ({ initialData }) => {
  const formRef = useRef()
  return (
    <div>
      <h1>Avatar form</h1>
      <AutoForm
        schema={schema}
        onSubmit={console.log}
        placeholder
        ref={formRef}
        model={initialData}
      >
        <AvatarField images={AvatarSchema.get('avatar', 'allowedValues')} />
        <StepButtons formRef={formRef} />
      </AutoForm>
    </div>
  )
}

Avatar.propTypes = {
  initialData: PropTypes.object,
}

Avatar.defaultProps = {
  initialData: {},
}

export default Avatar
