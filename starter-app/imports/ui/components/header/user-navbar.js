import { Meteor } from 'meteor/meteor'
import React, { useContext } from 'react'
import { Session } from 'meteor/session'
import { Link, useHistory } from 'react-router-dom'
import AppBar from '@material-ui/core/AppBar'
import {
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Toolbar,
  Typography,
  Collapse,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@material-ui/core'
import GroupIcon from '@material-ui/icons/Group'
import MoreVert from '@material-ui/icons/MoreVert'
import ExitToApp from '@material-ui/icons/ExitToApp'
import { makeStyles } from '@material-ui/core/styles'
import ADMSideDrawer from './adm-side-drawer'
import OtherSideDrawer from './other-side-drawer'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import CONSTANTS from '/imports/api/constants'
import { convertAvatar } from '/imports/api/util.js'

// import Auth from '/imports/ui/components/account/auth.js'
// import ThemeSwitcher from '/imports/ui/components/themes-switcher.js'
import NotificationsIcon from '/imports/ui/components/notifications/bell.js'
import { showInfo, showError } from '/imports/ui/utils/toast-alerts'
import { userMenu } from './links.js'

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: 'black',
    color: 'white',
    height: '64px',
  },
  role: {
    fontFamily: 'GothamRoundedMedium',
    fontSize: 14,
  },
  logo: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      height: 60,
      '&:hover': {
        filter:
          'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)',
      },
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
      filter:
        'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)',
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
  accountIcon: {
    [theme.breakpoints.up('md')]: {
      '&:hover': {
        filter:
          'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)',
      },
    },
  },
  profileItem: {
    fontFamily: 'GothamRoundedMedium',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      float: 'right',
    },
  },
  subMenuItems: {
    marginLeft: '15px',
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
  expandedOpen: {
    marginRight: '10px',
  },
  roleLong: {
    fontFamily: 'GothamRoundedMedium',
    [theme.breakpoints.down('md')]: {
      display: 'none',
    },
  },
  roleAbbr: {
    fontFamily: 'GothamRoundedMedium',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

export default function UserNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const [expanded, setExpanded] = React.useState(false)
  const [role, setRole] = React.useState()

  const classes = useStyles()
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const { profile, user, viewas } = useContext(AccountContext)
  const { push } = useHistory()

  const isAdmin =
    user && user.roles ? user.roles.some((role) => role['_id'] === 'ADM') : false

  React.useEffect(() => {
    const prevRole = localStorage.getItem('viewas')

    if (!prevRole || !user.roles.some((_role) => _role._id === prevRole)) {
      // defaults the role to the first role available
      Session.set('viewas', user.roles[0]._id)
      localStorage.setItem('viewas', user.roles[0]._id)
      setRole(Session.get('viewas'))
    } else {
      // if prev role found then set to session var
      Session.set('viewas', prevRole)
      setRole(prevRole)
    }
  }, [])

  const profileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const mobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const closeMenu = () => {
    setAnchorEl(null)
    mobileMenuClose()
  }

  const mobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const changeRole = (event) => {
    setRole(event.target.value)
    //Whenever we switch roles we view properties
    push('/properties')
    Session.set('viewas', event.target.value)
    localStorage.setItem('viewas', event.target.value)
    showInfo(`Role switched to ${CONSTANTS.ROLES[event.target.value]}`, {
      autoClose: 2000,
    })
    closeMenu()
  }

  const onLogout = (e) => {
    e.preventDefault()
    Meteor.logout((error) => {
      if (error) {
        showError(error.message)
      } else {
        push('/logged-out')
      }
    })
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      id={menuId}
      data-cy={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={closeMenu}
      className={expanded ? classes.expandedOpen : null}
    >
      <MenuItem
        onClick={() => {
          closeMenu()
        }}
        component={Link}
        to="/profile"
        className={classes.profileItem}
        key="prefs"
        data-cy="a-tag-profile"
      >
        Profile
      </MenuItem>
      {user.roles.length > 1 && (
        <MenuItem
          className={classes.profileItem}
          onClick={() => setExpanded(!expanded)}
          key="switch"
        >
          Switch roles
        </MenuItem>
      )}
      <Collapse in={expanded} timeout="auto" unmountOnExit key="submenu">
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="roles"
            name="set-role"
            value={role}
            onChange={changeRole}
          >
            {user.roles.map((_role) => {
              return (
                <FormControlLabel
                  className={classes.subMenuItems}
                  value={_role._id}
                  control={<Radio />}
                  label={CONSTANTS.ROLES[_role._id]}
                  key={_role._id}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Collapse>
      <MenuItem onClick={onLogout} className={classes.profileItem} key="logout">
        Log out
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      data-cy={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={mobileMenuClose}
    >
      <MenuItem component={Link} to="/profile" key="preferences">
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar src={convertAvatar(profile?.avatar)} className={classes.small} />
        </IconButton>
        Profile
      </MenuItem>
      <MenuItem onClick={() => setExpanded(!expanded)} key="switch">
        <IconButton aria-label="set-role" color="inherit">
          <GroupIcon />
        </IconButton>
        Switch Roles
      </MenuItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="roles"
            name="set-role"
            value={role}
            onChange={changeRole}
          >
            {user.roles.map((_role) => {
              return (
                <FormControlLabel
                  className={classes.subMenuItems}
                  value={_role._id}
                  control={<Radio />}
                  label={CONSTANTS.ROLES[_role._id]}
                  key={_role._id}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Collapse>
      <MenuItem onClick={onLogout} key="logout">
        <IconButton aria-label="logout" color="inherit">
          <ExitToApp />
        </IconButton>
        Log out
      </MenuItem>
    </Menu>
  )

  return (
    <>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          {isAdmin && viewas === 'ADM' ? <ADMSideDrawer /> : <OtherSideDrawer />}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              className={classes.logo}
              src="/images/Mydomain_logo_PRIMARY_REV_RGB.png"
              alt="back2bikes_logo"
            />
          </Link>
          {userMenu &&
            userMenu.map((item, index) => {
              return (
                <Typography
                  key={item.display + index}
                  color="inherit"
                  className={classes.links}
                  noWrap
                >
                  <Link
                    to={item.link}
                    style={{ color: 'white', textDecoration: 'none' }}
                    id={item.display.toLowerCase() + '-nav-item'}
                    className={classes.navItem}
                  >
                    <span className={classes.icon}>{item.icon()}</span>
                    <span className={classes.linkText}>{item.display}</span>
                  </Link>
                </Typography>
              )
            })}
          {user.roles.length > 1 && (
            <>
              <div className={classes.roleLong}>{CONSTANTS.ROLES[viewas]}</div>
              <Typography className={classes.roleAbbr}>{viewas}</Typography>
            </>
          )}
          <NotificationsIcon />
          <div className={classes.sectionDesktop} key="1">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              data-cy={menuId}
              aria-haspopup="true"
              onClick={profileMenuOpen}
              color="inherit"
            >
              <Avatar src={convertAvatar(profile?.avatar)} className={classes.small} />
            </IconButton>
          </div>
          <div className={classes.sectionMobile} key="2">
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              data-cy={mobileMenuId}
              aria-haspopup="true"
              onClick={mobileMenuOpen}
              color="inherit"
            >
              <MoreVert />
            </IconButton>
          </div>
          {renderMobileMenu}
          {renderMenu}
        </Toolbar>
      </AppBar>
    </>
  )
}
