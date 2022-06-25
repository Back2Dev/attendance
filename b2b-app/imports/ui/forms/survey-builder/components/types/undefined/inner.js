import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {
  useUndefinedAnswers,
  useSelectedPartValue,
  defaultPart,
  usePartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import {
  SingleInner,
  MultipleInner,
  UploadInner,
  TextInner,
  SectionInner,
} from '$sb/components/types/undefined/type-inner'
import { useRecoilCallback, useRecoilState } from 'recoil'
import { editPartState } from '/imports/ui/forms/survey-builder/recoil/atoms'
import { Question } from './question'

const options = [
  { label: 'Single', value: 'single', component: SingleInner },
  { label: 'Multiple', value: 'multiple', component: MultipleInner },
  { label: 'Upload', value: 'upload', component: UploadInner },
  { label: 'Text', value: 'text', component: TextInner },
  { label: 'Section', value: 'section', component: SectionInner },
]

const UndefinedInner = ({ pid, type }) => {
  const { add } = useUndefinedAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const [qType, setQType] = useState(type ?? 'single')

  const part = usePartValue(pid)
  // console.log('pid', pid, part)
  const showMobileActions = isMobile && selectedPart === pid

  useEffect(() => {
    setQType(type)
  }, [type])

  const setPropertyByValue = useRecoilCallback(
    ({ set }) =>
      ({ path, value = undefined, pid }) => {
        console.log(path, value, pid)
        set(editPartState({ pid, path }), (property) => {
          if (value) {
            return value
          }
          if (property === undefined) {
            return path.includes('optional') ? true : ''
          } else {
            return undefined
          }
        })
      }
  )

  const handleChange = ({ target: { value } }) => {
    setQType(value)
    setPropertyByValue({ pid, value, path: 'type' })
    //if type is section, set answers to an empty array, otherwise, set to default part
    setPropertyByValue({
      pid,
      value: value === 'section' ? [] : defaultPart.answers,
      path: 'answers',
    })
  }

  return (
    <Fragment>
      <Question
        qType={qType}
        pid={pid}
        part={part}
        setPropertyByValue={setPropertyByValue}
        handleChange={handleChange}
      />

      {qType !== 'paragraph' &&
        React.createElement(
          (options.find(({ value }) => value === qType) || options[0]).component,
          {
            pid,
            setPropertyByValue,
            part,
          }
        )}

      {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )}
    </Fragment>
  )
}

UndefinedInner.propTypes = {
  /** undefined instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

UndefinedInner.defaultProps = {
  initialList: [''],
}

export { UndefinedInner }
