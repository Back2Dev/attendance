import React from 'react'
import { AutoForm } from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

let userSchema = new SimpleSchema2Bridge(
  new SimpleSchema({
    email: String,
    password: { type: String, min: 7, uniforms: { type: 'password' } },
    name: String,
    mobile: String,
    serial: { type: String, optional: true },
    roles: { type: Array, optional: false },
    'roles.$': {
      type: String,
      allowedValues: ['CUS', 'CON'],
    },
  })
)

const AddUser = ({ closeModal }) => {
  const add = (form) => {
    Meteor.call('addNewUser', form)
    closeModal()
  }

  return (
    <>
      <h2>Add New User</h2>
      <AutoForm schema={userSchema} onSubmit={(e) => add(e)} />
    </>
  )
}

export default AddUser
