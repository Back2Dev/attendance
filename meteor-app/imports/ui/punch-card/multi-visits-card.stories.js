import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs/react'
import { number, array } from '@storybook/addon-knobs/dist/react'
import MultiVisitsCard from './multi-visits-card'

storiesOf('Punch-card', module)
  .addDecorator(withKnobs)
  .add('Multi-Visits-Card', () => (
    <MultiVisitsCard totalVisits={number("Total Visits", 12)} usedVisits={number("Used Visits", 3)} />
  ))
