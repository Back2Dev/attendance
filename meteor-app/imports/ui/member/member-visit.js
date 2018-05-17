import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import { Card, Grid, Image, Button } from 'semantic-ui-react'
import MemberCard from './member-card'
import MemberCardLoading from './member-card-loading'

const MemberVisit = (props) => {
  if (props.loading) {
    return (
      <Grid centered style={{ height: '100%' }} verticalAlign='middle' textAlign='center'>
        <Grid.Column>
          <Card.Group centered>
            <MemberCardLoading />
          </Card.Group>
        </Grid.Column>
      </Grid>
    )
  }

  const { member, recordVisit } = props

  const updateStatus = () => {
    recordVisit()
    props.history.goBack()
  }

  const cancelClick = () => {
    props.history.goBack()
  }

  return (
    <Grid centered style={{ height: '100%' }} verticalAlign='middle' textAlign='center'>
      <Grid.Column>
        <Card.Group centered>
          <MemberCard {...member}>
            <Button>Half Day</Button>
            <Button>Full Day</Button>
          </MemberCard>
        </Card.Group>
      </Grid.Column>
    </Grid>
  )
}

MemberVisit.propTypes = {
  // _id: PropTypes.string.isRequired,
  // firstname: PropTypes.string.isRequired,
  // lastname: PropTypes.string.isRequired,
  // avatar: PropTypes.string.isRequired,
  // isHere: PropTypes.bool.isRequired,
  // sessions: PropTypes.array.isRequired,
  // lastIn: PropTypes.object,
  recordVisit: PropTypes.func.isRequired,
};

export default MemberVisit

// <Card key={_id}>
//         <Image src={"/images/avatars/" + avatar} />
//         <Card.Content>
//           <Card.Header>
//             {firstname} {lastname}
//           </Card.Header>
//           <Button.Group>
//             <Button onClick={cancelClick}>Cancel</Button>
//             <Button.Or />
//             <Button
//               onClick={updateStatus}
//               positive>
//               {
//                 isHere
//                   ? 'Sign Out'
//                   : 'Sign In'
//               }
//             </Button>
//           </Button.Group>
//         </Card.Content>
//       </Card>