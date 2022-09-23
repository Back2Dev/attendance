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

const useStyles = makeStyles(() => ({
  gridRoot: {
    flexGrow: 1,
    marginBottom: '0.5rem',
  },
}))

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

export const AnswerField = ({
  underline = true,
  onRemove,
  onAdd,
  disableRemove,
  setPropertyByValue,
  pid,
  answer,
  answerIndex,
  showMobileActions,
  question,
  options,
  type,
  children,
  ...props
}) => {
  const classes = useStyles()

  const prefixIcon = (type) => {
    switch (type) {
      case 'single':
        return <RadioButtonUncheckedIcon />
      case 'multiple':
        return <CheckBoxOutlineBlankIcon />
      default:
        return <RadioButtonUncheckedIcon style={{ visibility: 'hidden' }} />
    }
  }

  return (
    <div className={classes.gridRoot}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid item>{prefixIcon(type)}</Grid>
        <Grid item xs={11} md={type === 'text' ? 7 : 11} lg={type === 'text' ? 8 : 11}>
          <Field
            underline={underline}
            onRemove={onRemove}
            onAdd={onAdd}
            disableRemove={disableRemove}
            onChange={({ target: { value } }) =>
              setPropertyByValue({
                path: `answers[${answerIndex}].name`,
                value,
                pid,
              })
            }
            onToggle={(path) =>
              setPropertyByValue({
                path,
                pid,
              })
            }
            onUploadFinish={(value) =>
              setPropertyByValue({
                path: `answers[${answerIndex}].image`,
                value,
                pid,
              })
            }
            index={`${pid}_${answerIndex}`}
            text={answer.name}
            showMobileActions={showMobileActions}
            placeholder={'Type your answer...'}
            actions={['add', 'remove']}
            question={question}
            path={`answers[${answerIndex}]`}
            showMore={true}
            showUploadImage={true}
            options={options}
            fieldID={`${pid}_answer_${answerIndex}`}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                onAdd()
                setTimeout(
                  () =>
                    document
                      .querySelectorAll(`[id ^='${pid}_answer']`)
                      [answerIndex + 1].focus(),
                  0
                )
              }
            }}
            {...props}
          />
        </Grid>

        {children && children}
      </Grid>
    </div>
  )
}
