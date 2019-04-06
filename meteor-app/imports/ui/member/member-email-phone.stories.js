// member-email-phone.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, boolean } from '@storybook/addon-knobs/react'

import member from '/imports/test/fake-member'

import MemberEmailPhone from './member-email-phone'

storiesOf('Member.Session', module)
  .addDecorator(withKnobs)

  .add(
    'Email & Phone',
    withInfo('Entry')(() => {
      const story = (
        <div style={{ maxWidth: '280px', textAlign: 'center' }}>
          <MemberEmailPhone
            loading={boolean('Loading', false)}
            email={member.email}
            mobile={member.mobile}
            save={action('save')}
          />
        </div>
      )
      return story
    })
  )
