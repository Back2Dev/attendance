import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

/**  Generated file DO NOT EDIT !!!
 * Generated by /Users/mikkel/easy/settler/scripts/generate-admin-files.js at 18-07-2021 20:07:10
 */
import Loading from '/imports/ui/components/commons/loading.js'

// Generated lazy imports go here...
const Audits = lazy(() => import('/imports/ui/admin/audits'))
const Cronjobs = lazy(() => import('/imports/ui/admin/cronjobs'))
const Triggers = lazy(() => import('/imports/ui/admin/triggers'))
const MessageTemplates = lazy(() => import('/imports/ui/admin/message-templates'))
const Members = lazy(() => import('/imports/ui/admin/members'))
const Settings = lazy(() => import('/imports/ui/admin/settings'))
const Surveys = lazy(() => import('/imports/ui/admin/surveys'))
const Events = lazy(() => import('/imports/ui/admin/events'))
const Courses = lazy(() => import('/imports/ui/admin/courses'))
const Tools = lazy(() => import('/imports/ui/admin/tools'))
const Sessions = lazy(() => import('/imports/ui/admin/sessions'))
const ServiceItems = lazy(() => import('/imports/ui/admin/service-items'))
const Jobs = lazy(() => import('/imports/ui/admin/jobs'))
const Forms = lazy(() => import('/imports/ui/forms'))
const Registrations = lazy(() => import('/imports/ui/admin/registrations'))
const Collections = lazy(() => import('/imports/ui/admin/collections'))
const Users = lazy(() => import('/imports/ui/admin/users'))
const Calendar = lazy(() => import('/imports/ui/admin/calendar'))
const Register = lazy(() => import('/imports/ui/admin/register'))
const StandupNotes = lazy(() => import('/imports/ui/admin/standup-notes'))
const Standups = lazy(() => import('/imports/ui/admin/standups'))
const Teams = lazy(() => import('/imports/ui/admin/teams'))

//
// This file contains a list of routes for database admin pages
// It is generated from a list of modules
//
export default GeneratedRoutes = () => {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        {/** Generated routes go here */}
        <Route path="/admin/audits" component={Audits} />
        <Route path="/admin/cronjobs" component={Cronjobs} />
        <Route path="/admin/triggers" component={Triggers} />
        <Route path="/admin/message-templates" component={MessageTemplates} />
        <Route path="/admin/members" component={Members} />
        <Route path="/admin/settings" component={Settings} />
        <Route path="/admin/surveys" component={Surveys} />
        <Route path="/admin/events" component={Events} />
        <Route path="/admin/courses" component={Courses} />
        <Route path="/admin/tools" component={Tools} />
        <Route path="/admin/sessions" component={Sessions} />
        <Route path="/admin/service-items" component={ServiceItems} />
        <Route path="/admin/jobs" component={Jobs} />
        <Route path="/admin/forms" component={Forms} />
        <Route path="/admin/registrations" component={Registrations} />
        <Route path="/admin/collections" component={Collections} />
        <Route path="/admin/users" component={Users} />
        <Route path="/admin/calendar" component={Calendar} />
        <Route path="/admin/register" component={Register} />
        <Route path="/admin/standup-notes" component={StandupNotes} />
        <Route path="/admin/standups" component={Standups} />
        <Route path="/admin/teams" component={Teams} />
      </Switch>
    </Suspense>
  )
}
