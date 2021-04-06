import { Meteor } from 'meteor/meteor'
import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { AutoForm, AutoField, ErrorsField, SubmitField } from 'uniforms-material'
import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { Typography, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import GooglePlaces from '/imports/ui/components/google-places.js'
import MaterialPhoneNumber from '/imports/ui/components/mui-phone-number.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

let userSchema = new SimpleSchema2Bridge(
  new SimpleSchema({
    name: {
      type: String,
    },
    nickname: {
      type: String,
      optional: true,
    },
    username: {
      type: String,
      uniforms: { label: 'Email' },
    },
    mobile: {
      type: String,
      min: 6,
      max: 50,
      regEx: SimpleSchema.RegEx.Phone,
      uniforms: {
        component: MaterialPhoneNumber,
      },
    },
    sms: {
      type: Boolean,
      optional: true,
      uniforms: {
        label: 'I would like to receive SMS notifications',
      },
    },
  })
)

const useStyles = makeStyles((theme) => ({
  mobile: {
    marginTop: '10px',
  },
}))

export default function UserPreferences() {
  const classes = useStyles()

  const { member, user } = useContext(AccountContext)
  const userMember = Object.assign({}, member, user)
  userMember.sms = userMember?.notifyBy?.includes('SMS')

  const editUserMember = (form) => {
    Meteor.call('editUserMember', form, (err) => {
      if (err) {
        showError(err)
      } else {
        showSuccess('Member updated')
      }
    })
  }

  return (
    <Container>
      {userMember && (
        <AutoForm
          schema={userSchema}
          onSubmit={(form) => editUserMember(form)}
          model={userMember}
        >
          <Typography variant="h5">Personal information</Typography>
          <AutoField name="name" fullWidth />
          <AutoField name="nickname" fullWidth />
          <AutoField name="username" fullWidth disabled />
          <div className={classes.mobile}>
            <AutoField name="mobile" defaultValue={userMember.mobile} fullWidth />
          </div>
          <AutoField name="sms" />
          <ErrorsField />
          <br />
          <SubmitField id="next-button" color="primary" variant="contained" fullWidth>
            Submit
          </SubmitField>
        </AutoForm>
      )}
    </Container>
  )
}
