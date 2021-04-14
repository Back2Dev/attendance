import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister.js'))
const Editor = lazy(() => import('./editor.js'))
const Viewer = lazy(() => import('./viewer.js'))
const Adder = lazy(() => import('./adder.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function MyCollection() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        <Route path="/admin/my-collection/edit/:id" exact component={Editor} />
        <Route path="/admin/my-collection/add/" exact component={Adder} />
        <Route path="/admin/my-collection/view/:id" exact component={Viewer} />
        <Route path="/admin/my-collection" exact component={Lister} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  )
}
