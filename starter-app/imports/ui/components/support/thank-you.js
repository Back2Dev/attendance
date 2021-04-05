import React from 'react'
import styled from 'styled-components'
import { Helmet } from 'react-helmet'
import { useHistory } from 'react-router-dom'

import { Typography, Button } from '@material-ui/core'

const StyledThankYou = styled.div`
  text-align: center;
  margin-bottom: 45px;
  h1 {
    margin: 20px 0;
  }
  .message {
    margin: 40px 0;
  }
`

function ThankYouPage() {
  const { push } = useHistory()

  return (
    <StyledThankYou>
      <Helmet>
        <title>Thank you</title>
      </Helmet>
      <Typography variant="h1" align="center">
        Thank you
      </Typography>
      <Typography className="message" data-cy="thanks">
        Thank you for your email. The support team will be in touch to help you.
      </Typography>
      <Button variant="contained" onClick={() => push('/dashboard')}>
        My Dashboard
      </Button>
    </StyledThankYou>
  )
}

export default ThankYouPage
