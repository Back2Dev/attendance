import React from 'react'
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'
import { Icon, Label, List, Image } from 'semantic-ui-react'

const MemberCardSmall = (props) => {
  const { _id, avatar, onCardClick, name } = props
  const shortName = (function () {
    const names = name.split(' ')
    return names[1]
      ? `${names[0]} ${names[1][0]}`
      : `${names[0]}`
  })(name)

  return (
    <List.Item
      style={{
        textAlign: 'center',
        marginBottom: '10px',
        width: '100%',
      }}
    >
      <Image size='tiny' avatar spaced src={"/images/avatars/" + avatar} style={{ border: '3px solid white' }} />
      <div>
        <Label size='big'>
          {shortName}
        </Label>
      </div>
    </List.Item>
  )
}

MemberCardSmall.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
}

export default withRouter(MemberCardSmall)
