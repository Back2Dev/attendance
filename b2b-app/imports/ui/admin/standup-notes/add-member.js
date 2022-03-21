import { Button, Select, Typography } from '@material-ui/core'
import React from 'react'

const options = []

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
      <Typography variant="caption" component="div" gutterBottom style={{ order: 1 }}>
        Add team member
      </Typography>
      <Select
        type="Input"
        options={options}
        style={{ width: '50px', height: '70px', order: 1 }}
      />
      <Button
        name="add-member"
        style={{
          width: '200px',
          height: '70px',
          order: 3,
          rowGap: '40px',
          columnGap: '50px',
          alignSelf: 'flex-end',
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
          alignSelf: 'center',
        }}
      >
        Cancel
      </Button>
    </div>
  )
}

export default AddMember
