import React from 'react'
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
} from '@mui/material'
import Build from '@mui/icons-material/Build'
import Tune from '@mui/icons-material/Tune'
import SettingsEthernet from '@mui/icons-material/SettingsEthernet'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import adminItems from './generated-admin-items'
import { AccountContext } from '/imports/ui/contexts/account-context.js'

const hoverFilter =
  'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)'

const adminMenus = [
  {
    display: 'Hacks',
    id: 'hacks',
    icon: <Build />,
    items: [
      { display: 'Messages', link: '/hacks/transporter' },
      { display: 'Surveys', link: '/hacks/surveys' },
      { display: 'Timeline', link: '/hacks/timeline' },
    ],
  },
  {
    display: 'Admin',
    id: 'admin',
    icon: <Tune />,
    items: adminItems,
  },
  {
    display: 'Manager',
    id: 'manager',
    icon: <Build />,
    items: [
      { display: 'Services', link: '/services' },
      { display: 'Create Services', link: '/services/new' },
      { display: 'Daily Standup', link: '/daily-standup', icon: <EmojiPeopleIcon /> },
    ],
  },
]

export default function SideDrawer() {
  const [drawer, setDrawer] = React.useState(false)
  const [open, setOpen] = React.useState([])
  const { viewas } = React.useContext(AccountContext)

  const handleNestedMenu = (id) => {
    const itemIndex = open.indexOf(id)
    if (itemIndex === -1) {
      setOpen([...open, id])
    } else {
      setOpen(open.filter((item) => item !== id))
    }
  }

  const toggleDrawer = (openState) => (event) => {
    if (event.type === 'keydown' && ['Tab', 'Shift', 'Control', 'Alt'].includes(event.key)) {
      return
    }
    setDrawer(openState)
    if (!openState) {
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
        sx={{ width: 250 }}
      >
        {adminMenus &&
          adminMenus.map((menu, index) => {
            if (!menu.items) {
              return (
                <ListItem key={index}>
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText primary={menu.display} />
                </ListItem>
              )
            }
            return (
              <List key={index}>
                <ListItem button onClick={() => handleNestedMenu(menu.id)}>
                  <ListItemIcon>{menu.icon}</ListItemIcon>
                  <ListItemText
                    primary={menu.display}
                    primaryTypographyProps={{
                      sx: { textDecoration: 'none', fontSize: 16, fontFamily: 'GothamRoundedMedium' },
                    }}
                    data-cy={menu.id}
                  />
                  {open.includes(menu.id) ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={open.includes(menu.id)} timeout="auto" unmountOnExit>
                  <List component="div" onClick={toggleDrawer(false)} disablePadding>
                    {menu.items.map((item, nestedIndex) => (
                      <Link
                        to={item.link}
                        key={item.display + nestedIndex}
                        style={{ textDecoration: 'none' }}
                      >
                        <ListItem button>
                          <ListItemIcon>
                            {item.icon ? item.icon : <SettingsEthernet />}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.display}
                            primaryTypographyProps={{
                              sx: {
                                textDecoration: 'none',
                                fontSize: 15,
                                color: 'primary.main',
                                fontFamily: 'GothamRoundedMedium',
                              },
                            }}
                          />
                        </ListItem>
                      </Link>
                    ))}
                  </List>
                </Collapse>
              </List>
            )
          })}
      </List>
    </div>
  )

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        data-cy="adm-drawer"
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
