import React from 'react'
import Card from '@mui/material/Card'
import makeStyles from '@mui/styles/makeStyles';
import CardMedia from '@mui/material/CardMedia'

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
