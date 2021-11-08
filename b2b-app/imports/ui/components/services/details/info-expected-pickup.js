import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { TextField } from '@material-ui/core'
import { JobsDetailsContext } from './context'
import moment from 'moment'

const StyledExpectedPickupDate = styled.div`
  .picker-container {
    margin-right: 10px;
  }
  input {
    padding: 5px;
  }
`

function ExpectedPickupDate() {
  const { item, setExpectedPickupDate } = useContext(JobsDetailsContext)

  const [date, setDate] = useState(
    item?.pickupDate ? moment(item.pickupDate).format('YYYY-MM-DD') : ''
  )

  useEffect(() => {
    if (item?.pickupDate) {
      setDate(moment(item.pickupDate).format('YYYY-MM-DD'))
    }
  }, [item?.pickupDate])

  const handleChange = (e) => {
    setDate(e.target.value)
    setExpectedPickupDate(moment(e.target.value).toDate())
  }

  return (
    <StyledExpectedPickupDate>
      <div className="picker-container">
        <TextField
          margin="none"
          variant="outlined"
          fullWidth
          name="expected-pickup-date"
          value={date}
          type="date"
          onChange={handleChange}
        />
      </div>
    </StyledExpectedPickupDate>
  )
}

export default ExpectedPickupDate
