import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { List, Image } from 'semantic-ui-react'

const MemberCardSmall = (props) => {
  const { _id, avatar, onCardClick } = props
  return (
    <List.Item
      onClick={() => onCardClick(_id)}
    >
      <Image size='tiny' avatar spaced src={"/images/avatars/" + avatar} style={{ width: '50px', border: '3px solid white' }}/>
    </List.Item>
  )
}

MemberCardSmall.propTypes = {
  _id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  onCardClick: PropTypes.func.isRequired,
}

export default withRouter(MemberCardSmall)
