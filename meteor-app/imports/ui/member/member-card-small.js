import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import { Button, Icon, List, Image } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'

const MemberCardSmall = (props) => {

  return (
    <List.Item
      style={{textAlign: 'left'}}
      onClick={props.onCardClick.bind(props._id, props._id)}
      
    >
      <Image avatar src={"/images/avatars/" + props.avatar} />
      <List.Content style={{height: '80px'}}>
        {
          props.visibleStatus == props._id &&
          <div>
            <List.Header>
              {props.firstname} {props.lastname}
            </List.Header>
            <List.Description>
              <p>Arrived: {humaniseDate(props.lastIn)} ago </p>
            </List.Description>
            <Button compact icon={'sign out'} content={'Sign Out'} />
          </div>
        }
      </List.Content>
    </List.Item >
  )

}

MemberCardSmall.propTypes = {
  _id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
}

export default withRouter(MemberCardSmall)
