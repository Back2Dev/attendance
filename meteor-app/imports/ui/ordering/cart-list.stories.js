// member-card.stories.js
import React from 'react'
import { Table } from 'semantic-ui-react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import order from '/imports/test/fake-order'

import CartList from './cart-list'


storiesOf('Cart.List', module)
  .addDecorator(withKnobs)

  .add('Cart List', (() => {
    const story = (
      <div>
        <CartList
          {...order}
        />
      </div>
    )
    return story;
  }))
