import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, number } from '@storybook/addon-knobs/react'

import AssessmentAddControl from './assessment-add-control'

storiesOf('Assessment.Add', module)
  .addDecorator(withKnobs)

  .add('AssessmentAddControl', () => {
    // NB Select control only works with strings
    let step = number('Step', 1)

    const move = delta => {
      try {
        action('move')(delta)
        action('step')(step)
        step = step + delta
      } catch (error) {
        console.error('Error', error)
      }
    }
    const story = (
      <div>
        <p>Use Knobs to select step, currently on step {step}</p>
        <AssessmentAddControl
          step={step}
          backStep={() => move(-1)}
          forwardStep={() => move(1)}
          onSubmit={action('submit')}
          totalSteps={5}
          resetId={action('resetId')}
        />
      </div>
    )
    return story
  })
