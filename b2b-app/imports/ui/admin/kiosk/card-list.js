import React from 'react'
import Card from '@mui/material/Card'
import makeStyles from '@mui/styles/makeStyles';
import CardMedia from '@mui/material/CardMedia'
import { CardActionArea, CardContent, Typography } from '@mui/material'
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

const CardList = () => {
  const classes = useStyles()
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'row',
        justifyContent: 'space-around',
        flexDirection: 'column',
        alignContent: 'flex-start',
        justifyContent: 'space-between',
      }}
    >
      <h1>Volunteer Profiles</h1>
      <Card className={classes.root}>
        <CardActionArea>
          <CardMedia className={classes.avatar} image="/images/avatars/1.jpg" />

          <CardContent>
            <Typography variant="body2">Patrick Carmel</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card
        className={classes.root}
        style={{
          order: 1,
          display: 'flex',
          flexFlow: 'row-reverse',
          justifyContent: 'space-around',
          flexDirection: 'row-reverse',
        }}
      >
        <CardActionArea>
          <CardMedia
            className={classes.avatar}
            image="/images/avatars/2.jpg"
            style={{
              display: 'flex',
              flexFlow: 'row-reverse',
              flexWrap: 'row',
            }}
          />

          <CardContent>
            <Typography variant="body2">Theo</Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}

export default CardList
