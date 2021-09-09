import React, { useState, useMemo } from 'react'
import '@react-page/editor/lib/index.css'
import Editor from '@react-page/editor'
import image from '@react-page/plugins-image'
import slate from '@react-page/plugins-slate'
import formPlugin from './plugins/template'
// import { useMemo } from 'react'

const cellPlugins = [slate(), image,formPlugin]

const PageEditor = ({data, save}) => {
  const [page, setPage] = useState(null)

  useMemo(() => {
    if (data) {
      setPage(data)
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
      <Editor cellPlugins={cellPlugins} value={page} onChange={handleOnChange}/>
    </>
  )
}

export default PageEditor
