import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Image, Icon } from 'semantic-ui-react'

const ItemCard = props => {
  const edit = () => {
    props.edit(props._id)
  }

  const view = () => {
    props.view(props._id)
  }

  const remove = () => {
    props.remove(props._id)
  }

  const img = props.image || '/images/gym.jpg'
  const { mode } = props
  return (
    <Card color={props.color}>
      <Card.Content>
        <Image floated="left" size="mini" src={img} />
        <Card.Header>{props.name}</Card.Header>
        <Card.Description>{props.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Button.Group floated="right">
            <Button size="mini" floated="right" type="button" onClick={view} icon title="View this item">
              <Icon name="eye" />
            </Button>
            <Button size="mini" floated="right" type="button" onClick={edit} icon title="Edit this item" type="button">
              <Icon name="pencil" />
            </Button>
            <Button type="button" onClick={remove} color={props.color} icon type="button">
              <Icon name="trash" />
            </Button>
          </Button.Group>
        </div>
      </Card.Content>
    </Card>
  )
}

ItemCard.propTypes = {
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  view: PropTypes.func.isRequired
}

export default ItemCard
