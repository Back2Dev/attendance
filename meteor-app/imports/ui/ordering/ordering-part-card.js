import React from 'react'
import PropTypes from 'prop-types';
import { Container, Divider, Card, Icon, Image, Label, Button } from 'semantic-ui-react'
import '/imports/ui/ordering/ordering-part-card.css'

const PartCard = (props) => {
  const {
    _id,
    barcode,
    createdAt,
    desc,
    imageUrl,
    partNo,
    retailPrice,
    status,
    wholesalePrice
  } = props.part

  if (!barcode) {
    barcode = "n/a"
  }

  return (
    <Card className={props.className}
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

        <Card.Header>Price ${retailPrice}</Card.Header>
      </Card.Content>
    </Card>
  )
}

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
