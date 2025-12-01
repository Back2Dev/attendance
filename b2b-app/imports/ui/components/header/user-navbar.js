/* global Roles */
import { Meteor } from 'meteor/meteor'
import React, { useContext } from 'react'
import { Session } from 'meteor/session'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import MoreVert from '@mui/icons-material/MoreVert'
import ExitToApp from '@mui/icons-material/ExitToApp'
import ADMSideDrawer from './adm-side-drawer'
import OtherSideDrawer from './other-side-drawer'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import CONSTANTS from '/imports/api/constants'
import { convertAvatar } from '/imports/api/util.js'
import info from '/imports/api/version'
import NotificationsIcon from '/imports/ui/components/notifications/bell.js'
import ThemeSwitcher from '/imports/ui/components/themes-switcher.js'
import { showInfo, showError } from '/imports/ui/utils/toast-alerts'
import { userMenu, guestMenu } from './links.js'
import useHistory from '/imports/ui/utils/history'

const hoverFilter =
  'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)'
const avatarSize = 24

export default function UserNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)
  const [expanded, setExpanded] = React.useState(false)
  const [role, setRole] = React.useState()

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const { member, user, viewas } = useContext(AccountContext)
  const { push } = useHistory()

  const roles = Roles.getRolesForUser(user)
  const isAdmin = user && Roles.userIsInRole(user, ['ADM'])

  React.useEffect(() => {
    const prevRole = localStorage.getItem('viewas')

    if (!prevRole || !Roles.userIsInRole(user, [prevRole])) {
      if (roles) {
        Session.set('viewas', roles[0]?._id)
        localStorage.setItem('viewas', roles[0]?._id)
        setRole(Session.get('viewas'))
      }
    } else {
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
    const newRole = event.target.value
    setRole(newRole)
    Session.set('viewas', newRole)
    localStorage.setItem('viewas', newRole)
    showInfo(`Role switched to ${CONSTANTS.ROLES[newRole] || newRole}`, {
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
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      id={menuId}
      data-cy={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={closeMenu}
      PaperProps={{ sx: expanded ? { mr: '10px' } : {} }}
    >
      <MenuItem
        onClick={() => {
          closeMenu()
        }}
        component={Link}
        to="/profile"
        sx={{ fontFamily: 'GothamRoundedMedium' }}
        key="prefs"
        data-cy="a-tag-profile"
      >
        Profile
      </MenuItem>
      {roles?.length > 1 && (
        <MenuItem
          sx={{ fontFamily: 'GothamRoundedMedium' }}
          onClick={() => setExpanded(!expanded)}
          key="switch"
          data-cy="switch-role"
        >
          Switch role
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
            {roles?.map((_role) => {
              return (
                <FormControlLabel
                  sx={{ ml: '15px' }}
                  value={_role}
                  control={<Radio />}
                  label={CONSTANTS.ROLES[_role] || _role}
                  key={_role}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Collapse>
      <MenuItem
        onClick={onLogout}
        sx={{ fontFamily: 'GothamRoundedMedium' }}
        key="logout"
        data-cy="logout-menu"
      >
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
          size="large"
        >
          <Avatar src={convertAvatar(member?.avatar)} sx={{ width: avatarSize, height: avatarSize }} />
        </IconButton>
        Member
      </MenuItem>
      <MenuItem onClick={() => setExpanded(!expanded)} key="switch">
        <IconButton aria-label="set-role" color="inherit" size="large">
          <GroupIcon />
        </IconButton>
        Switch role
      </MenuItem>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="roles"
            name="set-role"
            value={role}
            onChange={changeRole}
          >
            {roles?.map((_role) => {
              return (
                <FormControlLabel
                  sx={{ ml: '15px' }}
                  value={_role}
                  control={<Radio />}
                  label={CONSTANTS.ROLES[_role]}
                  key={_role}
                />
              )
            })}
          </RadioGroup>
        </FormControl>
      </Collapse>
      <MenuItem onClick={onLogout} key="logout">
        <IconButton aria-label="logout" color="inherit" data-cy="logout-icon" size="large">
          <ExitToApp />
        </IconButton>
        Log out
      </MenuItem>
    </Menu>
  )

  const navItems = userMenu || guestMenu

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'black', color: 'white', height: '64px' }}>
        <Toolbar>
          {isAdmin && viewas === 'ADM' ? <ADMSideDrawer /> : <OtherSideDrawer />}
          <Tooltip title={`B2B version ${info?.version()}`}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box
                component="img"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  height: 60,
                  '&:hover': {
                    filter:
                      "brightness(1.3) invert(0.17) saturate(2.6) sepia(0.25) url('#teal-white')",
                  },
                }}
                src="/images/logo.png"
                alt="Back2bikes logo"
              />
            </Link>
          </Tooltip>
          {navItems &&
            navItems.map((item, index) => {
              return (
                <Typography
                  key={item.display + index}
                  color="inherit"
                  sx={{ flexGrow: 1, textAlign: 'center', fontSize: 14 }}
                  noWrap
                >
                  {item.external ? (
                    <a
                      href={item.link}
                      style={{ color: 'white', textDecoration: 'none' }}
                      id={item.display.toLowerCase() + '-nav-item'}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: { xs: 'flex', md: 'none' },
                          verticalAlign: 'middle',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon()}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          display: { xs: 'none', md: 'inline' },
                          fontFamily: 'GothamRoundedMedium',
                          '&:hover': { color: '#4794fc' },
                        }}
                      >
                        {item.display}
                      </Box>
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      style={{ color: 'white', textDecoration: 'none' }}
                      id={item.display.toLowerCase() + '-nav-item'}
                      data-cy={item.id}
                    >
                      <Box
                        component="span"
                        sx={{
                          display: { xs: 'flex', md: 'none' },
                          verticalAlign: 'middle',
                          alignItems: 'center',
                          justifyContent: 'center',
                          '&:hover': { filter: hoverFilter },
                        }}
                      >
                        {item.icon()}
                      </Box>
                      <Box
                        component="span"
                        sx={{
                          display: { xs: 'none', md: 'inline' },
                          fontFamily: 'GothamRoundedMedium',
                          '&:hover': { color: '#4794fc' },
                        }}
                      >
                        {item.display}
                      </Box>
                    </Link>
                  )}
                </Typography>
              )
            })}
          {roles?.length > 1 && (
            <>
              <Box
                sx={{
                  fontFamily: 'GothamRoundedMedium',
                  display: { xs: 'none', lg: 'block' },
                  mr: 1,
                }}
              >
                {CONSTANTS.ROLES[viewas]}
              </Box>
              <Typography
                sx={{ fontFamily: 'GothamRoundedMedium', display: { xs: 'block', md: 'none' } }}
              >
                {viewas}
              </Typography>
            </>
          )}
          <NotificationsIcon />
          <ThemeSwitcher />
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              float: 'right',
            }}
            key="1"
          >
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              data-cy={menuId}
              aria-haspopup="true"
              onClick={profileMenuOpen}
              color="inherit"
              size="large"
            >
              <Avatar src={convertAvatar(member?.avatar)} sx={{ width: avatarSize, height: avatarSize }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: { xs: 'inline', md: 'none' },
              float: 'right',
            }}
            key="2"
          >
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              data-cy={mobileMenuId}
              aria-haspopup="true"
              onClick={mobileMenuOpen}
              color="inherit"
              size="large"
            >
              <MoreVert />
            </IconButton>
          </Box>
          {renderMobileMenu}
          {renderMenu}
        </Toolbar>
      </AppBar>
    </>
  )
}
