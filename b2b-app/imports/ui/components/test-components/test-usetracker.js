import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTracker } from 'meteor/react-meteor-data'

import { Typography, Button } from '@material-ui/core'

const StyledTestUseTracker = styled.div``

function TestUseTracker() {
  const [n, setN] = useState(0)
  const [other, setOther] = useState(0)

  useTracker(() => {
    console.log('in tracker', { n })
  }, [n])

  useEffect(() => {
    console.log('in effect', { n })
  }, [n])

  return (
    <StyledTestUseTracker>
      <Typography variant="h2">TestUseTracker</Typography>
      <div>current n: {n}</div>
      <div>
        <Button onClick={() => setN(n + 1)} variant="contained">
          (+) Increase n
        </Button>
      </div>
      <div>current other: {other}</div>
      <div>
        <Button onClick={() => setOther(other + 1)} variant="contained">
          (+) Increase other
        </Button>
      </div>
    </StyledTestUseTracker>
  )
}

export default TestUseTracker
