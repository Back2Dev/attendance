import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading'

import Lister from './lister'
import Editor from './editor'
import Viewer from './viewer'
import Adder from './adder'
import Meeting from './meeting-box'
import AddMember from './add-member'
import NotFound from '/imports/ui/components/commons/not-found'

export default function StandupNotes() {
  return (
    <Routes>
      <Route path="/admin/standup-notes/edit/:id" element={<Editor />} />
      <Route path="/admin/standup-notes/add" element={<Adder />} />
      <Route path="/admin/standup-notes/view/:id" element={<Viewer />} />
      <Route path="/admin/standup-notes/meeting" element={<Meeting />} />
      <Route path="/admin/standup-notes/add-member" element={<AddMember />} />
      <Route path="/admin/standup-notes" element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
