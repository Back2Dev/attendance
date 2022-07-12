import React, { useEffect, useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import {
  useUndefinedAnswers,
  useSelectedPartValue,
  defaultPart,
  getDefaultColumn,
  getDefaultRow,
  usePartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import {
  SingleInner,
  MultipleInner,
  UploadInner,
  TextInner,
  SectionInner,
  DropdownInner,
  LookupInner,
  RatingInner,
  GridInner,
} from '$sb/components/types/undefined/type-inner'
import { useRecoilCallback } from 'recoil'
import {
  editPartState,
  editPartsState,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
import { Question } from './question'

const options = [
  { label: 'Single', value: 'single', component: SingleInner },
  { label: 'Multiple', value: 'multiple', component: MultipleInner },
  { label: 'Upload', value: 'upload', component: null },
  { label: 'Text', value: 'text', component: TextInner },
  { label: 'Section', value: 'section', component: null },
  { label: 'Dropdown', value: 'dropdown', component: DropdownInner },
  { label: 'Lookup', value: 'lookup', component: LookupInner },
  { label: 'Geolocation', value: 'geolocation', component: null },
  { label: 'Rating', value: 'rating', component: RatingInner },
  { label: 'Grid', value: 'grid', component: GridInner },
]

const nonInnerType = ['paragraph', 'signature', 'geolocation', 'section', 'upload']

const UndefinedInner = ({ pid, type }) => {
  const { add } = useUndefinedAnswers(pid)
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const [qType, setQType] = useState(type ?? 'single')
  const part = usePartValue(pid)

  const showMobileActions = isMobile && selectedPart === pid

  useEffect(() => {
    setQType(part.type)
  }, [part.type])

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

  const updateCanvas = useRecoilCallback(({ set }) => ({ value: type }) => {
    set(editPartsState({ pid }), (property) => {
      return { ...property, type }
    })
  })

  const handleChange = ({ target: { value } }) => {
    setQType(value)
    setPropertyByValue({ pid, value, path: 'type' })
    //if type is section, set answers to an empty array, otherwise, set to default part
    setPropertyByValue({
      pid,
      value: nonInnerType.includes(value) ? [] : defaultPart.answers,
      path: 'answers',
    })

    if (value === 'grid') {
      setPropertyByValue({
        pid,
        value: {
          columns: [
            { ...getDefaultColumn(), field: 'name', editable: false },
            getDefaultColumn(),
          ],
          rows: [getDefaultRow()],
        },
        path: 'answers[0]',
      })
    }

    //need to rerender canvas if new section is added
    if (value === 'section') {
      updateCanvas({ value })
    }
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

      {!nonInnerType.includes(qType) &&
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
  /** question type, by default is "single"*/
  type: PropTypes.string,
}

UndefinedInner.defaultProps = {
  initialList: [''],
}

export { UndefinedInner }
