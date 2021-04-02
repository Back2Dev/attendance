import React, { lazy, useContext } from 'react'
import { Route } from 'react-router-dom'

import { AccountContext } from '/imports/ui/contexts/account-context.js'

const NotAuthorized = lazy(() => import('/imports/ui/components/not-authorized.js'))
const Login = lazy(() => import('/imports/ui/components/account/login.js'))

export default function SecureRoute({ roles, ...rest }) {
  const { isLoggedIn, loading } = useContext(AccountContext)
  const hasRights = roles ? Roles.userIsInRole(Meteor.userId(), roles) : true
  if (isLoggedIn && hasRights) {
    return <Route {...rest} />
  } else if (isLoggedIn && !hasRights) {
    return <NotAuthorized />
  } else if (!loading && !isLoggedIn) {
    return <Login />
  }
  return <></>
}
