import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister.js'))
const Editor = lazy(() => import('./editor.js'))
const Viewer = lazy(() => import('./viewer.js'))
const Adder = lazy(() => import('./adder.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function Courses() {
  return (
    <Suspense fallback={<Loading loading />}>
      <Routes>
        <Route path="edit/:id" element={<Editor />} />
        <Route path="add/" element={<Adder />} />
        <Route path="view/:id" element={<Viewer />} />
        <Route index element={<Lister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
