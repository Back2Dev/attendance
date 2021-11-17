import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading'
import Register from '/imports/ui/admin/register'
import Users from '/imports/ui/admin/users'
import Calendar from '/imports/ui/admin/calendar'

export default ManualRoutes = () => {
  return (
    <>
      <Route path="/admin/register" component={Register} />
      <Route path="/admin/users" component={Users} />
      <Route path="/admin/calendar" component={Calendar} />
    </>
  )
}
