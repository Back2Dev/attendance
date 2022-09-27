import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {
  useAnswers,
  useSelectedPartValue,
  defaultPart,
  getDefaultColumn,
  getDefaultRow,
  usePartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { SingleInner } from './SingleInner'
import { MultipleInner } from './MultipleInner'
import { UploadInner } from './UploadInner'
import { TextInner } from './TextInner'
import { DropdownInner } from './DropdownInner'
import { LookupInner } from './LookupInner'
import { RatingInner } from './RatingInner'
import { GridInner } from './GridInner'
import { CalculationInner } from './CalculationInner'

import { useRecoilCallback } from 'recoil'
import {
  editPartState,
  editPartsState,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
import { Question } from '$sb/components/question/field'

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

const nonInnerType = ['paragraph', 'signature', 'geolocation', 'section']

const booleanOptionsType = ['optional', 'confirmPassword']

const checkIsBooleanType = (path) => {
  return booleanOptionsType.some((opt) => path.includes(opt))
}

const Inner = ({ question }) => {
  // const { add } = useAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  // const [qType, setQType] = useState(type ?? 'single')
  // const part = usePartValue(pid)

  const showMobileActions = isMobile && selectedPart === pid

  // useEffect(() => {
  //   setQType(question.type)
  // }, [question.type])

  // const setPropertyByValue = useRecoilCallback(
  //   ({ set }) =>
  //     ({ path, value = undefined, pid }) => {
  //       set(editPartState({ pid, path }), (property) => {
  //         if (value) {
  //           return value
  //         }
  //         if (property === undefined) {
  //           return checkIsBooleanType(path) ? true : ''
  //         }
  //         //if the text length is 0, do not set to undefined
  //         else if (value === '') {
  //           return ''
  //         } else {
  //           return undefined
  //         }
  //       })
  //     }
  // )

  // const updateCanvas = useRecoilCallback(({ set }) => ({ value: type }) => {
  //   set(editPartsState({ pid }), (property) => {
  //     return { ...property, type }
  //   })
  // })

  // const handleChange = ({ target: { value } }) => {
  //   setQType(value)
  //   setPropertyByValue({ pid, value, path: 'type' })
  //   //if type is section, set answers to an empty array, otherwise, set to default part
  //   setPropertyByValue({
  //     pid,
  //     value: nonInnerType.includes(value) ? [] : defaultPart.answers,
  //     path: 'answers',
  //   })

  //   if (value === 'grid') {
  //     setPropertyByValue({
  //       pid,
  //       value: {
  //         columns: [
  //           { ...getDefaultColumn(), field: 'name', editable: false },
  //           getDefaultColumn(),
  //         ],
  //         rows: [getDefaultRow()],
  //       },
  //       path: 'answers[0]',
  //     })
  //   }

  //   if (value === 'calculation') {
  //     setPropertyByValue({
  //       pid,

  //       value: {
  //         target1: 'integer',
  //         targetValue1: 0,
  //         operator: '+',
  //         target2: 'integer',
  //         targetValue2: 0,
  //       },
  //       path: 'answers[0].expression',
  //     })
  //   }

  //   //need to rerender canvas if new section is added
  //   if (value === 'section') {
  //     updateCanvas({ value })
  //   }
  // }

  return (
    <Fragment>
      {/* <Question
        question={question}
      /> */}

      {!nonInnerType.includes(question.type) &&
        React.createElement(
          (options.find(({ value }) => value === question.type) || options[0]).component,
          {
            question,
          }
        )}

      {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          // onClick={() => add()}
        >
          New item
        </Button>
      )}
    </Fragment>
  )
}

Inner.propTypes = {
  /** undefined instance part id */
  // pid: PropTypes.string.isRequired,
  /** question type, by default is "single"*/
  type: PropTypes.string,
}

Inner.defaultProps = {
  initialList: [''],
}

export { Inner }
