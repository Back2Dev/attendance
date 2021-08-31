import React, { useContext } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  IconButton,
  Drawer,
  ListItemIcon,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@material-ui/core'
import Build from '@material-ui/icons/Build'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'
import InfoIcon from '@material-ui/icons/Info'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import PhoneIcon from '@material-ui/icons/Phone'

import { AccountContext } from '/imports/ui/contexts/account-context.js'

const menus = [
  {
    display: 'About',
    link: 'https://mydomain.com.au/about-us/',
    icon: <InfoIcon />,
  },
  {
    display: 'News',
    link: 'https://mydomain.com.au/news/',
    icon: <LibraryBooksIcon />,
  },
  {
    display: 'Contact us',
    link: 'https://mydomain.com.au/contact/',
    icon: <PhoneIcon />,
  },
]

const greeterMenus = [
  {
    display: 'Services',
    link: '/services',
    icon: <Build />,
  },
  {
    display: 'Create Services',
    link: '/services/new',
    icon: <Build />,
  },
]

const useStyles = makeStyles((theme) => ({
  hamburger: {
    '&:hover': {
      filter:
        'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)',
    },
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  sideDrawer: {
    width: 250,
  },
  icon: { color: theme.palette.primary.main },
  items: {
    textDecoration: 'none',
    fontSize: 15,
    color: theme.palette.primary.main,
    fontFamily: 'GothamRoundedMedium',
  },
}))

export default function SideDrawer() {
  const { viewas } = useContext(AccountContext)

  const [drawer, setDrawer] = React.useState(false)
  const [open, setOpen] = React.useState([])

  const classes = useStyles()

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawer(open)
    if (!open) {
      setOpen([])
    }
  }

  const renderMenus = () => {
    if (!menus || !menus.length) {
      return null
    }
    return menus.map((item, index) => (
      <List key={index}>
        <Link component={RouterLink} to={item.link}>
          <ListItem button>
            <ListItemIcon className={classes.icon}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.display}
              disableTypography
              className={classes.items}
            />
          </ListItem>
        </Link>
      </List>
    ))
  }

  const renderGreeterMenus = () => {
    if (!greeterMenus || !greeterMenus.length) {
      return null
    }
    if (viewas !== 'GRE') {
      return null
    }
    return greeterMenus.map((item, index) => (
      <List key={index}>
        <Link component={RouterLink} to={item.link}>
          <ListItem button>
            <ListItemIcon className={classes.icon}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.display}
              disableTypography
              className={classes.items}
            />
          </ListItem>
        </Link>
      </List>
    ))
  }

  const list = () => (
    <div onKeyDown={toggleDrawer(false)} onClick={toggleDrawer(false)}>
      <List
        subheader={
          <ListSubheader component="div" id="admin-menu-subheader">
            Back2bikes
          </ListSubheader>
        }
        className={classes.sideDrawer}
      >
        {renderMenus()}
        {renderGreeterMenus()}
      </List>
    </div>
  )

  return (
    <>
      <IconButton onClick={toggleDrawer(true)} color="inherit">
        <MenuIcon className={classes.hamburger} />
      </IconButton>
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  )
}
