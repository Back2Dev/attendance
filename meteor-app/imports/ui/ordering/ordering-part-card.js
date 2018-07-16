import React from 'react'
import PropTypes from 'prop-types';
import { Container, Divider, Card, Icon, Image, Label } from 'semantic-ui-react'

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
    <Card style={{ textAlign: 'center' }}
      className={props.className}
      key={_id}
    >
      <Image src={imageUrl} />
      <Card.Content>
        <Card.Header>Part # {partNo}</Card.Header>
        <Card.Meta>
          <span className='date'>{barcode}</span>
        </Card.Meta>
        <Card.Description>{desc}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <a>
          Price ${retailPrice}
        </a>
      </Card.Content>



      {/* <Image src={imageUrl} />
      <Card.Content>

        <Divider />

        {desc}

        <Divider />

        Price ${retailPrice}
      </Card.Content> */}
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
