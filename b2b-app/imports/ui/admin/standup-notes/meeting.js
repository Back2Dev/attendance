import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
// import { people } from '/imports/ui/admin/standup-notes/meeting.stories.js'
import { Box, Checkbox, Container, Grid, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import theme from '/imports/ui/themes/dark.js'
import { DateTime } from 'luxon'
//import { Standup } from './meeting.stories'
const useStyles = makeStyles({
  paper: {
    padding: 10,
    margin: 19,
    height: `100%`,
  },
  itemm: { padding: theme.spacing(3) },
})
// const themeInstance = {
//   background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
// }
// const luxondate = DateTime.fromString('2021-03-14T16:03:44+10:00')

// '1' == 1
// 1 === 1

// export const date = luxondate

// const [value, setValue] = React.useState('Controlled')

// const handleChange = (event) => {
//   setValue(event.target.value)
// }

const Meeting = ({ teamName, teamId, people, save }) => {
  const classes = useStyles()
  const [meeting, setMeeting] = React.useState({ teamName, teamId, date: new Date() })
  console.log('teamName', teamName)
  console.log('people', people)

  const date = DateTime.now().toFormat('cccc dd LLLL')

  // dt.toLocaleString((day = 'numeric'), (month = 'long'))

  //const date = 'today'

  return (
    <Box sx={{ width: '100%' }}>
      <h1>
        {teamName} daily standup {date}
      </h1>
      <form>
        <Grid container xs={12} key="heading">
          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Name</Paper>
          </Grid>
          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Yesterday</Paper>
          </Grid>
          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Today</Paper>
          </Grid>
          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Blockers</Paper>
          </Grid>
        </Grid>
        {people.map((person, ix) => (
          <Grid container xs={12} key={ix}>
            <Grid xs={3} key="1" className={classes.itemm}>
              <Paper className={classes.paper}>
                {person.name} <Checkbox id="apologies" />
                Apologies
              </Paper>
            </Grid>
            <Grid xs={3} key="2" className={classes.itemm}>
              <Paper className={classes.paper}>
                <TextField
                  id="yesterday-notes"
                  multiline
                  fullWidth
                  rows="4"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
            </Grid>
            <Grid xs={3} key="3" className={classes.itemm}>
              <Paper className={classes.paper}>
                <TextField
                  id="today-notes"
                  multiline
                  fullWidth
                  rows="4"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
            </Grid>
            <Grid xs={3} key="4" className={classes.itemm}>
              <Paper className={classes.paper}>
                <TextField
                  id="blocker-notes"
                  multiline
                  fullWidth
                  rows="4"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
            </Grid>
          </Grid>
        ))}
        <Button onClick={() => save(meeting)}>Save</Button>
      </form>
    </Box>
  )
}

Meeting.propTypes = {
  teamName: PropTypes.string.isRequired,
  people: PropTypes.array.isRequired,
  save: PropTypes.func.isRequired,
}
export default Meeting
