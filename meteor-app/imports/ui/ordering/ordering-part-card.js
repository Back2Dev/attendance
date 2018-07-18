import React from 'react'
import PropTypes from 'prop-types';
import { Container, Divider, Card, Icon, Image, Label, Button } from 'semantic-ui-react'
import '/imports/ui/ordering/ordering-part-card.css'

const PartCard = ({
  _id,
  barcode,
  createdAt,
  desc,
  imageUrl,
  partNo,
  retailPrice,
  status,
  wholesalePrice,
  className
}) => {

  if (!barcode) {
    barcode = "n/a"
  }

  return (
    <Card className={className}
      key={_id}
    >
      <div className='part-img-container'>
        <Image src={imageUrl} className='part-img' />
      </div>
      <Card.Content>
        <Card.Header className='part-num-container'>
          <span className='part-num-text'>
            Part #
          </span>

          <span className='part-num'>
            {partNo}
          </span>
        </Card.Header>

        <Divider fitted />

        <Card.Description className='part-desc'>{desc}</Card.Description>

        <Divider />

        <div className='price-container' >
          <b>${retailPrice}</b>
          <Button className='part-add-cart-button' floated='right'>Add To Cart</Button>
        </div>
      </Card.Content>
    </Card>
  )
}

PartCard.propTypes = {
  _id: PropTypes.string.isRequired,
  barcode: PropTypes.string,
  createdAt: PropTypes.object.isRequired,
  desc: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  partNo: PropTypes.string.isRequired,
  retailPrice: PropTypes.number.isRequired,
  status: PropTypes.number.isRequired,
  wholesalePrice: PropTypes.number.isRequired
};

export default PartCard
