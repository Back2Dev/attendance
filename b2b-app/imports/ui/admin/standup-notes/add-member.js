import { Button, TextField, Typography } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import React from 'react'

// const options = ['']

const AddMember = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'row wrap',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignContent: 'space-between',
      }}
    >
      <h1>Add team Member </h1>
      <Typography
        variant="caption"
        component="div"
        gutterBottom
        style={{ order: 0, flexDirection: 'column' }}
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
            order: 1,
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-start',
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
          alignItems: 'center',
          flexFlow: 'row',
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
          flexFlow: 'row',
          alignSelf: 'baseline',
          alignItems: 'center',
        }}
      >
        Cancel
      </Button>
    </div>
  )
}

export default AddMember
