import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister.js'))
const Editor = lazy(() => import('./editor.js'))
const Viewer = lazy(() => import('./viewer.js'))
const Adder = lazy(() => import('./adder.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function Courses() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        <Route path="/admin/courses/edit/:id" exact component={Editor} />
        <Route path="/admin/courses/add/" exact component={Adder} />
        <Route path="/admin/courses/view/:id" exact component={Viewer} />
        <Route path="/admin/courses" exact component={Lister} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  )
}
