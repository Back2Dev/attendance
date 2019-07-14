import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import member from '/imports/test/fake-member'

import MemberVisitPinSet from './pin-set'
const Wrapper = props => <div style={{ maxWidth: '280px', textAlign: 'center' }}>{props.children}</div>

const match = {
  params: {
    id: '12344'
  }
}

storiesOf('Member.VisitPinSet nosnap', module)
  .addDecorator(withKnobs)

  .add(
    'Set PIN',
    withInfo('PIN Set')(() => {
      const story = (
        <Wrapper>
          <MemberVisitPinSet loading={boolean('Loading', false)} setPin={action('setPin')} />
        </Wrapper>
      )
      return story
    })
  )
