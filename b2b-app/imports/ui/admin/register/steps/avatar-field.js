import React from 'react'
import { useField } from 'uniforms'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },

  selectedAvatar: {
    height: 0,
    paddingTop: '56.25%', // 16:9,
    backgroundSize: 'contain',
  },

  selectedThumb: {
    border: '5px solid pink',
  },
})

const AvatarField = (rawProps) => {
  const classes = useStyles()
  const [{ name, value, images, onChange }] = useField('avatar', rawProps)

  return (
    <>
      <Card className={classes.root}>
        <CardHeader title="Choose your avatar" />
        <CardMedia
          image={`/images/avatars/${value}`}
          title={value}
          className={classes.selectedAvatar}
        />
        <CardContent>
          <GridList cols={6} cellHeight="auto">
            {images.map((img, idx) => (
              <GridListTile key={idx} onClick={() => onChange(img)}>
                <Avatar
                  src={`/images/avatars/${img}`}
                  alt={img}
                  className={img === value ? classes.selectedThumb : ''}
                />
              </GridListTile>
            ))}
          </GridList>
        </CardContent>
      </Card>
      <input type="hidden" name={name} value={value} />
    </>
  )
}

export default AvatarField
