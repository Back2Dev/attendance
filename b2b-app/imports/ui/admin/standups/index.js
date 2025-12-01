import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading'

import Lister from './lister'
import Editor from './editor'
import Viewer from './viewer'
import Adder from './adder'
import NotFound from '/imports/ui/components/commons/not-found'
import Meet from '/imports/ui/admin/standup-notes/meeting-box'
export default function Standups() {
  return (
    <Routes>
      <Route path="/admin/standups/edit/:id" element={<Editor />} />
      <Route path="/admin/standups/add/" element={<Adder />} />
      <Route path="/admin/standups/view/:id" element={<Viewer />} />
      <Route path="/admin/standups/meet/:id" element={<Meet />} />
      <Route path="/admin/standups" element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
