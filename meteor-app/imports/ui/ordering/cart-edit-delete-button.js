import React from 'react'
import { Button } from 'semantic-ui-react'


const EditDelete = () => (
    <Button.Group>
      <Button color='green'>EDIT</Button>
      <Button.Or text='or' />
      <Button color='red'>DELETE</Button>
    </Button.Group>
  )

export default EditDelete