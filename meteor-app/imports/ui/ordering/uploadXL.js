import React from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-s-alert';
import { Grid } from 'semantic-ui-react'
import { Button, Form, Input, Header } from 'semantic-ui-react'

const UploadXL = ({ uploadXL, toggleAddPart }) => (
  <Form action="" onSubmit={(e)=> {
    toggleAddPart()
    uploadXL(e)
  }}>
    <Header> Upload your xlsx file! </Header>
    <Grid centered>
    <Grid.Row>
    <Input type="file" />
    </Grid.Row>
    <Grid.Row>
    <Button type="submit" content="Upload a new data file" positive />
    </Grid.Row>
    </Grid>
  </Form>
)

UploadXL.propTypes = {
  uploadXL: PropTypes.func.isRequired,
}

export default UploadXL
