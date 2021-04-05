import React, { Suspense, lazy } from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister'))
const Editor = lazy(() => import('./editor'))
const Adder = lazy(() => import('./adder'))
const Viewer = lazy(() => import('./viewer.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function MessageTemplates() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Switch>
        <Route path="/admin/message-templates/edit/:id" exact component={Editor} />
        <Route path="/admin/message-templates/add/" exact component={Adder} />
        <Route path="/admin/message-templates/view/:id" exact component={Viewer} />
        <Route path="/admin/message-templates" exact component={Lister} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  )
}
