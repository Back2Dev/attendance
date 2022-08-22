import React from 'react'
import { Button, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'

// const options = ['']

const AddMember = () => {
  return (
    <div
      style={{
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignContent: 'flex-start',
      }}
    >
      <h1>Add team Member </h1>
      <Typography
        variant="caption"
        component="div"
        gutterBottom
        style={{
          order: 0,
          alignContent: 'flex-start',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        Add team member
      </Typography>

      {
        <Autocomplete
          id="member-input"
          freesolo
          options={['Mike', 'Pat']}
          renderInput={(params) => (
            <TextField
              {...params}
              label="member name"
              margin="normal"
              variant="outlined"
            />
          )}
          style={{
            width: '180px',
            height: '70px',
            order: 10,
            alignSelf: 'flex-start',
            justifyContent: 'space-around',
          }}
        ></Autocomplete>
      }
      <Button
        name="add-member"
        style={{
          width: '200px',
          height: '60px',
          order: 100,
          rowGap: '45px',
          columnGap: '23px',
          alignSelf: 'center',
          flexFlow: 'wrap-reverse',
          backgroundColor: 'blue',
          justifyContent: 'space-around',
        }}
      >
        Add
      </Button>
      <Button
        name="cancel"
        style={{
          order: 100,
          width: '200px',
          height: '60px',
          backgroundColor: 'magenta',
          rowGap: '45px',
          columnGap: '23px',
          flexFlow: 'no wrap',
          justifyContent: 'center',
        }}
      >
        Cancel
      </Button>
    </div>
  )
}

export default AddMember
