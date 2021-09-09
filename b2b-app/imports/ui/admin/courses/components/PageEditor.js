import React, { useState } from 'react'
import '@react-page/editor/lib/index.css'
import Editor from '@react-page/editor'
import image from '@react-page/plugins-image'
import slate from '@react-page/plugins-slate'

const cellPlugins = [slate(), image]

const PageEditor = () => {
  const [value, setValue] = useState(null)

  return (
    <>
      <Editor cellPlugins={cellPlugins} value={value} onChange={setValue} />
    </>
  )
}

export default PageEditor
