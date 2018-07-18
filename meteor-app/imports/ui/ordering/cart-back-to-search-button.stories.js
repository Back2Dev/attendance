import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import { Icon, Button } from 'semantic-ui-react'
import BackToSearch from './cart-back-to-search-button'

storiesOf('Cart', module)
  .addDecorator(withKnobs)
  .add('Back To Search button', (() => {
    const story = (
      <BackToSearch
        onClick={action('clicked', 'test')}
      />
    )
    return story
  }))
