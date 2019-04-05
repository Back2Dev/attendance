// member-visit.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import StoryRouter from 'storybook-router'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import member from '/imports/test/fake-member'

import MemberVisitPinSet from './member-visit-pin-set'

const match = {
  params: {
    id: '12344'
  }
}

storiesOf('Member.Session', module)
  .addDecorator(StoryRouter())
  .addDecorator(withKnobs)

  .add(
    'Set PIN',
    withInfo('PIN Set')(() => {
      const story = (
        <div style={{ maxWidth: '280px', textAlign: 'center' }}>
          <MemberVisitPinSet loading={boolean('Loading', false)} setPin={action('setPin')} />
        </div>
      )
      return story
    })
  )
