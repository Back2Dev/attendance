import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Lister from './lister.js'
import Editor from './editor.js'
import Viewer from './viewer.js'
import Adder from './adder.js'
import NotFound from '/imports/ui/components/commons/not-found.js'

export default function Collections() {
  return (
    <Routes>
      <Route path="edit/:id" element={<Editor />} />
      <Route path="add/" element={<Adder />} />
      <Route path="view/:id" element={<Viewer />} />
      <Route index element={<Lister />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
