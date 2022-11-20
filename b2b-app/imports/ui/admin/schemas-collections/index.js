import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

import Lister from './lister.js'
import Editor from './editor.js'
import Adder from './adder.js'
import NotFound from '/imports/ui/components/commons/not-found.js'
import { SchemasCollectionsContextProvider } from './context'

export default function Schemas() {
  return (
    <SchemasCollectionsContextProvider>
      <Switch>
        <Route
          path="/admin/schemas/collections/:slug/edit/:id"
          exact
          component={Editor}
        />
        <Route path="/admin/schemas/collections/:slug/add/" exact component={Adder} />
        <Route path="/admin/schemas/collections/:slug/list/" exact component={Lister} />
        <Route component={NotFound} />
      </Switch>
    </SchemasCollectionsContextProvider>
  )
}
