import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import { BrowserRouter as Router } from 'react-router-dom'
import AssessmentAdd from './assessment-add'

const members = [{ name: 'Mark' }, { name: 'Mike' }]
const serviceItems = [
  {
    name: 'Front Tyre (new)',
    price: 1000
  },
  {
    name: 'Rear Tyre (new)',
    price: 1000
  },
  {
    name: 'Brake pads - Dual pivot',
    price: 1500
  },
  {
    name: 'Brake pads - V brakes',
    price: 1000
  },
  {
    name: 'Tube',
    price: 800
  },
  {
    name: 'Tube & fitting',
    price: 2000
  },
  {
    name: 'Cable x 1',
    price: 500
  },
  {
    name: 'Cables x 2',
    price: 1000
  },
  {
    name: 'Cables x 3',
    price: 1500
  },
  {
    name: 'Cables x 4',
    price: 2000
  }
]

const myServices = [
  {
    name: 'Check functionality/adjust brakes and gears',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Check hubs for wear/play',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Remove, clean and oil chain',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Clean rear cassette',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Check tyre pressure',
    price: 500,
    package: 'Minor'
  },
  {
    name: 'Lube deraileurs',
    price: 500,
    package: 'Minor'
  },
  {
    name: 'Check/tighten bolts on cranks, headset, wheels and bottom bracket',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Check wheels are true',
    price: 1200,
    package: 'Major'
  },
  {
    name: 'Clean and re-grease wheel bearings',
    price: 1200,
    package: 'Major'
  },
  {
    name: 'Clean and re-grease headset',
    price: 1200,
    package: 'Major'
  },
  {
    name: 'Clean and re-grease bottom bracket',
    price: 1200,
    package: 'Major'
  },
  {
    name: 'Clean and re-grease seat post and clamps',
    price: 1200,
    package: 'Major'
  }
]

storiesOf('Assessment.Add', module)
  .addDecorator(withInfo)
  .addDecorator(withKnobs)

  .add(
    'AssessmentAdd',
    () => {
      const story = (
        <Router>
          <div>
            <p>Use Knobs to select step</p>
            <AssessmentAdd
              services={myServices}
              serviceItems={serviceItems}
              members={members}
              step={number('Step', 0)}
              addAssessment={action('addAssessment')}
              setAssessment={action('setAssessment')}
              error={false}
              success
              message="OK"
              resetId={action('resetId')}
            />
          </div>
        </Router>
      )
      return story
    },
    { info: 'Add Assessment' }
  )
