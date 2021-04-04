import React, { useContext } from 'react'
import {
  IconButton,
  Drawer,
  ListItemIcon,
  ListSubheader,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import { makeStyles } from '@material-ui/core/styles'
import InfoIcon from '@material-ui/icons/Info'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import PhoneIcon from '@material-ui/icons/Phone'

const adminMenus = [
  {
    display: 'About',
    link: 'https://mydomain.com.au/about-us/',
    icon: () => <InfoIcon />,
  },
  {
    display: 'News',
    link: 'https://mydomain.com.au/news/',
    icon: () => <LibraryBooksIcon />,
  },
  {
    display: 'Contact us',
    link: 'https://mydomain.com.au/contact/',
    icon: () => <PhoneIcon />,
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

  const list = () => (
    <div onKeyDown={toggleDrawer(false)}>
      <List
        subheader={
          <ListSubheader component="div" id="admin-menu-subheader">
            Back2bikes
          </ListSubheader>
        }
        className={classes.sideDrawer}
      >
        {adminMenus?.map((item, index) => {
          return (
            <List key={index}>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                key={item.display + index}
                style={{ textDecoration: 'none' }}
              >
                <ListItem button>
                  <ListItemIcon className={classes.icon}>{item.icon()}</ListItemIcon>
                  <ListItemText
                    primary={item.display}
                    disableTypography
                    className={classes.items}
                  />
                </ListItem>
              </a>
            </List>
          )
        })}
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
