import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import {
  IconButton,
  Drawer,
  ListItemIcon,
  Collapse,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import Build from '@material-ui/icons/Build'
import Tune from '@material-ui/icons/Tune'
import SettingsEthernet from '@material-ui/icons/SettingsEthernet'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'
import adminItems from './generated-admin-items'

import { AccountContext } from '/imports/ui/contexts/account-context.js'

const adminMenus = [
  {
    display: 'Hacks',
    id: 'hacks',
    icon: <Build />,
    items: [
      { display: 'Messages', link: '/hacks/transporter' },
      { display: 'Surveys', link: '/hacks/surveys' },
      { display: 'Timeline', link: '/hacks/timeline' },
      // { display: 'Release notes', link: '/hacks/releases' },
    ],
  },
  {
    display: 'Admin',
    id: 'admin',
    icon: () => <Tune />,
    items: adminItems,
  },
  {
    display: 'Manager',
    id: 'manager',
    icon: <Build />,
    items: [
      { display: 'Services', link: '/services' },
      { display: 'Create Services', link: '/services/new' },
    ],
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
  listItem: {
    textDecoration: 'none',
    fontSize: 16,
    fontFamily: 'GothamRoundedMedium',
  },
  nestedItems: {
    textDecoration: 'none',
    fontSize: 15,
    color: theme.palette.primary.main,
    fontFamily: 'GothamRoundedMedium',
  },
}))

export default function SideDrawer() {
  const [drawer, setDrawer] = React.useState(false)
  const [open, setOpen] = React.useState([])

  const classes = useStyles()

  const handleNestedMenu = (id) => {
    const itemIndex = open.indexOf(id)
    if (itemIndex === -1) {
      setOpen([...open, id])
    } else {
      setOpen(open.filter((item) => item != id))
    }
  }

  const toggleDrawer = (open) => (event) => {
    console.log(event.key)
    if (
      event.type === 'keydown' &&
      ['Tab', 'Shift', 'Control', 'Alt'].includes(event.key)
    ) {
      return
    }
    setDrawer(open)
    if (!open) {
      setOpen([])
    }
  }

  const list = () => (
    <div onKeyDown={toggleDrawer(false)}>
      <List
        subheader={
          <ListSubheader component="div" id="admin-menu-subheader">
            Admin Menu
          </ListSubheader>
        }
        className={classes.sideDrawer}
      >
        {adminMenus &&
          adminMenus.map((menu, index) => {
            if (!menu.items) {
              return (
                <ListItem key={index}>
                  <ListItemIcon>{menu.icon()}</ListItemIcon>
                  <ListItemText primary={menu.display} />
                </ListItem>
              )
            } else {
              return (
                <List key={index}>
                  <ListItem button onClick={() => handleNestedMenu(menu.id)}>
                    <ListItemIcon>{menu.icon}</ListItemIcon>
                    <ListItemText
                      primary={menu.display}
                      className={classes.listItem}
                      disableTypography
                    />
                    {open.includes(menu.id) ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={open.includes(menu.id)} timeout="auto" unmountOnExit>
                    <List component="div" onClick={toggleDrawer(false)} disablePadding>
                      {menu.items.map((item, index) => (
                        <Link
                          to={item.link}
                          key={item.display + index}
                          style={{ textDecoration: 'none' }}
                        >
                          <ListItem button>
                            <ListItemText
                              primary={item.display}
                              disableTypography
                              className={classes.nestedItems}
                            />
                          </ListItem>
                        </Link>
                      ))}
                    </List>
                  </Collapse>
                </List>
              )
            }
          })}
      </List>
    </div>
  )

  return (
    <>
      <IconButton onClick={toggleDrawer(true)} data-cy="adm-drawer" color="inherit">
        <MenuIcon className={classes.hamburger} />
      </IconButton>
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </>
  )
}
