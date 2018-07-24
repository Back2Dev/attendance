import React from 'react'
import PropTypes from 'prop-types'
import Alert from 'react-s-alert';

import { Button, Form, Input, Header } from 'semantic-ui-react'

const UploadXL = ({ uploadXL, toggleAddPart }) => (
  <Form action="" onSubmit={(e)=> {
    toggleAddPart()
    uploadXL(e)
  }}>
    <Header> Upload your xlsx file! </Header>
    <Input type="file" />
    <Button type="submit" content="Upload a new data file" />
  </Form>
)

UploadXL.propTypes = {
  uploadXL: PropTypes.func.isRequired,
}

export default UploadXL
