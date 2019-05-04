import React from 'react'
import { Switch, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Button, Card, Segment, Grid, Header } from 'semantic-ui-react'

import MemberCard from '/imports/ui/member/member-card-small'
import { ProductCardOnly } from '/imports/ui/shop/product-card'
// import { RenewContextProvider } from './context'

const Main = props => {
  const add = props => {}
  const remove = props => {}
  if (props.loading) return <div>Loading...</div>
  return (
    <div>
      <Header as="h1">{Meteor.settings.public.org} membership renewal</Header>
      <Segment>
        <Grid style={{ height: '100%' }} verticalAlign="middle" divided>
          <Grid.Column width={6}>
            <Card.Group centered>
              <MemberCard className="member-visit-card" {...props.member} onCardClick={f => f} />
            </Card.Group>
          </Grid.Column>
          <Grid.Column width={10}>
            <ProductCardOnly mode="add" {...props.products[0]} add={add} remove={remove} />{' '}
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
