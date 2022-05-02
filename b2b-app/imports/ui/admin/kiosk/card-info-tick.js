import React from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { CardActions } from '@material-ui/core'
import { CardActionArea, Typography, Button } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    width: '345px',
  },
  media: {
    height: 164,
  },
})

const CardInfoTick = () => {
  const classes = useStyles()
  return (
    <div>
      <h1>Volunteer Team</h1>

      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia className={classes.media} image="/images/avatars/1.jpg" />
          <CardContent>
            <Typography variant="body2">Patrick Carmel</Typography>
          </CardContent>
          <CardActions>
            <Button color="primary" disabled="true">
              Casual
            </Button>
          </CardActions>
        </CardActionArea>
      </Card>
    </div>
  )
}

export default CardInfoTick
