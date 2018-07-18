import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withInfo } from '@storybook/addon-info'
import { withKnobs, number } from '@storybook/addon-knobs/react'
import StoryRouter from 'storybook-router'
import { BrowserRouter as Router } from 'react-router-dom'

import AssessmentAdd from './assessment-add'

storiesOf('Assessment.Add', module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())

  .add('AssessmentAdd', withInfo('Add Assessment')(() => {
    const story = (
      <Router>
        <div><p>Use Knobs to select step</p>
          <AssessmentAdd
            step={number("Step",0)}
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