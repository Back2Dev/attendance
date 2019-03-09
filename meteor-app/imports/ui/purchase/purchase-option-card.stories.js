// member-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

const cardInfo = {
  name: '10 visit pass',
  description: '10 visits, usable at any of our evening sessions '
}

import PurchaseCard from './purchase-option-card'

storiesOf('Purchase', module)
  .addDecorator(withKnobs)

  .add('Card', () => {
    const story = (
      <div>
        <PurchaseCard {...cardInfo} />
      </div>
    )
    return story
  })
