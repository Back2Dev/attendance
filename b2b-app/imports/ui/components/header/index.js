import React, { useContext } from 'react'
import { AccountContext } from '/imports/ui/contexts/account-context.js'
import Loading from '/imports/ui/components/commons/loading.js'
import UserNavbar from './user-navbar.js'
import GuestNavbar from './guest-navbar.js'

export default function Header() {
  const { isLoggedIn, loading } = useContext(AccountContext)

  // WE SHOULD NOT DO THIS
  // by doing this, it umounts then creates and rerenders all child components inside
  // everytime this component gots rerender.
  // const Navbar = () => {
  //   return isLoggedIn ? <UserNavbar /> : <GuestNavbar />
  // }

  if (loading) {
    return <Loading loading />
  }

  // return <Navbar />
  return isLoggedIn ? <UserNavbar /> : <GuestNavbar />
}
