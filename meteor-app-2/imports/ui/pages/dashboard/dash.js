import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
} from '@material-ui/core'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import { GreenButton } from '/imports/ui/utils/generic'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '70px',
  },
  title: {
    marginBottom: '15px',
    fontSize: theme.typography.h4.fontSize,
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.typography.h1.fontSize,
    },
  },
  card: {
    width: '280px',
    [theme.breakpoints.up('md')]: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1),
    },
    marginBottom: '20px',
  },
  footer: {
    justifyContent: 'center',
  },
}))
const List = ({ dashCards }) => {
  const classes = useStyles()

  const { push } = useHistory()
  const { profile, viewas } = useContext(AccountContext)

  return (
    <Container className={classes.root}>
      <Typography
        variant="h1"
        data-cy="welcome"
        align="center"
        className={classes.titleContainer}
      >
        <span className={classes.title}>Welcome {profile?.nickname}</span>
      </Typography>
      <Grid container align="center">
        <Grid item xs={12}>
          <div className={classes.buttonGroup}>
            <Button
              variant="contained"
              data-cy="add-btn"
              color="primary"
              onClick={() => push('/cust-add')}
            >
              + Add property
            </Button>
            {['CON', 'PM', 'ADM'].includes(viewas) && (
              <GreenButton
                onClick={() => push('/invite-customer')}
                startIcon={<PersonAddIcon />}
              >
                Invite user
              </GreenButton>
            )}
          </div>
        </Grid>
      </Grid>
      <Grid container spacing={3} justify="center">
        {dashCards.map((card, index) => {
          return (
            <Grid item md={3} key={card.display + index} align="center">
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h2">{card.icon()}</Typography>
                  <Typography variant="h5">{card.display}</Typography>
                  <br />
                  <Typography variant="body2" component="p">
                    {card.description}
                  </Typography>
                </CardContent>
                <CardActions className={classes.footer}>
                  <Button color="primary" onClick={card.action}>
                    {card.actionLabel}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

List.propTypes = { dashCards: PropTypes.array.isRequired }
export default List
