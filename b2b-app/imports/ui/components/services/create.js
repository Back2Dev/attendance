import React from 'react'
import styled from 'styled-components'

import { Typography } from '@material-ui/core'
import { ServiceProvider } from './create/context'
import FromSteps from './create/steps'
import ServiceStep from './create/step-service'
import BikeStep from './create/step-bike'
import ContactStep from './create/step-contact'
import PickupStep from './create/step-pickup'
import CreateServiceHeader from './create/header'

const StyledCreateService = styled.div`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
`

function CreateService() {
  return (
    <ServiceProvider>
      <StyledCreateService>
        <CreateServiceHeader />
        <FromSteps />
        <div className="steps-contents">
          <ServiceStep />
          <BikeStep />
          <ContactStep />
          <PickupStep />
        </div>
      </StyledCreateService>
    </ServiceProvider>
  )
}

export default CreateService
