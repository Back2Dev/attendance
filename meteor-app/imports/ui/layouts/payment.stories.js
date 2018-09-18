import React from 'react'
import { storiesOf } from '@storybook/react'
import Payment from './payment.js'

storiesOf('Layouts.Payment', module)

  .add('Payment', (() => {
    const story = (
      <Payment />
    )
    return story
  }))
