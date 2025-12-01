import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Lister from './lister'
import NotFound from '/imports/ui/components/commons/not-found'

export default function Triggers() {
  return (
    <Switch>
      <Route path="/admin/triggers" exact component={Lister} />
      <Route component={NotFound} />
    </Switch>
  )
}
