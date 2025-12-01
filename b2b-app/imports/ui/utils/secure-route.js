/* global Roles */
import { Meteor } from 'meteor/meteor'
import React, { lazy, useContext } from 'react'
import { AccountContext } from '/imports/ui/contexts/account-context.js'

const NotAuthorized = lazy(() => import('/imports/ui/components/not-authorized.js'))
const Login = lazy(() => import('/imports/ui/components/account/login.js'))

// Returns plain content so it can be used inside <Route element={...}> or directly.
export default function SecureRoute({ roles, component: Component, element, children }) {
  const { isLoggedIn, loading } = useContext(AccountContext)
  const hasRights = roles ? Roles.userIsInRole(Meteor.userId(), roles) : true

  if (!isLoggedIn) {
    return !loading ? <Login /> : null
  }

  if (!hasRights) {
    return <NotAuthorized />
  }

  if (element) return element
  if (Component) return <Component />
  return children || null
}
