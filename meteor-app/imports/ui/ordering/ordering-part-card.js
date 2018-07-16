import React from 'react'
import PropTypes from 'prop-types';
import { Card, Icon, Image, Label } from 'semantic-ui-react'

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

  return (
    <Card className='part-card' key={_id}>
      <Image src={imageUrl} />
      <Card.Content>
        Part Num: {partNo}
        Description: {desc}
        Price: {retailPrice}
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
