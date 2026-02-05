import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Lister from './lister'
import NotFound from '/imports/ui/components/commons/not-found'

export default function Triggers() {
  return (
    <Routes>
      <Route path="/admin/triggers" element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
