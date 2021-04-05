import React, { useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import { Menu, MenuItem, IconButton, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt'
import MoreVert from '@material-ui/icons/MoreVert'
import AddIcon from '@material-ui/icons/Add'
// import Auth from '/imports/ui/components/account/auth.js'
// import ThemeSwitcher from '/imports/ui/components/themes-switcher.js'

import { guestMenu } from './links.js'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'black',
    color: 'white',
    height: '64px',
  },
  logo: {
    height: 60,
    '&:hover': {
      filter: `brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)`,
    },
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'inline-flex',
      verticalAlign: 'middle',
    },
  },
  icon: {
    display: 'flex',
    verticalAlign: 'middle',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  links: {
    flexGrow: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  navItem: {
    '&:hover': {
      filter: `brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)`,
    },
  },
  linkText: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'inline',
    },
    fontFamily: 'GothamRoundedMedium',
    '&:hover': {
      color: '#4794fc',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      float: 'right',
      paddingLeft: '20px',
      borderLeft: '1px solid white',
    },
  },
  sectionMobile: {
    display: 'inline',
    float: 'right',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  rightText: {
    fontFamily: 'GothamRoundedMedium',
    margin: '20px',
  },
}))

export default function UserNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const classes = useStyles()
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const { push } = useHistory()

  const mobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const mobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={mobileMenuClose}
    >
      <MenuItem component={Link} to="/add">
        <IconButton aria-label="logout" color="inherit">
          <AddIcon />
        </IconButton>
        Add property
      </MenuItem>
      <MenuItem component={Link} to="/signup">
        <IconButton aria-label="logout" color="inherit">
          <PersonAddIcon />
        </IconButton>
        Sign up
      </MenuItem>
      <MenuItem component={Link} to="/login">
        <IconButton aria-label="logout" color="inherit">
          <ArrowRightAltIcon />
        </IconButton>
        Log in
      </MenuItem>
    </Menu>
  )

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img className={classes.logo} src="/images/logo.png" alt="Startup Inc logo" />
        </Link>
        {guestMenu &&
          guestMenu.map((item, index) => {
            return (
              <Typography
                key={item.display + index}
                color="inherit"
                className={classes.links}
                noWrap
              >
                {item.external ? (
                  <a
                    href={item.link}
                    style={{ color: 'white', textDecoration: 'none' }}
                    id={item.display.toLowerCase() + '-nav-item'}
                    className={classes.navItem}
                  >
                    <span className={classes.icon}>{item.icon()}</span>
                    <span className={classes.linkText}>{item.display}</span>
                  </a>
                ) : (
                  <Link
                    to={item.link}
                    style={{ color: 'white', textDecoration: 'none' }}
                    id={item.display.toLowerCase() + '-nav-item'}
                    className={classes.navItem}
                  >
                    <span className={classes.icon}>{item.icon()}</span>
                    <span className={classes.linkText}>{item.display}</span>
                  </Link>
                )}
              </Typography>
            )
          })}
        <div className={classes.sectionDesktop}>
          <Link
            to="/add"
            style={{ color: 'white', textDecoration: 'none' }}
            id={'add-property-nav-item'}
            className={classes.navItem}
          >
            <span className={classes.rightText}>Add property</span>
          </Link>
          <Link
            to="/signup"
            style={{ color: 'white', textDecoration: 'none' }}
            id={'signup-nav-item'}
            className={classes.navItem}
          >
            <span className={classes.rightText}>Sign up</span>
          </Link>
          <Link
            to="/login"
            style={{ color: 'white', textDecoration: 'none' }}
            id={'login-nav-item'}
            className={classes.navItem}
          >
            <span className={classes.rightText}>Log in</span>
          </Link>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={mobileMenuOpen}
            color="inherit"
          >
            <MoreVert />
          </IconButton>
        </div>
        {renderMobileMenu}
      </Toolbar>
    </AppBar>
  )
}
