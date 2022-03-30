import { Button, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React from 'react'

// const options = ['']

const AddMember = () => {
  return (
    <div
      style={{
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
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
            justifyContent: 'baseline',
            alignItems: 'center',
          }}
        ></Autocomplete>
      }
      <Button
        name="add-member"
        style={{
          width: '200px',
          height: '70px',
          order: 100,
          rowGap: '40px',
          columnGap: '30px',
          alignSelf: 'center',
          flexFlow: 'wrap-reverse',
          justifyContent: 'space-around',
        }}
      >
        Add
      </Button>
      <Button
        name="cancel"
        style={{
          width: '200px',
          height: '70px',
          backgroundcolor: 'pink',
          order: 100,
          flexFlow: 'no wrap',
          alignSelf: 'baseline',
        }}
      >
        Cancel
      </Button>
    </div>
  )
}

export default AddMember
