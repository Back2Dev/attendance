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
      <Route path="edit/:id" element={<Editor />} />
      <Route path="add" element={<Adder />} />
      <Route path="view/:id" element={<Viewer />} />
      <Route path="meeting" element={<Meeting />} />
      <Route path="add-member" element={<AddMember />} />
      <Route index element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
