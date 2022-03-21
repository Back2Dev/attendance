import { Button, Autocomplete, Typography } from '@material-ui/core'
import React from 'react'

// const options = ['']

const AddMember = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        //   justifyContent: 'space-around',
        flexDirection: 'column',
        alignContent: 'flex-start',
      }}
    >
      <h1>Add team Member </h1>
      <Typography
        variant="caption"
        component="div"
        gutterBottom
        style={{ order: 1, flexDirection: 'row' }}
      >
        Add team member
      </Typography>

      <Autocomplete
        id="member-input"
        freesolo="true"
        style={{ width: '50px', height: '70px', order: 1, flexDirection: 'row' }}
      ></Autocomplete>
      <Button
        name="add-member"
        style={{
          width: '200px',
          height: '70px',
          order: 3,
          rowGap: '40px',
          columnGap: '39px',
          alignSelf: 'center',
          flexDirection: 'column',
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
          order: 4,
          alignSelf: 'flex-end',
          flexDirection: 'column',
        }}
      >
        Cancel
      </Button>
    </div>
  )
}

export default AddMember
