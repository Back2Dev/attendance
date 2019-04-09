import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'
import { withKnobs } from '@storybook/addon-knobs/react'
import PunchCard from './punch-card'
import { array, number } from '@storybook/addon-knobs/dist/react'

const weeks =
  //Sample array
  [
    { name: 'Punctures', used: true, img: '/images/punctures.jpg' },
    { name: 'Gears cleaning', used: false, img: '/images/gears-cleaning.jpg' },
    { name: 'Gears tuning', used: true, img: '/images/gears-tuning.jpg' },
    { name: 'Wheel bearings', used: false, img: '/images/bearings.jpg' },
    { name: 'Brakes', used: true, img: '/images/brakes.jpg' },
    { name: 'Forks and B/B', used: true, img: '/images/forks.jpg' }
  ]

//populating values in arrays

const weekValue = weeks.map(item => item.used)
const weekName = weeks.map(item => item.name)
const imgs = weeks.map(item => item.img)

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
  .add('Punchcard false', () => (
    <PunchCard
      weekNum={number('Total Week', weeks.length)}
      weekName={array('Week Name', weekName)}
      weekValue={['false', 'false', 'false', 'false', 'false', 'false']}
      imgs={array('Images', imgs)}
    />
  ))
