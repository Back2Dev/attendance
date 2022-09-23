import React, { useState } from 'react'
import { Field } from './base'
import { useRecoilState } from 'recoil'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { questionOptions } from '$sb/components/question/field/options'
import { IdAtom } from '$sb/recoil/atoms'
import InputAdornment from '@material-ui/core/InputAdornment'
import Button from '@material-ui/core/Button'
import { getLabelFromKey } from './question-field'

const useStyles = makeStyles({
  hideUnderline: {
    '&:before': {
      'border-bottom': '1px solid white',
    },
    '&:hover:not(.Mui-disabled)::before': {
      'border-bottom': '1px solid black',
    },
  },
  answerField: {
    '&:hover .MuiInputAdornment-root': {
      visibility: 'visible',
    },
  },
  InputAdornment: {
    visibility: 'hidden',
  },
  helperText: {
    position: 'absolute',
    right: '1px',
    bottom: '-20px',
  },
})

export const OptionField = ({
  filterList,
  question,
  setPropertyByValue,
  pid_index,
  showMobileActions,
  pid,
  path,
}) => {
  const ID = question['id'] ? 'id' : '_id'
  const classes = useStyles()
  const [showId, setShowId] = useRecoilState(IdAtom(pid_index))

  return Object.entries(question)
    .filter(([key, value]) => !filterList.includes(key) && value !== undefined)
    .map(([key, value]) => {
      const isID = key === ID
      const getStyle = () => {
        if (isID && !showId) return { display: 'none' }
        else return {}
      }

      return (
        <div className={classes.gridRoot} key={key}>
          <Grid container spacing={1} alignItems="flex-end" style={getStyle()}>
            <Grid item style={{ marginLeft: '32px' }}>
              <Field
                onDeleteOption={() => {
                  if (isID) {
                    return setShowId(!showId)
                  }

                  setPropertyByValue({ path: path ? `${path}.${key}` : key, pid })
                }}
                onChange={({ target: { value } }) =>
                  setPropertyByValue({ path: path ? `${path}.${key}` : key, value, pid })
                }
                label={getLabelFromKey(key)}
                text={value || ''}
                showMobileActions={showMobileActions}
                fieldkey={key}
                actions={['deleteOption']}
                type={'option'}
                variant="filled"
                underline={true}
                size={'small'}
                specify={
                  key === 'specify' ? (
                    <Button
                      onClick={() => {
                        //default is short
                        const newType =
                          question.specifyType === 'short' || !question.specifyType
                            ? 'long'
                            : 'short'

                        setPropertyByValue({
                          path: `${path}.specifyType`,
                          value: newType,
                          pid,
                        })
                      }}
                    >
                      {question.specifyType ?? 'short'}
                    </Button>
                  ) : null
                }
              />
            </Grid>
          </Grid>
        </div>
      )
    })
}
