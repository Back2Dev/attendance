import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Grid, Image } from 'semantic-ui-react'
import './styles/member-card-styles.css'

const dateFormat = dateValue => {
  return moment(dateValue).format('Do MMM YYYY')
}

const recentFormat = dateValue => {
  return moment(dateValue).fromNow()
}

function MembershipCard(props) {
  const { name, mobile, email, avatar, lastIn, expiry, memberType } = props.member
  return (
    <div className="ui grid member-card-container">
      <div className="sixteen wide column ui grid card-header">
        <div className="sixteen wide column">{name}</div>
      </div>
      <div className="ui grid sixteen wide column card-content-container">
        <div className="six wide column card-avatar-container">
          <img className="card-avatar-img" src={'/images/avatars/' + avatar} />
        </div>
        <div className="ui grid ten wide column card-details-container">
          <div className="eight wide column card-details-attributes title">Last seen</div>
          <div className="eight wide column card-details-attributes info">{recentFormat(lastIn)}</div>
          <div className="eight wide column card-details-attributes title">Email</div>
          <div className="eight wide column card-details-attributes info">{email}</div>
          <div className="eight wide column card-details-attributes title">Mobile</div>
          <div className="eight wide column card-details-attributes info">{mobile}</div>
          <div className="eight wide column card-details-attributes title">Expiry Date</div>
          <div className="eight wide column card-details-attributes info">{dateFormat(expiry)}</div>
          <div className="eight wide column card-details-attributes title">Member Type</div>
          <div className="eight wide column card-details-attributes info">{memberType}</div>
        </div>
      </div>
    </div>
  )
}
/*Object.keys(props.member).map(item=><Typography variant="subtitle1" color="textSecondary">{props.member[item]}</Typography>)*/
export default MembershipCard
