import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { Card } from 'semantic-ui-react'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'
import PunchCard from './punch-card'

storiesOf('Punch-card', module)
  .addDecorator(withKnobs)
  .add('Punchcard', () => <PunchCard visits={number('Visits', 10)} numVisits={number('Used', 3)} />)
