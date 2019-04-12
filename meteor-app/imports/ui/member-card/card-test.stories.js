import React from 'react';
import { storiesOf } from '@storybook/react'
import CardTest from "./card-test"



const member={name:"Manh Huy Vo", dob:"16/06/1997", mobile:"0452597206"} //create an object that has personal data

storiesOf('CardTestMember', module)

  .add('CardTest', () => {
    const story = (
      <CardTest
        member={member}
      />
    )
    return story
  })