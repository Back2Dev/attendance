import React, { useContext } from 'react'
import { Grid, Card, Container, Typography } from '@material-ui/core'
import Skeleton from '@material-ui/lab/Skeleton'
import { makeStyles } from '@material-ui/core/styles'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import PropTypes from 'prop-types'

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
}))

const OnboardingModal = ({ renderForm }) => {
  const classes = useStyles()

  const { loading } = useContext(AccountContext)

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
}

export default OnboardingModal
