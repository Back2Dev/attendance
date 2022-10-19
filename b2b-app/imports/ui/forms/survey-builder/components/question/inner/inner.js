import React, { Fragment } from 'react'
import { SingleInner } from './SingleInner'
import { MultipleInner } from './MultipleInner'
import { UploadInner } from './UploadInner'
import { TextInner } from './TextInner'
import { DropdownInner } from './DropdownInner'
import { LookupInner } from './LookupInner'
import { RatingInner } from './RatingInner'
import { GridInner } from './GridInner'
import { CalculationInner } from './CalculationInner'
import { Question } from '$sb/components/question/field'
import PropTypes from 'prop-types'

const options = [
  { label: 'Single', value: 'single', component: SingleInner },
  { label: 'Multiple', value: 'multiple', component: MultipleInner },
  { label: 'Upload', value: 'upload', component: UploadInner },
  { label: 'Text', value: 'text', component: TextInner },
  { label: 'Section', value: 'section', component: null },
  { label: 'Dropdown', value: 'dropdown', component: DropdownInner },
  { label: 'Lookup', value: 'lookup', component: LookupInner },
  { label: 'Geolocation', value: 'geolocation', component: null },
  { label: 'Rating', value: 'rating', component: RatingInner },
  { label: 'Grid', value: 'grid', component: GridInner },
  { label: 'Calculation', value: 'calculation', component: CalculationInner },
]

const questionOnlyType = ['paragraph', 'signature', 'geolocation', 'section']

const Inner = ({ question, onQuestionChange, ...props }) => {
  return (
    <Fragment>
      <Question question={question} onQuestionChange={onQuestionChange} />

      {!questionOnlyType.includes(question.type) &&
        React.createElement(
          (options.find(({ value }) => value === question.type) || options[0]).component,
          {
            question,
            onQuestionChange,
            ...props,
          }
        )}
    </Fragment>
  )
}

Inner.propTypes = {
  question: PropTypes.object.isRequired,
  onQuestionChange: PropTypes.func.isRequired,
}

export { Inner }
