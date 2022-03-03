import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading'

import Lister from './lister'
import Editor from './editor'
import Viewer from './viewer'
import Adder from './adder'
import Meeting from './meeting'
import NotFound from '/imports/ui/components/commons/not-found'

export default function StandupNotes() {
  return (
    <Switch>
      <Route path="/admin/standup-notes/edit/:id" exact component={Editor} />
      <Route path="/admin/standup-notes/add" exact component={Adder} />
      <Route path="/admin/standup-notes/view/:id" exact component={Viewer} />
      <Route path="/admin/standup-notes/meeting" exact component={Meeting} />
      <Route path="/admin/standup-notes" exact component={Lister} />
      <Route component={NotFound} />
    </Switch>
  )
}
