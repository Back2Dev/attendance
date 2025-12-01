import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Lister from './lister'
import Editor from './editor'
import Viewer from './viewer'
import NotFound from '/imports/ui/components/commons/not-found'

export default function Triggers() {
  return (
    <Routes>
      <Route path="edit/:id" element={<Editor />} />
      <Route path="view/:id" element={<Viewer />} />
      <Route index element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
