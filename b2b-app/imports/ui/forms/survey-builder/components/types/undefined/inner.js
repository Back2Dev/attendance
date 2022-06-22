import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {
  useUndefinedAnswers,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { SingleInner } from '../single/inner'
import { MultipleInner } from '../multiple/inner'
import { UploadInner } from '../upload/inner'
import { TextInner } from '../text/inner'
import { SectionInner } from '../section/inner'
import { useRecoilCallback, useRecoilState } from 'recoil'
import {
  editPartState,
  getPartState,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
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
  const [part] = useRecoilState(getPartState({ pid }))
  const showMobileActions = isMobile && selectedPart === pid

  const setTypeProperty = useRecoilCallback(({ set }) => (path, type) => {
    set(editPartState({ pid, path }), () => {
      return type
    })
  })

  const setPropertyByValue = useRecoilCallback(
    ({ set }) =>
      ({ path, value = undefined, pid }) => {
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
    setTypeProperty('type', value)
  }

  return (
    <>
      <Question
        qType={qType}
        pid={pid}
        part={part}
        setPropertyByValue={setPropertyByValue}
        handleChange={handleChange}
      />

      {React.createElement(
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
    </>
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
