import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import { Button } from 'semantic-ui-react'
import EditDelete from './cart-edit-delete-button'

storiesOf('Cart', module)
  .addDecorator(withKnobs)
  .add('Edit-Delete Button', (() => {
    const story = (
      <EditDelete
        onClick={action('clicked', 'test')}
      />
    )
    return story
  }))