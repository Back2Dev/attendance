import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Container, Grid } from '@material-ui/core'

import Listings from '/imports/ui/components/properties/listings.js'
import PropertyDetails from '/imports/ui/components/properties/details.js'
import NotFoundComponent from '/imports/ui/components/commons/not-found.js'

const StyledPropertiesPage = styled.div``

function PropertiesPage() {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledPropertiesPage className="properties-page-container">
      <Helmet>
        <title>My Properties</title>
      </Helmet>
      <Container disableGutters>
        <Grid container>
          <Grid item xs={12}>
            <Switch>
              <Route path="/properties/:id" exact component={PropertyDetails} />
              <Route path="/properties" exact component={Listings} />
              <Route component={NotFoundComponent} />
            </Switch>
          </Grid>
        </Grid>
      </Container>
    </StyledPropertiesPage>
  )
}

export default PropertiesPage
