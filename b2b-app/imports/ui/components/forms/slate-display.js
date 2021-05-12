import React, { useState, useMemo } from 'react'
import { createEditor, Descendant, Element } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const SlateDisplay = ({ value }) => {
  const [val, setVal] = useState(value)
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} value={val} onChange={(value) => setVal(value)}>
      <Editable readOnly placeholder="Enter some plain text..." />
    </Slate>
  )
}

export default SlateDisplay
