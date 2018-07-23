import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import member from '/imports/test/fake-member'
import { Icon } from 'semantic-ui-react'
import CartAddIcon from './cart-add-icon'

storiesOf('Cart Icon', module)
  .addDecorator(withKnobs)
  .add('Cart', (() => {
    const story = (
      <CartAddIcon
      onClick={action('clicked', 'test')}
      noOfParts={number('Number of Parts in Order', 0)}
      />
    )
   
    return story;
  }))