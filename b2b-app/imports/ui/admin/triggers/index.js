import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Lister from './lister'
import Editor from './editor'
import Viewer from './viewer'
import NotFound from '/imports/ui/components/commons/not-found'

export default function Triggers() {
  return (
    <Routes>
      <Route path="/admin/triggers/edit/:id" element={<Editor />} />
      <Route path="/admin/triggers/view/:id" element={<Viewer />} />
      <Route path="/admin/triggers" element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
