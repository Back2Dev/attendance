import React, { useState } from 'react'
import '@react-page/editor/lib/index.css'
import Editor from '@react-page/editor'
import { useMemo } from 'react'
import cellPlugins from './cell-plugins.js'

const PageDisplay = ({ data, course }) => {
  const [page, setPage] = useState(null)

  useMemo(() => {
    if (data) {
      setPage(data)
    }
  }, [data])

  return (
    <>
      <Editor cellPlugins={cellPlugins(course)} value={page} readOnly />
    </>
  )
}

export default PageDisplay
