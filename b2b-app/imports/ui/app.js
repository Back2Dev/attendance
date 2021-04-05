import { Meteor } from 'meteor/meteor'
import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import moment from 'moment'
import 'react-toastify/dist/ReactToastify.css'
import { AccountProvider } from '/imports/ui/contexts/account-context.js'
import { MyThemeProvider } from '/imports/ui/contexts/theme-context.js'
import { LayoutProvider } from '/imports/ui/contexts/layout-context.js'
import ErrorBoundary from '/imports/ui/error-boundary'
import { ConfirmProvider } from '/imports/ui/components/commons/confirm-box.js'
import { ToastContainer } from 'react-toastify'
import LiveChat from 'react-livechat'

import MainRoute from './routes'
// This is for tabulator's benefit
window.moment = moment

const App = () => {
  const layout = 'default'
  return (
    <Router>
      <ToastContainer></ToastContainer>
      <ErrorBoundary>
        <MyThemeProvider>
          <AccountProvider>
            <LayoutProvider layout={layout}>
              <ErrorBoundary>
                <ConfirmProvider>
                  <MainRoute />
                </ConfirmProvider>
              </ErrorBoundary>
            </LayoutProvider>
          </AccountProvider>
          {Meteor.settings.public.LIVECHAT && (
            <LiveChat license={Meteor.settings.public.LIVECHAT} />
          )}
        </MyThemeProvider>
      </ErrorBoundary>
    </Router>
  )
}

export default App
