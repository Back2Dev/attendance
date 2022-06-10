import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading'

import Lister from './lister'
import Editor from './editor'
import Viewer from './viewer'
import Adder from './adder'
import NotFound from '/imports/ui/components/commons/not-found'
import Meet from '/imports/ui/admin/standup-notes/meeting-box'
export default function Standups() {
  return (
    <Switch>
      <Route path="/admin/standups/edit/:id" exact component={Editor} />
      <Route path="/admin/standups/add/" exact component={Adder} />
      <Route path="/admin/standups/view/:id" exact component={Viewer} />
      <Route path="/admin/standups/meet/:id" exact component={Meet} />
      <Route path="/admin/standups" exact component={Lister} />
      <Route component={NotFound} />
    </Switch>
  )
}
