import React from 'react'
import styled from 'styled-components'
import { TextField } from '@material-ui/core'
import moment from 'moment'
import PropTypes from 'prop-types'

const StyledArrayField = styled(TextField)`
  display: flex;
  width: 100%;
  height: 100%;
  > div {
    flex: 1;
    font-size: 14px;
    input {
      font-size: 14px;
    }
  }
`

function ArrayField(props) {
  // console.log('ArrayField', props)
  const { row, column, onRowChange } = props
  const value = row[column.key]
  const formated = JSON.stringify(value)
  // console.log('value', value, formated)
  return (
    <StyledArrayField
      defaultValue={formated}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={(event) => {
        console.log(event.target.value)
        try {
          const arrayValue = JSON.parse(event.target.value)
          if (arrayValue) {
            onRowChange({ ...row, [column.key]: arrayValue })
          }
        } catch (error) {
          console.log(error)
        }
      }}
    />
  )
}

ArrayField.propTypes = {
  column: PropTypes.object,
  onClose: PropTypes.func,
  onRowChange: PropTypes.func,
  row: PropTypes.object,
  rowIdx: PropTypes.number,
}

export default ArrayField
