import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'

import Lister from './lister.js'
import Editor from './editor.js'
import Viewer from './viewer.js'
import Adder from './adder.js'
import NotFound from '/imports/ui/components/commons/not-found.js'

export default function Collections() {
  return (
    <Routes>
      <Route path="/admin/collections/edit/:id" element={<Editor />} />
      <Route path="/admin/collections/add/" element={<Adder />} />
      <Route path="/admin/collections/view/:id" element={<Viewer />} />
      <Route path="/admin/collections" element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
