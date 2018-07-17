// member-add.stories.js
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
// import { Welcome } from '@storybook/react/demo'
// import { withInfo } from '@storybook/addon-info'
import { withKnobs, number, boolean, select } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'

import schemas from '/imports/ui/config/bike-assessment-schemas'
import AssessmentAddControl from './assessment-add-control'

storiesOf('Assessment.Add', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())

  .add('AssessmentAddControl', (() => {
// NB Select control only works with strings
    let step = number("Step",1)

    const move = (delta) => {
      try {
        action("move")(delta)
        action('step')(step)
  // Updating the step does cause a refresh, methinks it should
        step = step + delta
      } catch(error) {
        console.log("Error", error)
      }
    }
    const story = (
      <div><p>Use Knobs to select step, currently on step {step}</p>
        <AssessmentAddControl
          step={step}
          backStep={() => move(-1)}
          forwardStep={() => move(1)}
          onSubmit={action("submit")}
          totalSteps={5}
          resetId={action("resetId")}
        />
      </div>
    )
    return story
  }))