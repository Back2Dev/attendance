import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Grid, Card, Container, Typography, Button } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import PropTypes from 'prop-types'
import { bool } from 'yup'

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundImage: 'url(/images/signin-hero-image.jpg)',
    height: '100%',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  },
  gridContainer: {
    minHeight: 'calc(100vh - 64px)',
  },
  card: {
    padding: '50px',
    width: '100%',
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
      padding: '50px',
      width: '480px',
      textAlign: 'center',
    },
  },
  message: {
    marginTop: '10px',
    marginBottom: '10px',
  },
}))

const OnboardingModal = ({ renderForm, loginFallback = true }) => {
  const classes = useStyles()

  const { loading, user, profile } = useContext(AccountContext)
  const { push } = useHistory()

  // display a fallback component instead if user is logged in (controllable through prop)
  if (user && loginFallback) {
    renderForm = () => {
      return (
        <>
          <Typography variant="h3" className={classes.heading}>
            Welcome {profile?.nickname || profile?.name}
          </Typography>
          <Typography className={classes.message}>
            You are now logged in to the Startup Inc platform.
          </Typography>
          <div className="center-align">
            <Button
              variant="contained"
              data-cy="add-btn"
              color="primary"
              onClick={() => push('/cust-add')}
              startIcon={<AddIcon />}
            >
              Add property
            </Button>
          </div>
        </>
      )
    }
  }

  const loadingForm = () => {
    return (
      <Grid container>
        <Grid item xs={12} align="center">
          <div className="loading">
            <Typography variant="h3" color="inherit" noWrap>
              <Skeleton />
            </Typography>
            <p>
              <Skeleton animation={false} />
            </p>
            <p>
              <Skeleton animation={false} />
            </p>
            <p>
              <Skeleton animation={false} />
            </p>
            <p>
              <Skeleton animation={false} />
            </p>
          </div>
        </Grid>
      </Grid>
    )
  }

  return (
    <Container maxWidth={false} className={classes.background}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.gridContainer}
      >
        <Card className={classes.card}>{loading ? loadingForm() : renderForm()}</Card>
      </Grid>
    </Container>
  )
}

OnboardingModal.propTypes = {
  renderForm: PropTypes.func.isRequired,
  loginFallback: PropTypes.bool,
}

export default OnboardingModal
