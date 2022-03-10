import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core/styles'
import { people, teamName } from 'imports/ui/admin/standup-notes/meeting.stories.js'
import { Box, Checkbox, Container, Grid, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import theme from '@react-page/editor/lib/ui/ThemeProvider/DarkTheme'

const useStyles = makeStyles({
  paper: {
    padding: 10,
    margin: 20,
    height: `100%`,
  },
  itemm: { padding: theme.spacing(2) },
})
const themeInstance = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
}
// const [value, setValue] = React.useState('Controlled')

// const handleChange = (event) => {
//   setValue(event.target.value)
// }

const Meeting = ({ teamName }) => {
  const classes = useStyles()

  return (
    <Box sx={{ width: '100%' }}>
      <form>
        <Grid container key="heading">
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
          <Grid container key={ix}>
            <Grid xs={3} key="1" className={classes.itemm}>
              <Paper className={classes.paper}>{person.name}</Paper>
              <Checkbox id="apologies" label="apologies" />
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
      </form>
    </Box>
  )
}

export default Meeting
