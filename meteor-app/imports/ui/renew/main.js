import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Image, Card, Segment, Grid, Header } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card-small'
import MembershipCard from '/imports/ui/member-card/member-card'
import { ProductCardOnly } from '/imports/ui/shop/product-card'
// import { RenewContextProvider } from './context'

const Main = props => {
  const add = props => {}
  const remove = props => {}
  const logoFile = Meteor.settings.public.logo || '/images/logo-tiny.jpg'
  if (props.loading) return <div>Loading...</div>
  return (
    <div>
      <Header as="h1">
        {' '}
        <Image src={logoFile} height="35px" /> {Meteor.settings.public.org} membership renewal
      </Header>
      <Segment>
        <Grid style={{ height: '100%' }} verticalAlign="middle" centered>
          <Grid.Column width={8}>
            <Card.Group centered>
              <MembershipCard member={props.member} />
            </Card.Group>
          </Grid.Column>
          <Grid.Column width={8}>
            <Card.Group centered>
              <ProductCardOnly mode="add" {...props.products[0]} add={add} remove={remove} />{' '}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </Segment>
    </div>
  )
}

Main.propTypes = {
  member: PropTypes.object.isRequired
}
export default Main
