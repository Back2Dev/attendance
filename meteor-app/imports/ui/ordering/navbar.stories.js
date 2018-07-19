import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import Navbar from './navbar'
import StoryRouter from 'storybook-router'

storiesOf('Navbar', module)
  .addDecorator(StoryRouter())
  .add('Navbar', withInfo('part testing')(() => {
    const story = (
      <div><p>Navbar </p>
        <Navbar
        />
      </div>
    )
    return story;
  }))