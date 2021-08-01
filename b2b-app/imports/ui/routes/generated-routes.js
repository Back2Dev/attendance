import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'

// Generated lazy imports go here...
const SettingsList = lazy(() => import('/imports/ui/admin/settings/lister.js'))
const UserList = lazy(() => import('/imports/ui/admin/users/lister.js'))
const Cronjobs = lazy(() => import('/imports/ui/admin/cronjobs'))
const MessageTemplates = lazy(() => import('/imports/ui/admin/message-templates'))
const Triggers = lazy(() => import('/imports/ui/admin/triggers'))
const Surveys = lazy(() => import('/imports/ui/admin/surveys'))
const Events = lazy(() => import('/imports/ui/admin/events'))
const EventCalendar = lazy(() => import('/imports/ui/admin/calendar'))
const Courses = lazy(() => import('/imports/ui/admin/courses'))
const Tools = lazy(() => import('/imports/ui/admin/tools'))
const Sessions = lazy(() => import('/imports/ui/admin/sessions'))

export default function GeneratedRoutes() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        {/** Generated routes go here */}
        <Route path="/admin/message-templates" component={MessageTemplates} />
        <Route path="/admin/settings" exact component={SettingsList} />
        <Route path="/admin/users" exact component={UserList} />
        <Route path="/admin/cronjobs" component={Cronjobs} />
        <Route path="/admin/triggers" component={Triggers} />
        <Route path="/admin/surveys" component={Surveys} />
        <Route path="/admin/events" component={Events} />
        <Route path="/admin/calendar" component={EventCalendar} />
        <Route path="/admin/courses" component={Courses} />
        <Route path="/admin/tools" component={Tools} />
        <Route path="/admin/sessions" component={Sessions} />
      </Switch>
    </Suspense>
  )
}
