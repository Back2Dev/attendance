import React, { useContext } from 'react'
import { Typography, Button } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PoolIcon from '@mui/icons-material/Pool'
import SignupIcon from '@mui/icons-material/SensorOccupied'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import makeStyles from '@mui/styles/makeStyles'
import OnboardingModal from '/imports/ui/components/onboarding-modal.js'
import TextDivider from '/imports/ui/components/text-divider.js'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import useHistory from '/imports/ui/utils/history'

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
              Welcome to {Meteor.settings.public.tagline}
            </Typography>
            <br />
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => push('/shop')}
              startIcon={<ShoppingCartIcon />}
              fullWidth
            >
              Shop
            </Button>
            <br /> <br />{' '}
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => push('/login')}
              startIcon={<PoolIcon />}
              fullWidth
            >
              Login
            </Button>
            <br /> <br />{' '}
            <Button
              variant="outlined"
              color="primary"
              className={classes.button}
              onClick={() => push('/signup')}
              startIcon={<SignupIcon />}
              fullWidth
            >
              Sign up
            </Button>
            <br />
          </div>
        </>
      )
    }
    return (
      <div className="signedin-home">
        <Typography variant="h1" color="inherit">
          Welcome to {Meteor.settings.public.tagline}
        </Typography>
      </div>
    )
  }

  return <OnboardingModal renderForm={renderForm} />
}

export default Home
