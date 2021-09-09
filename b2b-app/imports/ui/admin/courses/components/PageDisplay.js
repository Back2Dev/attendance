import React, { useState } from 'react'
import '@react-page/editor/lib/index.css'
import Editor from '@react-page/editor'
import image from '@react-page/plugins-image'
import slate from '@react-page/plugins-slate'
import formPlugin from './plugins/template'
import { useMemo } from 'react'

const cellPlugins = [slate(), image,formPlugin]

const PageDisplay = ({data, save}) => {
  const [page, setPage] = useState(null)

  useMemo(() => {
    if (data.pageContent) {
      setPage(data.pageContent)
    }
  },[data])

  const handleOnChange = (fields) => {
    setPage(fields)
  }
  const handleSave = () => {
    save(page)
  }
  

  return (
    <>
    <button onClick={handleSave}>Save</button>
      <Editor cellPlugins={cellPlugins} value={page} readOnly/>
    </>
  )
}

export default PageDisplay
