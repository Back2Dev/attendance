import React from 'react'
import styled from 'styled-components'

import { ServiceProvider } from './create/context'
import FromSteps from './create/steps'
import ServiceStep from './create/step-service'
import BikeStep from './create/step-bike'
import ContactStep from './create/step-contact'
// import PickupStep from './create/step-pickup'
import CreateServiceHeader from './create/header'
import { Paper } from '@material-ui/core'

const StyledCreateService = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
  .steps-contents {
    max-width: 550px;
    margin: 20px auto;
    padding: 10px;
  }
`

function CreateService() {
  return (
    <ServiceProvider>
      <StyledCreateService>
        <CreateServiceHeader />
        <FromSteps />
        <Paper className="steps-contents" elevation={1}>
          <ServiceStep />
          <BikeStep />
          <ContactStep />
        </Paper>
      </StyledCreateService>
    </ServiceProvider>
  )
}

export default CreateService
