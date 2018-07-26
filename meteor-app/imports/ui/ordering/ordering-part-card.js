import React from 'react'
import PropTypes from 'prop-types';
import { Container, Divider, Card, Icon, Image, Label, Button } from 'semantic-ui-react'
import '/imports/ui/ordering/ordering-part-card.css';


const PartCard = ({
  _id,
  barcode,
  createdAt,
  name,
  imageUrl,
  partNo,
  retailPrice,
  status,
  wholesalePrice,
  className,
  addToCart,
  activeOrder,
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

        <Card.Description className='part-desc'>{name}</Card.Description>

        <Divider />

        <div className='price-container' >
          <b>${(retailPrice / 100).toFixed(2)}</b>
          <Button className='part-add-cart-button' floated='right' color='blue' onClick={() => addToCart({
            name: name,
            partId: _id,
            partNo: partNo,
            addedAt: new Date(),
            price: retailPrice,
            qty: 1,
            userId: 'MarksID',
          })} >Add To Cart</Button>
        </div>
      </Card.Content>
    </Card>
  )
}

PartCard.propTypes = {
  _id: PropTypes.string.isRequired,
  barcode: PropTypes.string,
  createdAt: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  partNo: PropTypes.string.isRequired,
  retailPrice: PropTypes.number.isRequired,
  wholesalePrice: PropTypes.number.isRequired,
};

export default PartCard
