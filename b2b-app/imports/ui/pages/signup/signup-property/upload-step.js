import React, { useContext, useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Random } from 'meteor/random'
import { Grid, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

import { meteorCall } from '/imports/ui/utils/meteor'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import slingshotUpload from '/imports/ui/components/upload-function'
import CONSTANTS from '/imports/api/constants'

const debug = require('debug')('app:upload-step')

const useStyles = makeStyles({
  input: {
    display: 'none',
  },
})

const UploadStep = ({ activeStep, setActiveStep }) => {
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState(null)
  const [submitEnabled, setSubmitEnabled] = useState(true)

  const classes = useStyles()
  const { push } = useHistory()
  const { isLoggedIn } = useContext(AccountContext)
  const listingId = useRef(Random.id())

  const propertyDetails = JSON.parse(sessionStorage.getItem('propertyDetails'))
  const userDetails = JSON.parse(sessionStorage.getItem('userDetails'))

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setFilename(e.target.files[0].name)
    } else {
      setFile(null)
      setFilename(null)
    }
  }

  const submit = async () => {
    setSubmitEnabled(false)
    const formData = Object.assign({}, userDetails, propertyDetails)

    if (formData.transactionType === 'buy' && formData.botp === 'yes') {
      formData['transactionType'] = 'buy-otp'
    }
    formData.listingId = listingId.current
    if (filename) {
      formData.contractFilename = filename

      const metaContext = {
        fileName: filename,
        listing: listingId.current,
        folder: 'listing_documents',
      }
      const upload = slingshotUpload({
        metaContext,
        file: new Blob([file], { type: 'application/pdf' }),
      })
      if (upload.status === 'success') {
        debug('successfully saved document')
      }
    }

    const { status, message } = await meteorCall('signupProperty', 'signing up', formData)
    if (status === 'failed') {
      setSubmitEnabled(true)
      return Error(`Error: ${message}`)
    }

    if (isLoggedIn) {
      push('/bookings')
    } else {
      push('/confirmation-sent', { name: formData.name })
    }
    sessionStorage.removeItem('propertyDetails')
    sessionStorage.removeItem('userDetails')
  }

  return (
    <div>
      <Typography variant="h1" id="review">
        Review
      </Typography>
      <br />
      {propertyDetails && (
        <>
          <Typography>
            <b>Address:</b> <br />
            {propertyDetails.propertyAddress}
          </Typography>
          <br />
          <Typography>
            <b>Transaction type:</b> <br />
            {propertyDetails.botp === 'yes' && propertyDetails.transactionType === 'buy'
              ? CONSTANTS.TRANSACTION_TYPE['buy-otp']
              : CONSTANTS.TRANSACTION_TYPE[propertyDetails.transactionType]}
          </Typography>
        </>
      )}
      <br />
      <input
        accept="application/pdf"
        className={classes.input}
        id="contained-button-file"
        data-cy="contained-button-file"
        multiple
        type="file"
        onChange={handleFileUpload}
      />
      {propertyDetails.transactionType !== 'sell' && (
        <>
          <label htmlFor="contained-button-file">
            <Button
              color="primary"
              variant="contained"
              component="span"
              startIcon={<CloudUploadIcon />}
            >
              Upload Contract
            </Button>
          </label>
          <br />
          <br />
          <b>File: </b>
          <br />
          <Typography color={filename ? 'inherit' : 'error'}>
            {filename || 'None'}
          </Typography>
        </>
      )}
      <br />
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => setActiveStep(activeStep - 1)}
            fullWidth
          >
            Back
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            id="next-button"
            color="primary"
            variant="contained"
            onClick={() => submit(file)}
            disabled={propertyDetails.transactionType === 'contract-review' && !file}
            fullWidth
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

UploadStep.propTypes = {}
export default UploadStep
