import React from 'react'
import Dashboard from '@material-ui/icons/Dashboard'
import HelpIcon from '@material-ui/icons/Help'
import HomeIcon from '@material-ui/icons/Home'
import PhoneIcon from '@material-ui/icons/Phone'
import EventIcon from '@material-ui/icons/Event'

const DashBoardMenuIcon = () => <Dashboard fontSize="small" />
const FormsMenuIcon = () => <EventIcon fontSize="small" />
const SupportMenuIcon = () => <HelpIcon fontSize="small" />
const HomeMenuIcon = () => <HomeIcon fontSize="small" />
const ContactMenuIcon = () => <PhoneIcon fontSize="small" />

export const userMenu = [
  {
    display: 'Dashboard',
    link: '/dashboard',
    icon: DashBoardMenuIcon,
    id: 'dashboard',
  },
  {
    display: 'Forms',
    link: '/admin/forms',
    icon: FormsMenuIcon,
    id: 'forms',
  },
  {
    display: 'Support',
    link: '/support',
    icon: SupportMenuIcon,
    id: 'support',
  },
]

export const guestMenu = [
  {
    display: 'Home',
    link: '/',
    icon: HomeMenuIcon,
    external: false,
  },
  {
    display: 'Contact',
    link: 'https://mydomain.com.au/contact/',
    icon: ContactMenuIcon,
    external: true,
  },
]
