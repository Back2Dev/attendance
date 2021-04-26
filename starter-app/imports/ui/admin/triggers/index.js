import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Lister from './lister'
import Editor from './editor'
import Viewer from './viewer'
import NotFound from '/imports/ui/components/commons/not-found'

export default function Triggers() {
  return (
    <Switch>
      <Route path="/admin/triggers/edit/:id" exact component={Editor} />
      <Route path="/admin/triggers/view/:id" exact component={Viewer} />
      <Route path="/admin/triggers" exact component={Lister} />
      <Route component={NotFound} />
    </Switch>
  )
}
