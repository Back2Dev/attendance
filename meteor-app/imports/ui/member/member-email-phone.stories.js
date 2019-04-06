// member-email-phone.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, boolean } from '@storybook/addon-knobs/react'

import member from '/imports/test/fake-member'

import MemberEmailPhone from './member-email-phone'

const Wrapper = props => <div style={{ maxWidth: '280px', textAlign: 'center' }} />

storiesOf('Member.Session', module)
  .addDecorator(withKnobs)

  .add(
    'Email & Phone',
    withInfo('Entry')(() => {
      const story = (
        <Wrapper>
          <MemberEmailPhone
            loading={boolean('Loading', false)}
            email={member.email}
            mobile={member.mobile}
            save={action('save')}
          />
        </Wrapper>
      )
      return story
    })
  )
