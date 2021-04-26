import React, { useEffect, Suspense, lazy } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Grid } from '@material-ui/core'

import Loading from '/imports/ui/components/commons/loading.js'

const SettingsList = lazy(() => import('/imports/ui/admin/settings/lister.js'))
const UserList = lazy(() => import('/imports/ui/admin/users/lister.js'))
const Cronjobs = lazy(() => import('/imports/ui/admin/cronjobs'))
const MessageTemplates = lazy(() => import('/imports/ui/admin/message-templates'))
const Triggers = lazy(() => import('/imports/ui/admin/triggers'))
const Surveys = lazy(() => import('/imports/ui/admin/surveys'))
const NotFoundComponent = lazy(() =>
  import('/imports/ui/components/commons/not-found.js')
)

const StyledAdminPage = styled.div``

function AdminPage() {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledAdminPage className="admin-page-container">
      <Grid container>
        <Grid item xs={12}>
          <Suspense fallback={<Loading loading />}>
            <Switch>
              <Route path="/admin/message-templates" component={MessageTemplates} />
              <Route path="/admin/settings" exact component={SettingsList} />
              <Route path="/admin/users" exact component={UserList} />
              <Route path="/admin/cronjobs" component={Cronjobs} />
              <Route path="/admin/triggers" component={Triggers} />
              <Route path="/admin/surveys" component={Surveys} />
              <Route component={NotFoundComponent} />
            </Switch>
          </Suspense>
        </Grid>
      </Grid>
    </StyledAdminPage>
  )
}

export default AdminPage
