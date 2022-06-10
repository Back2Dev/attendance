import React from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'

const useStyles = makeStyles({
  root: {
    width: '100px',
  },
  media: {
    height: 140,
  },
})

const Kiosk = () => {
  const classes = useStyles()
  return (
    <div>
      <h1>Volunteer Team</h1>

      <Card className={classes.root}>
        <CardMedia className={classes.media} image="/images/avatars/1.jpg" />
      </Card>
    </div>
  )
}

export default Kiosk
