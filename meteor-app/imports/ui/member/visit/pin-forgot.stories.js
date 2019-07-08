import React from 'react'
import ReactDOM from 'react-dom'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

import { Link, Router, browserHistory } from 'react-router-dom'
import { Grid, Container, Segment } from 'semantic-ui-react'
import member from '/imports/test/fake-member'

import MemberVisitPinForgot from './pin-forgot'

storiesOf('Member.Session', module).add(
  'Forgot PIN',
  withInfo('Here/Absent')(() => {
    const story = (
      <div style={{ maxWidth: '280px' }}>
        <MemberVisitPinForgot
          onPinReminderSent={action('sent PIN reminder')}
          forgotPin={action('forgotten PIN')}
        />
      </div>
    )
    return story
  })
)
