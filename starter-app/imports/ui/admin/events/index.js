import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister'))
const Editor = lazy(() => import('./editor'))
const Viewer = lazy(() => import('./viewer.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function Events() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        <Route path="/admin/events/edit/:id" exact component={Editor} />
        <Route path="/admin/events/view/:id" exact component={Viewer} />
        <Route path="/admin/events" exact component={Lister} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  )
}
