import { Meteor } from 'meteor/meteor'
import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Box, Typography, Container, Paper, Button, Grid } from '@material-ui/core'
import { AutoForm, AutoFields, ErrorsField } from 'uniforms-material'

import { showSuccess, showError } from '/imports/ui/utils/toast-alerts'
import { bridge as schema } from '/imports/api/support/schema-form.js'
import ThankYouPage from './thank-you'

const StyledSuportForm = styled(Container)`
  margin: 60px auto;
  h1 {
    margin: 20px 0;
  }
  .form-wrapper {
    margin: 20px 0;
    padding: 24px;
    width: 100%;
    max-width: 700px;
    min-width: 350px;
    .buttons-container {
      display: flex;
      justify-content: space-around;
      margin: 10px 0;
    }
  }
  .contact-details {
    font-weight: bold;
  }
`

function SupportForm() {
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)

  const { push } = useHistory()

  const formRef = useRef()

  const handleSubmit = (data) => {
    console.log('submit', data)
    setLoading(true)
    Meteor.call('support.create', data, (error, result) => {
      setLoading(false)
      if (error) {
        showError(error.message)
        return
      }
      if (result?.status === 'failed') {
        showError(result?.message)
        return
      }
      if (result?.status === 'success') {
        showSuccess('Email sent')
        setFinished(true)
        return
      }
      showError('Unknown error!')
    })
  }

  if (finished) {
    return <ThankYouPage />
  }

  return (
    <StyledSuportForm maxWidth="lg">
      <Helmet>
        <title>Support</title>
      </Helmet>
      <Typography variant="h1" align="center">
        Contact the support team
      </Typography>
      <Box display="flex" justifyContent="center" className="form-container">
        <Paper elevation={2} className="form-wrapper">
          <Grid container direction="row" justify="space-evenly" alignItems="center">
            <Grid item xs={12} sm={6}>
              <AutoForm
                ref={formRef}
                schema={schema}
                onSubmit={handleSubmit}
                placeholder={true}
              >
                <AutoFields />

                <ErrorsField />
                <div className="buttons-container">
                  <Button
                    variant="contained"
                    id="submit"
                    color="primary"
                    onClick={() => {
                      formRef?.current.submit()
                    }}
                    disabled={loading}
                  >
                    Submit
                  </Button>
                </div>
              </AutoForm>
            </Grid>
            <Grid item xs={12} sm={6}>
              <div align="center">
                <div className="contact-details">Telephone:</div>
                <div>
                  <a href="tel:+1800-STARTUP">1800-STARTUP</a>
                </div>
                <div className="contact-details">Email:</div>
                <div>
                  <a href="mailto:support@mydomain.com.au">support@mydomain.com.au</a>
                </div>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </StyledSuportForm>
  )
}

export default SupportForm
