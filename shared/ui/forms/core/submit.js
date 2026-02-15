import React, { useEffect, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Grid, Button, Typography } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import CheckBox from '@mui/icons-material/CheckBox'
import { AccountContext } from '/imports/ui/contexts/account-context'
import WebformContext from '../form-context'
import CONSTANTS from '/imports/api/constants'
import LoadingButton from '@mui/lab/LoadingButton'
import dbg from 'debug'
const debug = dbg('app:preview')

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '36px',
    marginBottom: '36px',
  },
  content: {
    '& > *': {
      margin: '5px',
    },
  },
  actions: {
    marginTop: '10px',
  },
  signatureAlert: {
    '&:hover': {
      cursor: 'pointer',
    },
    marginBottom: '15px',
  },
  epilogue: {
    fontSize: theme.typography.htmlFontSize,
  },
}))

const WebformSubmit = ({ complete, survey, task, backToWebform }) => {
  const { user, profile } = useContext(AccountContext)
  const { currentRole } = useContext(WebformContext)
  const permissions = task?.permissions?.edit || []
  const [loading, setLoading] = useState(false)

  const classes = useStyles()

  const handleSubmit = () => {
    setLoading(true)
    return complete(null, task)
  }

  let submitDisabled

  const renderSubmitButton = () => {
    return (
      <LoadingButton
        data-cy="submit-webform"
        id="complete-step"
        disabled={submitDisabled}
        loading={loading}
        loadingPosition="start"
        onClick={handleSubmit}
        color="primary"
        variant="contained"
        startIcon={<CheckBox />}
        className={classes.bottomButtons}
        fullWidth
      >
        Submit
      </LoadingButton>
    )
  }

  const content = () => {
    return (
      <>
        <div className={classes.content}>
          {backToWebform()}
          <Typography variant="h4">{survey?.name}</Typography>
        </div>
      </>
    )
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        {!submitDisabled && renderSubmitButton()}
      </Grid>
    </Grid>
  )
}

WebformSubmit.propTypes = {
  survey: PropTypes.object.isRequired,
  task: PropTypes.object.isRequired,
  reject: PropTypes.func,
  backToWebform: PropTypes.func.isRequired,
}

export default WebformSubmit
