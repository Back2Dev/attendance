import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, boolean } from '@storybook/addon-knobs/react'

import MemberVisitPinSet from './pin-set'
const Wrapper = props => <div style={{ maxWidth: '280px', textAlign: 'center' }}>{props.children}</div>

storiesOf('Member.VisitPinSet nosnap', module)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)

  .add(
    'Set PIN',
    () => {
      const story = (
        <Wrapper>
          <MemberVisitPinSet loading={boolean('Loading', false)} setPin={action('setPin')} />
        </Wrapper>
      )
      return story
    },
    { info: 'PIN set' }
  )
