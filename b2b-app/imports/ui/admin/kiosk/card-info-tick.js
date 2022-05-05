import React from 'react'
import Card from '@material-ui/core/Card'
import { makeStyles } from '@material-ui/core/styles'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import { CardActions } from '@material-ui/core'
import { CardActionArea, Typography, Button, Label } from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    width: '345px',
  },
  avatar: {
    height: '350px',
  },
  badge: {
    width: '40px',
  },
})

const CardInfoTick = ({ childcheck, worktype, visitno }) => {
  const classes = useStyles()
  return (
    <div>
      <h1>Volunteer Team</h1>

      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia className={classes.avatar} image="/images/avatars/1.jpg" />

          <CardContent>
            <Typography variant="body2">Patrick Carmel</Typography>
          </CardContent>
          <CardActions>
            <Button color="primary" disabled="true">
              Casual
            </Button>

            {childcheck && <img className={classes.badge} src="/badges/star.png" />}
            {visitno && <img className={classes.badge} src="/badges/card.png" />}
            {worktype && <img className={classes.badge} src="/badges/cup.jpg" />}
          </CardActions>
        </CardActionArea>
      </Card>
    </div>
  )
}

export default CardInfoTick
