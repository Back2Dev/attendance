import React, { useContext } from 'react'
import { AppBar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import CONSTANTS from '/imports/api/constants'

const useStyles = makeStyles((theme) => ({
  appBar: {
    width: '100%',
    top: 'auto',
    bottom: 0,
    textAlign: 'center',
    justify: 'center',
  },
}))

export default function Footer() {
  const { viewas } = useContext(AccountContext)

  const classes = useStyles()

  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      You are now acting as {CONSTANTS.ROLES[viewas]}
    </AppBar>
  )
}
