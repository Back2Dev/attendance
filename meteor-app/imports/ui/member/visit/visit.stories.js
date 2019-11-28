// member/visit.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import member from '/imports/test/fake-member'
member.pin = '0000'

import MemberVisit from './visit'

const match = {
  params: {
    id: '12344'
  }
}

const updateMember = () => {
  const options = {
    isHere: boolean('Present', false),
    isSuper: boolean('Is Supervisor', true),
    sessionCount: boolean('Is Newbie', true) ? 1 : 25,
    pin: text('PIN', '0000'),
    email: text('Email', 'me@me.com'),
    mobile: text('Mobile', '0499 911')
  }
  return Object.assign(member, options)
}

storiesOf('Member.Session', module)
  // .addDecorator(StoryRouter())
  .addDecorator(withInfo)
  .addDecorator(withKnobs)

  .add(
    'Sign in',
    () => {
      const story = (
        <div>
          <p>
            When component is unmounted, the <code>clearPin</code> function should run.
          </p>
          {boolean('mounted', true) && (
            <MemberVisit
              loading={boolean('Loading', false)}
              member={updateMember()}
              recordVisit={action('record visit')}
              cancelClick={action('cancel')}
              memberHasOwnPin={true}
              setPinSuccess={boolean('successfully set pin', false)}
              clearPin={action('clear pin')}
              // checkPin={(pin) => action('checking PIN: ' + pin)()}
              onSubmitPin={pin => action('setting custom pin ', pin)()}
              validPin={false}
              forgotPin={action('forgotPin')}
              setPin={action('setPin')}
              save={action('save')}
            />
          )}
        </div>
      )
      return story
    },
    { info: 'Here/absent' }
  )
