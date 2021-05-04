import { Meteor } from 'meteor/meteor'
import React, { useContext, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

import { Button, Chip, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'

const StyledBiography = styled.div`
  .text-field-wrapper {
    margin: 20px 0;
  }
  .tags-wrapper {
    margin: 20px 0;
  }
  .btns-wrapper {
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
  const [favorites, setFavorites] = useState(member?.favorites || [])
  const [loading, setloading] = useState(false)

  const handleSubmit = () => {
    setloading(true)
    Meteor.call('members.updateBio', { bio, favorites }, (err, result) => {
      if (!mounted) {
        return
      }
      setloading(false)
      if (err) {
        showError(err)
      }
      if (result.status === 'failed') {
        showError(result.message)
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
      </div>
      <div className="tags-wrapper">
        <Autocomplete
          multiple
          id="bio-tags-filled"
          options={[]}
          value={favorites}
          onChange={(e, value) => {
            setFavorites(value)
          }}
          freeSolo
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                key={index}
                variant="outlined"
                label={option}
                {...getTagProps({ index })}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Favorites"
              placeholder="tags"
            />
          )}
        />
      </div>
      <div className="btns-wrapper">
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
