import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import StoryRouter from 'storybook-router'
import ServiceCard from './assessment-service-card'

const minorService = ["Check functionality/adjust brakes & gears", "Check hubs for wear/play", "Remove, clean & oil chain", "Clean rear cassette", "Check tyre pressure", "Lube deraileurs", "Check/tighten bolts on cranks, headset, wheels and bottom bracket", "Check/tighten bolts on cranks, headset, wheels and bottom bracket" ]

const majorService = ["Check wheels are true", "Clean and re-grease wheel bearings", "Clean and re-grease headset", "Clean and re-grease bottom bracket", "Clean and re-grease seat post & clamps"]

const minorServiceTitle = "Minor Serivce"
const minorServicePrice = "60"
const majorServiceTitle = "Major Serivce"
const majorServicePrice = "120"

storiesOf('Assessment.ServiceCard', module)
  // .addDecorator(StoryRouter())

  .add('Minor Service Card', (() => {

    const story = (
      <div>
        <ServiceCard
          serviceChoice= {minorService}
          serviceTitle= {minorServiceTitle}
          servicePrice= {minorServicePrice}
          cardColor="#00C646"
        />
      </div>
    )
    return story
  }))
  .add('Major Service Card', (() => {
    const story = (
      <div>
      <ServiceCard
        serviceChoice= {majorService}
        serviceTitle= {majorServiceTitle}
        servicePrice= {majorServicePrice}
        cardColor="#0081D3"
      />
    </div>
    )
    return story 
  }))