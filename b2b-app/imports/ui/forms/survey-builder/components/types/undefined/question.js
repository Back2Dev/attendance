import React, { useState } from 'react'
import PropTypes from 'prop-types'
// import { Item } from './item'
import { Button, Grid } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'

import {
  useUndefinedAnswers,
  useUndefinedQuestion,
  useSelectedPartValue,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'

import { Item } from '$sb/components/types/single/item'
import { questionOptions } from '$sb/components/types/undefined/options'

const getLabelFromKey = (key) => {
  switch (key) {
    case 'val':
      return 'VALUE'
    case '_id':
      return 'ID'
    case 'id':
      return 'ID'
    default:
      return key.toUpperCase()
  }
}

/** Question renders an editable label. It's a simple wrapper around InlineEdit */
const Question = ({
  pid,
  onDeleteOption,
  setPropertyByValue,
  part,
  label,
  type,
  ...props
}) => {
  // const classes = useStyles()
  // const { all, add, update, remove } = useUndefinedAnswers(pid)
  // const [question, setQuestion] = useUndefinedQuestion(pid)
  // const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const [isIdChecked, setIsIdChecked] = useState({})
  const showMobileActions = isMobile && selectedPart === pid

  // console.log('pid', pid, 'part', part)
  return (
    <>
      {Object.entries(part)
        .reduce((acc, curr) => {
          if (curr[0] === 'name') {
            return [curr, ...acc]
          }
          return [...acc, curr]
        }, [])
        .map(([key, value]) => {
          const showField = () => {
            if (value === undefined) return false

            const isID = key === 'id' || key === '_id'

            if (!isID) {
              return true
            }

            if (isID && isIdChecked[key]) {
              return true
            }

            return false
          }

          if (key === 'answers' || key === 'type') return null
          //only for section. section doesn't have prompt but name
          if (key === 'prompt' || (type === 'section' && key === 'name')) {
            return (
              <Grid container spacing={1} alignItems="flex-start" key={key}>
                <Grid item style={{ visibility: 'hidden' }}>
                  <RadioButtonUncheckedIcon />
                </Grid>
                <Grid item xs={10}>
                  <Item
                    onChange={({ target: { value } }) =>
                      setPropertyByValue({ path: key, value, pid })
                    }
                    label={label}
                    text={value || ''}
                    // setPropertyByValue={setPropertyByValue}
                    showMobileActions={showMobileActions}
                    placeholder={'Type your question'}
                    showMore={true}
                    showUploadImage={true}
                    index={pid}
                    onToggle={(path) =>
                      setPropertyByValue({
                        path,
                        pid,
                      })
                    }
                    onUploadFinish={(value) =>
                      setPropertyByValue({
                        path: 'image',
                        value,
                        pid,
                      })
                    }
                    isIdChecked={isIdChecked}
                    setIsIdChecked={setIsIdChecked}
                    options={questionOptions}
                    type={'question'}
                    part={part}
                    {...props}
                  />
                </Grid>
              </Grid>
            )
          } else if (key === 'image') {
            return (
              <img
                src={value}
                loading="lazy"
                style={{
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  display: 'block',
                  width: '200px',
                }}
                key={key}
              />
            )
          } else {
            return (
              <Grid
                container
                spacing={1}
                key={key}
                alignItems="flex-end"
                style={showField() ? {} : { display: 'none' }}
              >
                <Grid item style={{ visibility: 'hidden' }}>
                  <RadioButtonUncheckedIcon />
                </Grid>
                <Grid item>
                  <Item
                    onDeleteOption={() => setPropertyByValue(key)}
                    onChange={({ target: { value } }) => setPropertyByValue(key, value)}
                    label={getLabelFromKey(key)}
                    text={value}
                    showMobileActions={showMobileActions}
                    placeholder={key}
                    actions={['deleteOption']}
                    //   path={`answers[${answerIndex}]`}
                    type={'option'}
                  />
                </Grid>
              </Grid>
            )
          }
        })}
    </>
  )
}

Question.propTypes = {
  /** initial label to show, defaults to empty string */
  label: PropTypes.string,
  /** shows this text when label is blank */
  placeholder: PropTypes.string.isRequired,
  /** function gets called when editable field loses focus */
  onLabelChange: PropTypes.func,
  /** custom styling */
  className: PropTypes.string,
}

Question.defaultProps = {
  placeholder: 'Type your question',
}

export { Question }
