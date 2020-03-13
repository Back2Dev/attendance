/*
import React from 'react'
import { Button, Container } from 'semantic-ui-react'
import UploadXL from '/imports/ui/ordering/uploadXL'

const debug = require('debug')('b2b:admin')

const AppSelection = ({ history, uploadXL }) => {
  const [addParts, setAdd] = React.useState(true)
  document.title = `Administration`

  toggleAddPart = () => {
    setAdd(!addParts)
  }

  return (
    <div>
      <Container style={{ textAlign: 'center' }}>
        <Button.Group style={{ width: '100%' }} vertical>
          <Button
            onClick={() => {
              history.push('/admin/userprofiles')
            }}
            style={{
              height: '100px',
              marginTop: '20px',
              marginBottom: '20px'
            }}
            color="grey"
          >
            <h1>User Profiles</h1>
          </Button>

          <Button
            onClick={() => {
              history.push('/assessment')
            }}
            style={{
              height: '100px',
              marginTop: '20px',
              marginBottom: '20px'
            }}
            color="blue"
          >
            <h1>New Bike Assessment</h1>
          </Button>
          <Button
            onClick={() => {
              history.push('/jobs')
            }}
            style={{
              height: '100px',
              marginTop: '20px',
              marginBottom: '20px'
            }}
            color="green"
          >
            <h1>Current Jobs</h1>
          </Button>

          <Button
            onClick={() => {
              history.push('/job-history')
            }}
            style={{
              height: '100px',
              marginTop: '20px',
              marginBottom: '20px'
            }}
            color="green"
          >
            <h1>Completed Jobs</h1>
          </Button>

          <Button
            onClick={() => {
              history.push('/ordering')
            }}
            style={{
              height: '100px',
              marginTop: '20px',
              marginBottom: '20px'
            }}
            color="teal"
          >
            <h1>Part Prices</h1>
          </Button>
          <Button
            onClick={toggleAddPart}
            style={{
              height: '100px',
              marginTop: '20px',
              marginBottom: '20px'
            }}
            color="grey"
          >
            <h1>Add updated pricelist</h1>
          </Button>

          {addParts ? '' : <UploadXL uploadXL={uploadXL} toggleAddPart={toggleAddPart} />}
        </Button.Group>
      </Container>
    </div>
  )
}

export default AppSelection
*/