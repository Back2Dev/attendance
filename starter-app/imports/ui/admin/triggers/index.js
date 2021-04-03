import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister'))
const Editor = lazy(() => import('./editor'))
const Viewer = lazy(() => import('./viewer.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function Triggers() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        <Route path="/admin/triggers/edit/:id" exact component={Editor} />
        <Route path="/admin/triggers/view/:id" exact component={Viewer} />
        <Route path="/admin/triggers" exact component={Lister} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  )
}
