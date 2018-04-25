import React from 'react'
// import PropTypes from 'prop-types'
/*
Avatar.propTypes = {
  _id: PropTypes.string.isRequired,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  isCheckedin: PropTypes.bool.isRequired
}
*/
const Avatar = (props) => {
  const {
    _id,
    firstName,
    lastName,
    fileName,
    isCheckedin
  } = props

  let borderColour = isCheckedin ? 'LimeGreen' : 'grey'
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

export default Avatar