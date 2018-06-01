import React from 'react'
import { storiesOf } from '@storybook/react'
import MemberAddSuccess from '/imports/ui/member/member-add-success'

storiesOf('Member.Add.Iframe', module)

  .add('Success', () => {
    const story = (
      <MemberAddSuccess />
    )
    return story
  })
