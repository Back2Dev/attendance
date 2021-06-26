import React, { useContext } from 'react'
import { useField } from 'uniforms'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import { makeStyles } from '@material-ui/core/styles'

import { RegisterContext } from './context'
import ConditionalWrap from '../conditional-wrap'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: '0 auto',
  },
  selectedAvatar: {
    margin: theme.spacing(0, 'auto', 2, 'auto'),
    height: theme.spacing(16),
    width: theme.spacing(16),
    border: `3px solid ${theme.palette.grey['300']}`,
  },
  thumb: {
    margin: '5px auto',
  },
  selectedThumb: {
    boxShadow: `0 0 2px 4px ${theme.palette.primary.main}`,
  },
}))

const AvatarField = (rawProps) => {
  const classes = useStyles()
  const [{ value, images, onChange }] = useField('avatar', rawProps)
  const { isMobile } = useContext(RegisterContext)

  return (
    <ConditionalWrap
      condition={isMobile}
      wrapFalse={(children) => (
        <Card className={classes.root}>
          <CardContent>{children}</CardContent>
        </Card>
      )}
    >
      <Avatar
        src={`/images/avatars/${value}`}
        alt={value}
        className={classes.selectedAvatar}
      />
      <GridList cols={isMobile ? 4 : 6} cellHeight="auto">
        {images.map((img, idx) => (
          <GridListTile key={idx} onClick={() => onChange(img)}>
            <Avatar
              src={`/images/avatars/${img}`}
              alt={img}
              className={
                img === value
                  ? [classes.thumb, classes.selectedThumb].join(' ')
                  : classes.thumb
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </ConditionalWrap>
  )
}

export default AvatarField
