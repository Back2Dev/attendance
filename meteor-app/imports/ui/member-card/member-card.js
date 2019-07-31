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
  const { name, mobile, email, avatar, lastIn, expiry, status, subsType, remaining } = props.member
  return (
    <div className="ui grid member-card-container">
      <div className="sixteen wide column ui grid card-header">
        <div className="sixteen wide column">{name}</div>
      </div>
      <div className="ui grid sixteen wide column card-content-container">
        <div className="four wide column card-avatar-container">
          <img className="card-avatar-img" src={'/images/avatars/' + avatar} />
        </div>
        <div className="ui grid twelve wide column card-details-container">
          <div className="sixteen wide column card-details-attributes title">Last seen {recentFormat(lastIn)}</div>
          <div className="sixteen wide column card-details-attributes title">Email {email}</div>
          <div className="sixteen wide column card-details-attributes title">Mobile {mobile}</div>
          {subsType !== 'casual' && (
            <div className="sixteen wide column card-details-attributes title">Expires {dateFormat(expiry)}</div>
          )}
          <div className="sixteen wide column card-details-attributes title">
            Member Type {subsType !== 'casual' ? status : ''} {subsType} {subsType === 'pass' ? remaining : ''}
          </div>
        </div>
      </div>
    </div>
  )
}
/*Object.keys(props.member).map(item=><Typography variant="subtitle1" color="textSecondary">{props.member[item]}</Typography>)*/
export default MembershipCard
