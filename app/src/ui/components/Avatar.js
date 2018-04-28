import React from 'react'
import PropTypes from 'prop-types'

const Avatar = (props) => {
  const {
    _id,
    firstName,
    lastName,
    fileName,
    isCheckedIn
  } = props

  let borderColour = isCheckedIn ? 'LimeGreen' : 'grey'
  console.log('bc '+borderColour)
  return (
    <div className="avcontainer raised item" key={_id} >
      <img
          className={'ui avatar image small'}         
          src={"/images/avatars/" + fileName}
          style={{border: '5px solid ' + borderColour }} 
          >
      </img>
      <div className={'middle aligned content'}>
        <b className={'header'}>{firstName} {lastName}</b>
      </div>
      <br/>   
    </div>
  )
}

Avatar.propTypes = {
  _id: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  isCheckedIn: PropTypes.bool.isRequired
}

Avatar.defaultProps = {
  isCheckedIn: true  
}

export default Avatar