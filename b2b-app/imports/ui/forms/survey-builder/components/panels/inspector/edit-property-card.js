import React from 'react'
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
    justifyContent: 'center',
    flexWrap: 'wrap',
    // '& > *': {
    //   margin: theme.spacing(0.5),
    // },
  },
  id: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
})

const PropertyCard = ({ property, path, children, pid, ...props }) => {
  const classes = useStyles()
  const [checked, setChecked] = React.useState([])
  // const [property, setProperty] = useRecoilState(editInspectorState({ pid, path }))

  // const children = Object.keys(property).map((key, j) => {
  //   return createElement(EditProperty, {
  //     key: j,
  //     pid,
  //     path: path ? `${path}.${key}` : key,
  //     relabel,
  //     checked,
  //   })
  // })

  return (
    <Card className={classes.root}>
      <CardHeader
        action={
          <CardMenu
            checked={checked}
            setChecked={setChecked}
            property={property}
            path={path}
            {...props}
          />
        }
        // title={property.prompt ?? property.name ?? 'Title'}
        title={
          <PropertyField
            pid={pid}
            path={path ? `${path}.name` : 'prompt'}
            placeholder={path ? 'Type Your Answer' : 'Type Your Question'}
          />
        }
        subheader={
          <div className={classes.id}>
            <Typography variant="body2">ID: </Typography>
            <PropertyField pid={pid} path={path ? `${path}.id` : 'id'} />
          </div>
          //property.id}
        }
      />
      {Boolean(checked.length) && (
        <CardContent>
          <div className={classes.badge}>
            {checked.includes('optional') && <Chip label="otional" variant="outlined" />}
          </div>
          {children}
        </CardContent>
      )}
    </Card>
  )
}

export { PropertyCard }

export default function CardMenu({ setChecked, checked, property, path, OtherOptions }) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const options = [...Object.keys(property), ...OtherOptions].map((key) => ({
    label: key.toUpperCase(),
    value: path ? `${path}.${key}` : key,
  }))

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  return (
    <div>
      <IconButton aria-label="settings" onClick={handleClick}>
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

            return (
              <ListItem
                key={item.value}
                role={undefined}
                dense
                button
                onClick={handleToggle(item.value)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={checked.indexOf(item.value) !== -1}
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
