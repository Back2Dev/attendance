import React from 'react';
import PropTypes from 'prop-types';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Image } from 'semantic-ui-react';
import './styles/member-card-styles.css';

function MembershipCard(props) {
  return (
    <div class="ui grid member-card-container">
      <div class="sixteen wide column ui grid card-header">
        <div class="sixteen wide column">{props.member.name}</div>
      </div>
      <div class="ui grid sixteen wide column card-content-container">
        <div class="six wide column card-avatar-container"><img class="card-avatar-img" src={props.member.avatar}></img></div>
        <div class="ui grid ten wide column card-details-container">
          <div class="eight wide column card-details-attributes title">Date Of Birth</div>
          <div class="eight wide column card-details-attributes info">{props.member.dob}</div>
          <div class="eight wide column card-details-attributes title">Address</div>
          <div class="eight wide column card-details-attributes info">{props.member.address}</div>
          <div class="eight wide column card-details-attributes title">Start Date</div>
          <div class="eight wide column card-details-attributes info">{props.member.startDate}</div>
          <div class="eight wide column card-details-attributes title">Expiry Date</div>
          <div class="eight wide column card-details-attributes info">{props.member.expiryDate}</div>
          <div class="eight wide column card-details-attributes title">Member Type</div>
          <div class="eight wide column card-details-attributes info">{props.member.memberType}</div>
        </div>
      </div>
    </div>
  );
}
/*Object.keys(props.member).map(item=><Typography variant="subtitle1" color="textSecondary">{props.member[item]}</Typography>)*/
export default MembershipCard
