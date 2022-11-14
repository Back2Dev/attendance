import React, { useEffect, useState } from 'react'
import { Route, Switch, useHistory } from 'react-router-dom'
import Edit from './edit.js'
import View from './view.js'
import Add from './add.js'
import NotFound from '/imports/ui/components/commons/not-found.js'
import Browser from './browser'
import { PdfTemplateProvider } from './context'
import PdfTemplatesList from './list'

import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'

export default function PdfTemplatesApp() {
  const [item, setItem] = useState({
    name: 'New File',
    source: 'dd= {content: ["NO content!"]}',
  })
  // const [code, setCode] = useState('dd= {content: ["NO content!"]}')

  let docId
  if (
    window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1) ==
    'pdf-templates'
  ) {
    docId = ''
  } else {
    docId = window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1)
  }
  const [pdfid, setPdfid] = useState(docId)

  let push = useHistory()?.push
  const remove = (id) => meteorCall('rm.pdfTemplates', 'Deleting', id)

  const save = (form) => {
    meteorCall('insert.pdfTemplates', 'saving', form).then(() =>
      push('/admin/pdf-templates')
    )
  }

  const update = (form) => {
    meteorCall('update.pdfTemplates', 'updating', form)
      .then(() => setItem(form))
      .then(() => push('/admin/pdf-templates'))
  }

  const goBack = useHistory().goBack

  const insert = (form) => meteorCall('insert.pdfTemplates', 'adding', form)

  const add = () => push('/admin/pdf-templates/add')

  const edit = (id) => {
    push(`/admin/pdf-templates/edit/${id}`)
    setPdfid(id)
  }

  const view = (id) => {
    push(`/admin/pdf-templates/view/${id}`)
    setPdfid(id)
  }

  const browse = (id) => {
    push(`/admin/pdf-templates/browse/${id}`)
    setPdfid(id)
  }

  const archive = async (rowids) => {
    const name = prompt('Please enter a name for the archive')
    const text = confirm(
      'Are you sure you want to archive this PdfTemplates and related entities?'
    )

    if (name && text) {
      meteorCall('archive.pdfTemplates', `Archiving PdfTemplates to ${name}`, {
        name,
        ids: rowids,
      })
    }
  }

  const methods = {
    remove,
    save,
    update,
    insert,
    view,
    edit,
    add,
    archive,
    goBack,
    browse,
  }

  const { loadingPdfs, items } = useTracker(() => {
    let pdfs = []
    const sub = Meteor.subscribe('all.names.pdfTemplates')
    if (sub.ready()) {
      pdfs = PdfTemplates.find({}).fetch()
    }
    return {
      loadingPdfs: !sub.ready(),
      items: pdfs,
    }
  })

  useEffect(() => {
    if (pdfid) {
      meteorCall('find.pdfTemplates', 'finding pdf template by id ', pdfid).then(
        (res) => {
          setItem(res.item)
        }
      )
      // .then((resp) => {
      //   setCode(item.source)
      // })
    }
  }, [pdfid])

  const initialState = {
    loadingPdfs: loadingPdfs,
    item: item,
    items: items,
    methods: methods,
    pdfid: pdfid,
    // code: code,
  }
  return (
    <PdfTemplateProvider value={initialState}>
      <Switch>
        <Route path="/admin/pdf-templates/edit/:id" exact component={Edit} />
        <Route path="/admin/pdf-templates/add/" exact component={Add} />
        <Route path="/admin/pdf-templates/view/:id" exact component={View} />
        <Route path="/admin/pdf-templates/browse/:id" exact component={Browser} />
        <Route path="/admin/pdf-templates" exact component={Browser} />
        <Route component={NotFound} />
      </Switch>
    </PdfTemplateProvider>
  )
}
