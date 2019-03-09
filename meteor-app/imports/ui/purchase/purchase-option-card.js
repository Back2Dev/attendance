import React from 'react'
import PropTypes from 'prop-types'
import { Card, List, Icon, Button } from 'semantic-ui-react'

const PurchaseCard = props => {
  const cardColor = 'pink' // Mike added this
  const cardClick = () => {}

  const { name, description, price = '$10' } = props

  return (
    <Button>
      <Card>
        <Card.Content onClick={cardClick}>
          <Card.Header>{name}</Card.Header>
          <div>{description}</div>
          <div>Price: {price}</div>
        </Card.Content>
      </Card>
    </Button>
  )
}

PurchaseCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
}
export default PurchaseCard
