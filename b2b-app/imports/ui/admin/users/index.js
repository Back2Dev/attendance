import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Lister from './lister'
import Editor from '/imports/ui/admin/users/editor.js'
import NotFound from '/imports/ui/components/commons/not-found'

export default function Users() {
  return (
    <Switch>
      <Route path="/admin/users/:userId" exact component={Editor} />
      <Route path="/admin/users" exact component={Lister} />
      <Route component={NotFound} />
    </Switch>
  )
}
