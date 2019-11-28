import React from 'react'
import { storiesOf } from '@storybook/react'
import MembershipCard from "./member-card"

const member = {
  name: "MANH HUY VO",
  dob: "16/06/1997",
  address: "42 Myrtle St, Springvale",
  avatar: './images/avatars/test10.png',
  startDate: '20/06/1997',
  expiryDate: '20/06/2019',
  memberType: '6 MONTHS'
}//create an object that has personal data

storiesOf('MyMember', module)

  .add('MembershipCard', () => {
    const story = (
      <MembershipCard
        member={member}
      />
    )
    return story
  })