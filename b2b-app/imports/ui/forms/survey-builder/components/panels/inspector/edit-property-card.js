import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Chip from '@material-ui/core/Chip'
import { PropertyField } from './edit-property'
import AddIcon from '@material-ui/icons/Add'
import Typography from '@material-ui/core/Typography'
import { useRecoilCallback, useRecoilState } from 'recoil'
import {
  editInspectorState,
  getInspectorPart,
} from '/imports/ui/forms/survey-builder/recoil/atoms'
import { get } from 'lodash'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    marginTop: 10,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  list: {
    width: '100%',
    maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
  },
  badge: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  id: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    padding: '0.5rem',
  },
  content: {
    padding: '0.5rem',
  },
  listIcon: {
    minWidth: '0px',
  },
})

const PropertyCard = ({ path, children, pid, addOptions, isSection }) => {
  const classes = useStyles()
  const [part] = useRecoilState(getInspectorPart({ pid }))
  const options = [...addOptions].map((opt) => ({
    label: opt.label,
    value: path ? `${path}.${opt.value}` : opt.value,
  }))

  const showContent = Boolean(
    options.find((opt) => get(part, opt.value) === '' || get(part, opt.value) === true)
  )

  const setPropertyByValue = useRecoilCallback(({ set }) => (path) => {
    set(editInspectorState({ pid, path }), (property) => {
      if (property === undefined) {
        return path === 'optional' ? true : ''
      } else {
        return undefined
      }
    })
  })

  const handleToggle = (value) => () => {
    setPropertyByValue(value)
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        className={classes.header}
        action={<CardMenu options={options} handleToggle={handleToggle} part={part} />}
        title={
          <PropertyField
            pid={pid}
            path={path ? `${path}.name` : isSection ? 'name' : 'prompt'}
            placeholder={
              path
                ? isSection
                  ? 'Section Name'
                  : 'Type Your Answer'
                : 'Type Your Question'
            }
          />
        }
        subheader={
          <div className={classes.id}>
            <Typography variant="body2">ID: </Typography>
            <PropertyField pid={pid} path={path ? `${path}.id` : 'id'} />
          </div>
        }
      />
      {showContent && (
        <CardContent className={classes.content}>
          <div className={classes.badge}>
            {(part['optional'] || part[path]?.['opational']) && (
              <Chip label="otional" variant="outlined" />
            )}
          </div>
          {children}
        </CardContent>
      )}
    </Card>
  )
}

export { PropertyCard }

export default function CardMenu({ part, options, handleToggle }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton aria-label="add" onClick={handleClick}>
        <AddIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <List className={classes.list}>
          {options.map((item) => {
            const labelId = item.label

            const checked = get(part, item.value)
            return (
              <ListItem
                key={item.value}
                role={undefined}
                dense
                button
                onClick={handleToggle(item.value)}
              >
                <ListItemIcon className={classes.listIcon}>
                  <Checkbox
                    edge="start"
                    checked={Boolean(checked || checked === '')}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText id={labelId} primary={item.label} />
              </ListItem>
            )
          })}
        </List>
      </Menu>
    </div>
  )
}
