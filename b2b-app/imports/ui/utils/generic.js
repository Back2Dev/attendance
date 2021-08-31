import React from 'react'
import PropTypes from 'prop-types'
import { default as MUIButton } from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import { default as MUIFabButton } from '@material-ui/core/Fab'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import LinearProgress from '@material-ui/core/LinearProgress'
import { withStyles, makeStyles } from '@material-ui/core/styles'

export const Segment = (props) => <span>{props.children}</span>

export default { Segment }

export const BlueButton = withStyles({
  root: {
    color: '#ffffff',
    backgroundColor: '#4794fc',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '&:hover': {
      backgroundColor: '#6BA9FC',
    },
    '&:disabled': {
      color: '#d6d6d6',
      backgroundColor: '#f3f3f3',
      boxShadow: 'none',
      opacity: '0.65',
    },
  },
})(MUIButton)

export const GreyButton = withStyles({
  root: {
    color: '#f0efee',
    backgroundColor: '#aeafb0',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '&:hover': {
      backgroundColor: '#aeafb0',
    },
    '&:disabled': {
      color: '#d6d6d6',
      backgroundColor: '#f3f3f3',
      boxShadow: 'none',
      opacity: '0.65',
    },
  },
})(MUIButton)

export const GreenButton = withStyles(({ palette }) => ({
  root: {
    color: '#fff',
    backgroundColor: '#31a750',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '&:hover': {
      backgroundColor: palette.success.dark,
    },
    '&:disabled': {
      color: '#d6d6d6',
      backgroundColor: '#f3f3f3',
      boxShadow: 'none',
      opacity: '0.65',
    },
  },
}))(MUIButton)

export const RedButton = withStyles({
  root: {
    color: '#f0efee',
    backgroundColor: '#ea4435',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '&:hover': {
      backgroundColor: '#ea4435',
    },
    '&:disabled': {
      color: '#d6d6d6',
      backgroundColor: '#f3f3f3',
      boxShadow: 'none',
      opacity: '0.65',
    },
  },
})(MUIButton)

export const GreenFabButton = withStyles(({ palette }) => ({
  root: {
    color: '#fff',
    backgroundColor: '#31a750',
    boxShadow:
      '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
    '&:hover': {
      backgroundColor: palette.success.dark,
    },
    '&:disabled': {
      color: '#d6d6d6',
      backgroundColor: '#f3f3f3',
      boxShadow: 'none',
      opacity: '0.65',
    },
  },
}))(MUIFabButton)

export const Button = withStyles({})(MUIButton)

const tabAppbarStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    '& .MuiToolbar-gutters': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  title: {
    flexGrow: 1,
  },
  search: { marginRight: 10, width: 200 },
  buttons: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

export const TabAppbar = ({ title, buttons, onChange, search, defaultValue }) => {
  const classes = tabAppbarStyles()

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar>
          <Typography variant="h1" className={classes.title}>
            {title}
          </Typography>
          {search && (
            <>
              <TextField
                id="search-field"
                placeholder="Search…"
                onChange={onChange}
                defaultValue={defaultValue}
                className={classes.search}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
          {buttons && (
            <div className={classes.buttons}>
              {buttons.map((btn) => (
                <Button
                  id={btn.id}
                  key={btn.id}
                  onClick={btn.action}
                  color={btn.color}
                  variant="contained"
                >
                  {btn.caption}
                </Button>
              ))}
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export const LinearProgressWithLabel = (props) => {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1} key="progress">
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35} key="value">
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
}
