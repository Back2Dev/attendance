import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt'
import MoreVert from '@mui/icons-material/MoreVert'
import AddIcon from '@mui/icons-material/Add'
import info from '/imports/api/version'
// import Auth from '/imports/ui/components/account/auth.js'
// import ThemeSwitcher from '/imports/ui/components/themes-switcher.js'

import { guestMenu } from './links.js'

export default function UserNavbar() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

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
        <IconButton aria-label="logout" color="inherit" size="large">
          <AddIcon />
        </IconButton>
        Add property
      </MenuItem>
      <MenuItem component={Link} to="/signup">
        <IconButton aria-label="logout" color="inherit" size="large">
          <PersonAddIcon />
        </IconButton>
        Sign up
      </MenuItem>
      <MenuItem component={Link} to="/login">
        <IconButton aria-label="logout" color="inherit" size="large">
          <ArrowRightAltIcon />
        </IconButton>
        Log in
      </MenuItem>
    </Menu>
  )

  const navItemHover =
    'brightness(0) saturate(100%) invert(69%) sepia(64%) saturate(5548%) hue-rotate(195deg) brightness(101%) contrast(98%)'

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: 'black', color: 'white', height: '64px' }}
    >
      <Toolbar>
        <Tooltip title={`B2B version ${info?.version()}`}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Box
              component="img"
              sx={{
                height: 60,
                '&:hover': { filter: navItemHover },
              }}
              src="/images/logo.png"
              alt="Back2bikes logo"
            />
          </Link>
        </Tooltip>
        {guestMenu &&
          guestMenu.map((item, index) => (
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
                      '&:hover svg': { filter: navItemHover },
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
                      '&:hover svg': { filter: navItemHover },
                    }}
                  >
                    {item.display}
                  </Box>
                </Link>
              )}
            </Typography>
          ))}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            float: 'right',
            pl: '20px',
            borderLeft: '1px solid white',
          }}
        >
          <Link
            to="/add"
            style={{ color: 'white', textDecoration: 'none' }}
            id={'add-property-nav-item'}
          >
            <Box component="span" sx={{ fontFamily: 'GothamRoundedMedium', m: '20px' }}>
              Add property
            </Box>
          </Link>
          <Link
            to="/signup"
            style={{ color: 'white', textDecoration: 'none' }}
            id={'signup-nav-item'}
          >
            <Box component="span" sx={{ fontFamily: 'GothamRoundedMedium', m: '20px' }}>
              Sign up
            </Box>
          </Link>
          <Link
            to="/login"
            style={{ color: 'white', textDecoration: 'none' }}
            id={'login-nav-item'}
          >
            <Box component="span" sx={{ fontFamily: 'GothamRoundedMedium', m: '20px' }}>
              Log in
            </Box>
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: 'inline', md: 'none' },
            float: 'right',
          }}
        >
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={mobileMenuOpen}
            color="inherit"
            size="large"
          >
            <MoreVert />
          </IconButton>
        </Box>
        {renderMobileMenu}
      </Toolbar>
    </AppBar>
  )
}
