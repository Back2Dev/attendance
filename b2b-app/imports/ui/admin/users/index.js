import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Lister from './lister'
import Editor from '/imports/ui/admin/users/editor.js'
import NotFound from '/imports/ui/components/commons/not-found'

export default function Users() {
  return (
    <Routes>
      <Route path="/admin/users/:userId" element={<Editor />} />
      <Route path="/admin/users" element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
