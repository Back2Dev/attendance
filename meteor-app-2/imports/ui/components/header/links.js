import React from 'react'
import Dashboard from '@material-ui/icons/Dashboard'
import HelpIcon from '@material-ui/icons/Help'
import CalendarToday from '@material-ui/icons/CalendarToday'
import FileCopy from '@material-ui/icons/FileCopy'
import Apartment from '@material-ui/icons/Apartment'
import HomeIcon from '@material-ui/icons/Home'
import InfoIcon from '@material-ui/icons/Info'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import PhoneIcon from '@material-ui/icons/Phone'

export const userMenu = [
  {
    display: 'Dashboard',
    link: '/dashboard',
    icon: () => <Dashboard fontSize="small" />,
  },
  {
    display: 'Properties',
    link: '/properties',
    icon: () => <Apartment fontSize="small" />,
  },
  {
    display: 'Support',
    link: '/support',
    icon: () => <HelpIcon fontSize="small" />,
  },
]

export const guestMenu = [
  {
    display: 'Home',
    link: '/',
    icon: () => <HomeIcon fontSize="small" />,
    external: false,
  },
  {
    display: 'About',
    link: 'https://mydomain.com.au/about-us/',
    icon: () => <InfoIcon fontSize="small" />,
    external: true,
  },
  {
    display: 'News',
    link: 'https://mydomain.com.au/news/',
    icon: () => <LibraryBooksIcon fontSize="small" />,
    external: true,
  },
  {
    display: 'Contact',
    link: 'https://mydomain.com.au/contact/',
    icon: () => <PhoneIcon fontSize="small" />,
    external: true,
  },
]
