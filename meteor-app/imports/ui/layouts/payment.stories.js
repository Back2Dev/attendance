import React from 'react'
import { storiesOf } from '@storybook/react'

storiesOf('Layouts.Payment', module)

  .add('Payment', (() => {

    const story = (
      <div>
        <title>Back 2 Bikes | Payment</title>
        <h1>Welcome to B2B Payment!</h1>
      </div>
    )
    return story
  }))