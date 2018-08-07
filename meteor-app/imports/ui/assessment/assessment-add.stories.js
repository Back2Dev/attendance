import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import { BrowserRouter as Router } from 'react-router-dom'

import AssessmentAdd from './assessment-add'

const myServices = [{
  name: 'Check functionality/adjust brakes and gears',
  price: 1000,
  package: 'Minor',
},
{
  name: 'Check hubs for wear/play',
  price: 1000,
  package: 'Minor',
},
{
  name: 'Remove, clean and oil chain',
  price: 1000,
  package: 'Minor',
},
{
  name: 'Clean rear cassette',
  price: 1000,
  package: 'Minor',
},
{
  name: 'Check tyre pressure',
  price: 500,
  package: 'Minor',
},
{
  name: 'Lube deraileurs',
  price: 500,
  package: 'Minor',
},
{
  name: 'Check/tighten bolts on cranks, headset, wheels and bottom bracket',
  price: 1000,
  package: 'Minor',
},
{
  name: 'Check wheels are true',
  price: 1200,
  package: 'Major',
},
{
  name: 'Clean and re-grease wheel bearings',
  price: 1200,
  package: 'Major',
},
{
  name: 'Clean and re-grease headset',
  price: 1200,
  package: 'Major',
},
{
  name: 'Clean and re-grease bottom bracket',
  price: 1200,
  package: 'Major',
},
{
  name: 'Clean and re-grease seat post and clamps',
  price: 1200,
  package: 'Major',
}]

storiesOf('Assessment.Add', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())
  

  .add('AssessmentAdd', withInfo('Add Assessment')(() => {
    const story = (
      <Router>
        <div><p>Use Knobs to select step</p>
          <AssessmentAdd
            services={myServices}
            step={number("Step", 3)}
            addAssessment={action("addAssessment")}
            error={false}
            success={true}
            message="OK"
            resetId={action("resetId")}
          />
        </div>
      </Router>
    )
    return story
  }))