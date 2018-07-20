import React from 'react'
import { Table } from 'semantic-ui-react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import orderItem from '/imports/test/fake-order-item'

import CartListItem from './cart-list-item'


storiesOf('Cart.ListItem', module)
  .addDecorator(withKnobs)
  .add('Cart List Item', (() => {
    const story = (
      <div>
        {/* Emulate a table so the Item can be rendered with proper formatting */}
        <Table size='large' celled compact='very' singleLine>
          <Table.Body>
            <CartListItem
              {...orderItem}
            />
          </Table.Body>
        </Table>
      </div>
    )
    return story;
  }))