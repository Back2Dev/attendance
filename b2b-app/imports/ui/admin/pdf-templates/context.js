import React, { useEffect, useRef, useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { useTracker } from 'meteor/react-meteor-data'
import { useHistory } from 'react-router-dom'
import PdfTemplates from '/imports/api/pdf-templates/schema'
import { meteorCall } from '/imports/ui/utils/meteor'
import Loader from '/imports/ui/components/commons/loading.js'
import config from './config'
import PropTypes from 'prop-types'

const PdfTemplateContext = React.createContext({})

export const PdfTemplateProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])
  const [item, setItem] = useState({})

  const [pdfid, setPdfid] = useState()
  // window.location.pathname.slice(window.location.pathname.lastIndexOf('/') + 1) || ''
  push = useHistory()?.push
  const remove = (id) => meteorCall('rm.pdfTemplates', 'Deleting', id)

  const save = (form) => {
    meteorCall('insert.pdfTemplates', 'saving', form)
    push('/admin/pdf-templates')
  }

  const update = (form) => {
    meteorCall('update.pdfTemplates', 'updating', form).then((res) => setItem(form))
    push('/admin/pdf-templates')
  }

  const goBack = useHistory().goBack

  const insert = (form) => meteorCall('insert.pdfTemplates', 'adding', form)

  const add = () => push(`/admin/pdf-templates/add`)

  const edit = (id) => {
    push(`/admin/pdf-templates/edit/${id}`)
    setPdfid(id)
  }

  const view = (id) => {
    setPdfid(id)
    push(`/admin/pdf-templates/view/${id}`)
  }

  const archive = async (rowids) => {
    const name = prompt('Please enter a name for the archive')
    const text = confirm(
      `Are you sure you want to archive this PdfTemplates and related entities?`
    )

    if (name && text) {
      meteorCall('archive.pdfTemplates', `Archiving PdfTemplates to ${name}`, {
        name,
        ids: rowids,
      })
    }
  }

  methods = { remove, save, update, insert, view, edit, add, archive, goBack }

  const { loadingPdfs, items = [] } = useTracker(() => {
    let pdfs
    const sub = Meteor.subscribe('list.pdfTemplates')
    if (sub.ready()) {
      pdfs = PdfTemplates.find({}).fetch()
    }
    return {
      loadingPdfs: !sub.ready(),
      items: pdfs,
    }
  })
  let history

  useEffect(() => {
    if (pdfid) {
      meteorCall('find.pdfTemplates', 'finding pdf template by id ', pdfid).then(
        (res) => {
          setItem(res.item)
        }
      )
    }
  }, [pdfid])

  return (
    <PdfTemplateContext.Provider
      value={{
        loadingPdfs,
        items,
        item,
        pdfid,
        methods: methods,
        test: 'I am not a robout',
      }}
    >
      {loadingPdfs && <div>loading</div>}
      {children}
    </PdfTemplateContext.Provider>
  )
}

export default PdfTemplateContext
