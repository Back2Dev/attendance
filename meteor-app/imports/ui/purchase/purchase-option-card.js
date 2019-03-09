import React from 'react'
// import PropTypes from 'prop-types';
import { Card, List, Icon, Button } from 'semantic-ui-react'

const PurchaseCard = props => {
  const cardColor = 'pink' // Mike added this
  const cardClick = () => {}

  return (
    <Button style={{ backgroundColor: 'white', minWidth: '100%' }}>
      <Card style={{ backgroundColor: cardColor, color: 'white', minWidth: '100%' }}>
        <Card.Content style={{ width: '100%', minHeight: '420px' }} onClick={cardClick}>
          <Card.Header style={{ color: 'white', paddingTop: '15px', fontSize: '1.5em' }}>{`Workshop`}</Card.Header>
        </Card.Content>
      </Card>
    </Button>
  )
}

export default PurchaseCard
