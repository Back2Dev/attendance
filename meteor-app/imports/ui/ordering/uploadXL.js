import React from 'react'
import PropTypes from 'prop-types'

import { Button, Form, Input } from 'semantic-ui-react'

const UploadXL = ({ uploadXL }) => (
  <Form action="" onSubmit={uploadXL}>
    <label>Upload .xlsx file</label>
    <Input type="file" />
    <Button type="submit">Upload</Button>
  </Form>
)

UploadXL.propTypes = {
  uploadXL: PropTypes.func.isRequired,
}

export default UploadXL
