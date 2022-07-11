import React from 'react'
import { Field } from '../field'
// import PropTypes from 'prop-types'
import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useSelectedPartValue } from '/imports/ui/forms/survey-builder/recoil/hooks'
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import { useBuilder } from '/imports/ui/forms/survey-builder/context'
import { questionOptions } from '$sb/components/types/undefined/field/options'

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

// fieldKey: 'name', 'prompt'
export const QuestionField = ({
  fieldKey,
  pid,
  isIdChecked,
  setIsIdChecked,
  setPropertyByValue,
  helperText,
  part,
}) => {
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()
  const showMobileActions = isMobile && selectedPart === pid

  return (
    <Grid item style={{ marginLeft: '32px' }} xs={12} md={7} lg={8}>
      <Field
        onChange={({ target: { value } }) =>
          setPropertyByValue({ path: fieldKey, value, pid })
        }
        label={getLabelFromKey(fieldKey)}
        text={part[fieldKey] || ''}
        showMobileActions={showMobileActions}
        placeholder={'Type your question/paragraph'}
        helperText={helperText}
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
        part={part}
        underline={true}
      />
    </Grid>
  )
}

export const OptionField = ({
  filterList,
  part,
  setPropertyByValue,
  isIdChecked,
  setIsIdChecked,
  showMobileActions,
  pid,
  path,
}) => {
  const ID = part['id'] ? 'id' : '_id'
  const classes = useStyles()

  return Object.entries(part)
    .filter(([key, value]) => !filterList.includes(key) && value !== undefined)
    .map(([key, value]) => {
      const isID = key === ID

      const showField = () => {
        if (!isID) {
          return true
        }

        if (isID && isIdChecked[ID]) {
          return true
        }

        if (isID && isIdChecked[path]) {
          return true
        }

        return false
      }

      return (
        <div className={classes.gridRoot} key={key}>
          <Grid
            container
            spacing={1}
            alignItems="flex-end"
            style={showField() ? {} : { display: 'none' }}
          >
            {/* <Grid item style={{ visibility: 'hidden' }}>
              <RadioButtonUncheckedIcon />
            </Grid> */}
            <Grid item style={{ marginLeft: '32px' }}>
              <Field
                onDeleteOption={() => {
                  if (isID) {
                    return setIsIdChecked((prev) => ({
                      ...prev,
                      [path ?? key]: false,
                    }))
                  }

                  setPropertyByValue({ path: path ? `${path}.${key}` : key, pid })
                }}
                onChange={({ target: { value } }) =>
                  setPropertyByValue({ path: path ? `${path}.${key}` : key, value, pid })
                }
                label={getLabelFromKey(key)}
                text={value || ''}
                showMobileActions={showMobileActions}
                placeholder={key}
                actions={['deleteOption']}
                type={'option'}
                variant="filled"
                underline={true}
                size={'small'}
              />
            </Grid>
          </Grid>
        </div>
      )
    })
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
  part,
  isIdChecked,
  setIsIdChecked,
  options,
  helperText,
  type,
  children,
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
            part={part}
            isIdChecked={isIdChecked}
            setIsIdChecked={setIsIdChecked}
            path={`answers[${answerIndex}]`}
            showMore={true}
            showUploadImage={true}
            options={options}
            fieldID={`${pid}_answer_${answerIndex}`}
            helperText={helperText}
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
          />
        </Grid>

        {children && children}
      </Grid>
    </div>
  )
}

export const GridField = ({
  underline = true,
  onRemove,
  onAdd,
  disableRemove,
  setPropertyByValue,
  pid,
  data,
  dataIndex,
  showMobileActions,
  part,
  isIdChecked,
  setIsIdChecked,
  options,
  // helperText,
  type,
  // children,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.gridRoot}>
      <Grid container spacing={1} alignItems="flex-end">
        {/* <Grid item>
          <RadioButtonUncheckedIcon style={{ visibility: 'hidden' }} />
        </Grid> */}
        <Grid item xs={11} style={{ marginLeft: '32px' }}>
          <Field
            underline={underline}
            onRemove={onRemove}
            onAdd={onAdd}
            disableRemove={disableRemove}
            onChange={({ target: { value } }) =>
              setPropertyByValue({
                path: `answers[0].${type}s[${dataIndex}].${
                  type === 'row' ? 'name' : 'field'
                }`,
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
            index={`${pid}_${dataIndex}`}
            text={type === 'row' ? data.name : data.field}
            showMobileActions={showMobileActions}
            placeholder={`Type ${type} name...`}
            actions={['add', 'remove']}
            part={part}
            isIdChecked={isIdChecked}
            setIsIdChecked={setIsIdChecked}
            path={`answers[0].${type}s[${dataIndex}]`}
            showMore={true}
            showUploadImage={false}
            options={options}
            fieldID={`${pid}_${type}_${dataIndex}`}
            // helperText={helperText}
            onKeyDown={(e) => {
              if (e.key === 'Tab') {
                e.preventDefault()
                onAdd()
                const index = type === 'column' ? dataIndex : dataIndex + 1
                setTimeout(
                  () =>
                    document.querySelectorAll(`[id ^='${pid}_${type}']`)[index].focus(),
                  0
                )
              }
            }}
          />
        </Grid>
      </Grid>
    </div>
  )
}
