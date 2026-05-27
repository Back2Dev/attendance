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
} from '@mui/material'
import Build from '@mui/icons-material/Build'
import MenuIcon from '@mui/icons-material/Menu'
import InfoIcon from '@mui/icons-material/Info'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import PhoneIcon from '@mui/icons-material/Phone'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'

import { AccountContext } from '/imports/ui/contexts/account-context.js'

const domain = Meteor.settings.public.webdomain

const menus = [
  {
    display: 'About',
    link: `${domain}/about-us/`,
    icon: <InfoIcon />,
  },
  {
    display: 'News',
    link: `${domain}/news/`,
    icon: <LibraryBooksIcon />,
  },
  {
    display: 'Contact us',
    link: `${domain}/contact/`,
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
  { display: 'Daily Standup', link: '/daily-standup', icon: <EmojiPeopleIcon /> },
]

const hoverFilter =
  'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)'

export default function SideDrawer() {
  const { viewas } = useContext(AccountContext)

  const [drawer, setDrawer] = React.useState(false)
  const [open, setOpen] = React.useState([])

  const toggleDrawer = (openState) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawer(openState)
    if (!openState) {
      setOpen([])
    }
  }

  const renderMenus = () => {
    if (!menus || !menus.length) return null
    return menus.map((item, index) => (
      <List key={index}>
        <Link component={RouterLink} to={item.link} underline="none">
          <ListItem button>
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.display}
              primaryTypographyProps={{
                sx: {
                  fontSize: 15,
                  color: 'primary.main',
                  fontFamily: 'GothamRoundedMedium',
                },
              }}
            />
          </ListItem>
        </Link>
      </List>
    ))
  }

  const renderGreeterMenus = () => {
    if (!greeterMenus || !greeterMenus.length) return null
    if (viewas !== 'GRE') return null
    return greeterMenus.map((item, index) => (
      <List key={index}>
        <Link component={RouterLink} to={item.link} underline="none">
          <ListItem button>
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.display}
              primaryTypographyProps={{
                sx: {
                  fontSize: 15,
                  color: 'primary.main',
                  fontFamily: 'GothamRoundedMedium',
                },
              }}
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
        sx={{ width: 250 }}
      >
        {renderMenus()}
        {renderGreeterMenus()}
      </List>
    </div>
  )

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        color="inherit"
        size="large"
        sx={{ '&:hover svg': { filter: hoverFilter } }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  )
}
