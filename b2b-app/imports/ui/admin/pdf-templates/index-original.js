import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'
// import Lister from './lister.js'
import Edit from './edit.js'
import View from './view.js'
import Add from './add.js'
import NotFound from '/imports/ui/components/commons/not-found.js'
import { PdfTemplateProvider } from './context-original'
import PdfTemplatesList from './list'

export default function PdfTemplates() {
  return (
    <PdfTemplateProvider>
      <Switch>
        <Route path="/admin/pdf-templates/edit/:id" exact component={Edit} />
        <Route path="/admin/pdf-templates/add/" exact component={Add} />
        <Route path="/admin/pdf-templates/view/:id" exact component={View} />
        <Route path="/admin/pdf-templates" exact component={PdfTemplatesList} />
        <Route component={NotFound} />
      </Switch>
    </PdfTemplateProvider>
  )
}
