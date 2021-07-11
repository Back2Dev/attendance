import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { TextField, Typography } from '@material-ui/core'
import { JobsDetailsContext } from './context'
import moment from 'moment'

const StyledExpectedPickupDate = styled.div``

function ExpectedPickupDate() {
  const { item, setExpectedPickupDate } = useContext(JobsDetailsContext)

  const [date, setDate] = useState(
    item?.expectedPickupDate ? moment(item.expectedPickupDate).format('YYYY-MM-DD') : ''
  )

  useEffect(() => {
    if (item?.expectedPickupDate) {
      setDate(moment(item.expectedPickupDate).format('YYYY-MM-DD'))
    }
  }, [item?.expectedPickupDate])

  const handleChange = (e) => {
    setDate(e.target.value)
    setExpectedPickupDate(moment(e.target.value).toDate())
  }

  return (
    <StyledExpectedPickupDate>
      <div className="picker-container">
        <TextField
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
