import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Loading from '/imports/ui/components/commons/loading.js'

import Lister from './lister.js'
import Editor from './editor.js'
import Viewer from './viewer.js'
import Adder from './adder.js'
import NotFound from '/imports/ui/components/commons/not-found.js'
import { Framework } from './framework/framework.js'
// import { EditorPanel } from './framework/editorPanel'

export default function Forms() {
  return (
    // <Switch>
    //   <Route path="/admin/forms/edit/:id" exact component={Editor} />
    //   <Route path="/admin/forms/ide/:id" exact component={Framework} />
    //   <Route path="/admin/forms/add/" exact component={Adder} />
    //   <Route path="/admin/forms/view/:id" exact component={Viewer} />
    //   <Route path="/admin/forms" exact component={Lister} />
    //   <Route component={NotFound} />
    // </Switch>
    <Framework />
  )
}
