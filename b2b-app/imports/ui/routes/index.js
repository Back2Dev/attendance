import React, { Suspense, lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import SecureRoute from '/imports/ui/utils/secure-route.js'

import Loading from '/imports/ui/components/commons/loading.js'

const HomePage = lazy(() => import('/imports/ui/pages/home.js'))
const AdminPage = lazy(() => import('/imports/ui/pages/admin.js'))
const HacksPage = lazy(() => import('/imports/ui/pages/hacks.js'))
// const Dashboard = lazy(() => import('/imports/ui/pages/dashboard.js'))
const BookingsPage = lazy(() => import('/imports/ui/pages/bookings.js'))
const MemberPortalPage = lazy(() => import('/imports/ui/pages/member-portal.js'))
const NotFoundPage = lazy(() => import('/imports/ui/pages/not-found.js'))
const LoggedOut = lazy(() => import('/imports/ui/pages/logged-out.js'))
const Signup = lazy(() => import('/imports/ui/pages/signup/signup.js'))
const Login = lazy(() => import('/imports/ui/components/account/login.js'))
const ConfirmPassword = lazy(() => import('/imports/ui/pages/signup/confirm-password.js'))
const ConfirmationSent = lazy(() =>
  import('/imports/ui/pages/signup/confirmation-sent.js')
)
const ForgotPassword = lazy(() =>
  import('/imports/ui/pages/forgot-password/forgot-password.js')
)
const AddGoogleConfirm = lazy(() =>
  import('/imports/ui/components/google-login/add-google-confirm.js')
)
const AddFacebookConfirm = lazy(() =>
  import('/imports/ui/components/facebook-login/add-facebook-confirm.js')
)

const ResetPassword = lazy(() =>
  import('/imports/ui/pages/forgot-password/reset-password.js')
)

const SupportPage = lazy(() => import('/imports/ui/pages/support.js'))
const UserPreferences = lazy(() =>
  import('/imports/ui/pages/user-preferences/user-preferences.js')
)

export default function MainRoutes() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        <SecureRoute roles={['ADM']} path="/admin" component={AdminPage} />
        <SecureRoute roles={['ADM']} path="/hacks" component={HacksPage} />
        <Route path="/" exact component={HomePage} />
        <Route path="/logged-out" exact component={LoggedOut} />
        {/* Onboarding routes */}
        <Route path="/reset-password/:userId/:token" exact component={ResetPassword} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        {/*
        TODO: Shorten this url - most of it is probably redundant - quite likely it
        could be simply /signup/:token
        */}

        <Route path="/confirmation-sent" component={ConfirmationSent} />
        <Route path="/signed-up/:userId/:token" component={ConfirmPassword} />
        <Route path="/forgot" component={ForgotPassword} />
        <Route path="/add-google" component={AddGoogleConfirm} />
        <Route path="/add-facebook" component={AddFacebookConfirm} />
        {/* Task pages routes */}

        <SecureRoute path="/profile" component={UserPreferences} />

        <SecureRoute path="/dashboard" exact component={MemberPortalPage} />
        <SecureRoute path="/bookings" exact component={BookingsPage} />
        <SecureRoute path="/support" component={SupportPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Suspense>
  )
}
