import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'

import Lister from './lister.js'
import Editor from './editor.js'
import Viewer from './viewer.js'
import Adder from './adder.js'
import NotFound from '/imports/ui/components/commons/not-found.js'

export default function Teams() {
  return (
    <Routes>
      <Route path="/admin/teams/edit/:id" element={<Editor />} />
      <Route path="/admin/teams/add/" element={<Adder />} />
      <Route path="/admin/teams/view/:id" element={<Viewer />} />
      <Route path="/admin/teams" element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
