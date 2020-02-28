import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import AssessmentChecklist from './AssessmentWHOCarl'

storiesOf('Assessment.Carl', module).add('Carl', () => {
  const story = <AssessmentChecklist />
  return story
})
