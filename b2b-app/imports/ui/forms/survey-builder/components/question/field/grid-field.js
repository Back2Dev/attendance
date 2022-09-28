import React from 'react'
import { Field } from './base'

import { Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() => ({
  gridRoot: {
    flexGrow: 1,
    marginBottom: '0.5rem',
  },
}))

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
  options,
  // helperText,
  type,
  ...props
}) => {
  const classes = useStyles()

  return (
    <div className={classes.gridRoot}>
      <Grid container spacing={1} alignItems="flex-end">
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
            {...props}
          />
        </Grid>
      </Grid>
    </div>
  )
}
