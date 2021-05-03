import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Button, TextField, Typography } from '@material-ui/core'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const StyledBiography = styled.div`
  .text-field-wrapper {
    margin: 20px 0;
    .submit-btn {
      margin-top: 20px;
    }
  }
`

function Biography() {
  const { member } = useContext(AccountContext)
  console.log(member)

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [bio, setBio] = useState(member?.bio || '')
  const [loading, setloading] = useState(false)

  const handleSubmit = () => {
    setloading(true)
    Meteor.call('members.updateBio', { bio }, (err) => {
      if (!mounted) {
        return
      }
      setloading(false)
      if (err) {
        showError(err)
      } else {
        showSuccess('Member updated')
      }
    })
  }

  return (
    <StyledBiography>
      <Typography variant="h5">Biography</Typography>
      <div className="text-field-wrapper">
        <TextField
          variant="outlined"
          fullWidth
          multiline
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Button
          className="submit-btn"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          Submit
        </Button>
      </div>
    </StyledBiography>
  )
}

export default Biography
