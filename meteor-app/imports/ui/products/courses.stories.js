import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react'

const courseInfo = {
  img: '/images/gym.jpg',
  title: 'awesome course similar to awesome sauce, but a course',
  startDate: '2019-02-18T16:00:00Z',
  endDate: '2019-03-18T16:00:00Z',
  description: '10 visits, usable at any of our evening sessions ',
}

import Courses from './courses'

storiesOf('Courses', module)
  .addDecorator(withKnobs)

  .add('Courses Card', () => {
    const story = (
      <div>
        <Courses {...courseInfo} />
      </div>
    )
    return story
  })
