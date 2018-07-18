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

<<<<<<< HEAD
        <Card.Header>Price ${retailPrice}</Card.Header>
=======
        <div className='price-container' >
          <b>${retailPrice}</b>
          <Button className='part-add-cart-button' floated='right'>Add To Cart</Button>
        </div>
>>>>>>> dc740869df08c24d83ba65337baa62b32971fbf7
      </Card.Content>
    </Card>
  )
}

<<<<<<< HEAD
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
=======
// PartsCard.propTypes = {

//   // _id:PropTypes.string.isRequired,
//   // barcode:,
//   // createdAt:,
//   // desc:,
//   // imageUrl:,
//   // partNo:,
//   // retailPrice:,
//   // status:,
//   // wholesalePrice:



//   // className: PropTypes.string,
//   // _id: PropTypes.string.isRequired,
//   // name: PropTypes.string.isRequired,
//   // avatar: PropTypes.string.isRequired,
//   // isHere: PropTypes.bool.isRequired,
//   // sessions: PropTypes.array.isRequired,
//   // lastIn: PropTypes.object,
//   // sessionCount: PropTypes.number.isRequired,
// };

export default PartCard
>>>>>>> dc740869df08c24d83ba65337baa62b32971fbf7
