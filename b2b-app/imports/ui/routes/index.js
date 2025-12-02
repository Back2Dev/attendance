import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import SecureRoute from '/imports/ui/utils/secure-route.js'

import Loading from '/imports/ui/components/commons/loading.js'

const HomePage = lazy(() => import('/imports/ui/pages/home.js'))
const AdminPage = lazy(() => import('/imports/ui/pages/admin.js'))
const DBAdminPage = lazy(() => import('/imports/ui/pages/dbadmin'))
const HacksPage = lazy(() => import('/imports/ui/pages/hacks.js'))
// const Dashboard = lazy(() => import('/imports/ui/pages/dashboard.js'))
const BookingsPage = lazy(() => import('/imports/ui/pages/bookings.js'))
// const DivePage = lazy(() => import('/imports/ui/pages/dive'))
const SessionsPage = lazy(() => import('/imports/ui/pages/sessions.js'))
const ServicesPage = lazy(() => import('/imports/ui/pages/services.js'))
const DailyStandupPage = lazy(() => import('/imports/ui/admin/teams/daily-standup.js'))
const UserPage = lazy(() => import('/imports/ui/pages/user.js'))
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

const TestPage = lazy(() => import('/imports/ui/pages/test.js'))

export default function MainRoutes() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Routes>
        {/* TODO Change back to secure route after debugging */}
        <Route
          path="/admin/*"
          element={
            <SecureRoute roles={['ADM']}>
              <AdminPage />
            </SecureRoute>
          }
        />
        <Route
          path="/dba/*"
          element={
            <SecureRoute roles={['ADM']}>
              <DBAdminPage />
            </SecureRoute>
          }
        />
        <Route
          path="/hacks/*"
          element={
            <SecureRoute roles={['ADM']}>
              <HacksPage />
            </SecureRoute>
          }
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/logged-out" element={<LoggedOut />} />
        {/* Onboarding routes */}
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/*
        TODO: Shorten this url - most of it is probably redundant - quite likely it
        could be simply /signup/:token
        */}

        <Route path="/confirmation-sent" element={<ConfirmationSent />} />
        <Route path="/signed-up/:userId/:token" element={<ConfirmPassword />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/add-google" element={<AddGoogleConfirm />} />
        <Route path="/add-facebook" element={<AddFacebookConfirm />} />
        {/* Task pages routes */}

        <Route
          path="/profile"
          element={
            <SecureRoute>
              <UserPage />
            </SecureRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <SecureRoute>
              <UserPage />
            </SecureRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <SecureRoute>
              <BookingsPage />
            </SecureRoute>
          }
        />
        {/* <Route path="/dive" element={<SecureRoute component={DivePage} />} /> */}
        <Route
          path="/sessions/*"
          element={
            <SecureRoute>
              <SessionsPage />
            </SecureRoute>
          }
        />
        <Route
          path="/services"
          element={
            <SecureRoute>
              <ServicesPage />
            </SecureRoute>
          }
        />
        <Route
          path="/daily-standup"
          element={
            <SecureRoute>
              <DailyStandupPage />
            </SecureRoute>
          }
        />
        <Route
          path="/support"
          element={
            <SecureRoute>
              <SupportPage />
            </SecureRoute>
          }
        />
        <Route
          path="/test"
          element={
            <SecureRoute>
              <TestPage />
            </SecureRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
