// ordering-part-card.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Welcome } from '@storybook/react/demo'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import part from '/imports/test/fake-part'

import Card from './ordering-part-card'


storiesOf('Part.Card', module)
  .addDecorator(withKnobs)
  .add('Card', withInfo('part testing')(() => {
    const story = (
      <div><p>Part Card with faker </p>
        <Card
          {...part}
        />
      </div>
    )
    return story;
  }))