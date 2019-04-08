import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { withKnobs } from '@storybook/addon-knobs/react'
import PunchCard from './punch-card'
import { array, number } from '@storybook/addon-knobs/dist/react'
import { text } from '@storybook/addon-knobs/dist/base';

const weeks =
  //Sample array
  [
    { 'wName': 'Puncture', 'wValue': true },
    { 'wName': 'Brakes', 'wValue': true },
    { 'wName': 'Gears cleaning', 'wValue': false },
    { 'wName': 'Gears tuning', 'wValue': true },
    { 'wName': 'Wheel bearings', 'wValue': false },
    { 'wName': 'Forks and B/B', 'wValue': true }
  ]

const imgs = []
for (let i = 1; i <= 6; i++) {
  imgs.push('images/punch-card-img/' + i + '.jpg')
}

const weekValue = [] //Week's Values
const weekNum = [] //Week's Keys
const weekName = []

//populating values in arrays

for (let i = 0; i < weeks.length; i++) {
  weekValue.push(weeks[i]['wValue'])
  weekName.push(weeks[i]['wName'])
}
storiesOf('Punch-card', module)
  .addDecorator(withKnobs)
  .add('Punchcard', () => (
    <PunchCard
      weekNum={number('Total Week', weeks.length)}
      weekName={array('Week Name', weekName)}
      weekValue={array('Weeks Value', weekValue)}
      imgs={array('Images', imgs)}
    />
  ))
