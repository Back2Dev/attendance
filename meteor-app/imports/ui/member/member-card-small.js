import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { List, Image } from 'semantic-ui-react'

const MemberCardSmall = (props) => {

  const { _id, firstname, lastname, avatar, isHere, sessions = [], lastIn = null } = props

  return (
    <List.Item
      style={{ padding: '20px' }}
      onClick={() => props.onCardClick(_id)}
    >
      <Image size='tiny' spaced avatar src={"/images/avatars/" + props.avatar} />
    </List.Item >
  )

}

MemberCardSmall.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default withRouter(MemberCardSmall)
