import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'

import { Button, Icon, List, Image } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'
import './member-card-in.css'

const MemberCardIn = (props) => {

  const signOutClick = () => {
    props.history.push(`/${props._id}`)
  }

  return (
    <List.Item
      onClick={() => props.toggleStatus(props._id)}
      style={{textAlign: 'left'}}
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
            <Button onClick={signOutClick} compact icon={'sign out'}>
              Sign Out
            </Button>
          </div>
        }
      </List.Content>

    </List.Item >
  )

}

MemberCardIn.propTypes = {
  _id: PropTypes.string.isRequired,
  firstname: PropTypes.string.isRequired,
  lastname: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
  toggleStatus: PropTypes.func.isRequired,
  visibleStatus: PropTypes.string.isRequired,
  depart: PropTypes.func.isRequired,
}

export default withRouter(MemberCardIn)
