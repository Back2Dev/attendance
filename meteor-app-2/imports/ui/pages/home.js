import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Typography, Button } from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import { makeStyles } from '@material-ui/core/styles'
import GoogleLogin from '/imports/ui/components/google-login/google-login.js'
import FacebookLogin from '/imports/ui/components/facebook-login/facebook-login.js'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import TextDivider from '/imports/ui/components/text-divider.js'
import { AccountContext } from '/imports/ui/contexts/account-context.js'

const useStyles = makeStyles((theme) => ({
  card: {
    padding: '50px',
    maxWidth: '450px',
  },
  desktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  mobile: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  button: {
    height: '50px',
    fontSize: '16px',
    position: 'relative',
    '& .MuiButton-startIcon': {
      position: 'absolute',
      left: 20,
    },
  },
}))

const Home = () => {
  const classes = useStyles()
  const { push } = useHistory()
  const { user } = useContext(AccountContext)

  const renderForm = () => {
    if (!user) {
      return (
        <>
          <div className={classes.desktop}>
            <Typography variant="h1" color="inherit">
              Welcome to Settle Easy
            </Typography>
            <br />
            <GoogleLogin label="Sign up with Google" redirect="/dashboard" />
            <br />
            <FacebookLogin label="Sign up with Facebook" redirect="/dashboard" />
            <br />
            <br />
            <TextDivider>Or</TextDivider>
            <br />
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => push('/signup')}
              startIcon={<EmailIcon />}
              fullWidth
            >
              <div style={{ marginLeft: '50px' }}>Sign up with email</div>
            </Button>
          </div>
          <div className={classes.mobile}>
            <Typography variant="h1" color="inherit">
              Welcome to Settle Easy
            </Typography>
            <br />
            <GoogleLogin
              label="Sign up with Google"
              redirect="/dashboard"
              style={{ width: '20px' }}
            />
            <br />
            <FacebookLogin label="Sign up with Facebook" redirect="/dashboard" />
            <br />
            <br />
            <TextDivider>Or</TextDivider>
            <br />
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => push('/signup')}
              startIcon={<EmailIcon />}
              fullWidth
            >
              <div style={{ marginLeft: '50px' }}>Sign up with email</div>
            </Button>
          </div>
        </>
      )
    }
    return (
      <div className="signedin-home">
        <Typography variant="h1" color="inherit">
          Welcome to Settle Easy
        </Typography>
      </div>
    )
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default Home
