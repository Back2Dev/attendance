import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'

const Lister = lazy(() => import('./lister'))
const Editor = lazy(() => import('./editor'))
const Adder = lazy(() => import('./adder'))
const Viewer = lazy(() => import('./viewer.js'))
const NotFound = lazy(() => import('/imports/ui/components/commons/not-found.js'))

export default function MessageTemplates() {
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
