import React from 'react'
import { storiesOf } from '@storybook/react'
import MemberAddSuccess from '/imports/ui/member/member-add-success'
import member from '/imports/test/fake-member'

storiesOf('Member.Add.Iframe', module)

  .add('Success', () => {
    const story = (
      <MemberAddSuccess
        member={member}
      />
    )
    return story
  })
