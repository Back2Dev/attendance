import React, { useState } from 'react'
import '@react-page/editor/lib/index.css'
import Editor from '@react-page/editor'
import image from '@react-page/plugins-image'
import slate from '@react-page/plugins-slate'
import formPlugin from './plugins/template'
import { useMemo } from 'react'

const cellPlugins = [slate(), image,formPlugin]

const PageDisplay = ({data}) => {
  const [page, setPage] = useState(null)

  useMemo(() => {
    if (data) {
      setPage(data)
    }
  },[data])



  return (
    <>
      <Editor cellPlugins={cellPlugins} value={page} readOnly/>
    </>
  )
}

export default PageDisplay
