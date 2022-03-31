import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

import Lister from './lister.js'
import Editor from './editor.js'
import Viewer from './viewer.js'
import Adder from './adder.js'
import NotFound from '/imports/ui/components/commons/not-found.js'

export default function Standups() {
  return (
    <Switch>
      <Route path="/admin/standups/edit/:id" exact component={Editor} />
      <Route path="/admin/standups/add/" exact component={Adder} />
      <Route path="/admin/standups/view/:id" exact component={Viewer} />
      <Route path="/admin/standups" exact component={Lister} />
      <Route component={NotFound} />
    </Switch>
  )
}
