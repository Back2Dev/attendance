import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { Transforms, createEditor, Descendant } from 'slate'
import {
  Slate,
  Editable,
  useSlateStatic,
  useSelected,
  useFocused,
  withReact,
} from 'slate-react'
import { withHistory } from 'slate-history'
import imageExtensions from 'image-extensions'
import isUrl from 'is-url'
import { css } from '@emotion/css'

const debug = require('debug')('app:slate-edit')

const insertImage = (editor, url) => {
  const text = { text: '' }
  const image = { type: 'image', url, children: [text] }
  Transforms.insertNodes(editor, image)
}

const withImages = (editor) => {
  const { insertData, isVoid } = editor

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = (data) => {
    const text = data.getData('text/plain')
    const { files } = data

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader()
        const [mime] = file.type.split('/')

        if (mime === 'image') {
          reader.addEventListener('load', () => {
            const url = reader.result
            insertImage(editor, url)
          })

          reader.readAsDataURL(file)
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const Element = (props) => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'image':
      return <Image {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Image = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
      </div>
      {children}
    </div>
  )
}

const isImageUrl = (url) => {
  if (!url) return false
  if (!isUrl(url)) return false
  const ext = new URL(url).pathname.split('.').pop()
  return imageExtensions.includes(ext)
}

const Edit = ({ value, label, onChange, readOnly }) => {
  const editor = React.useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  )
  // Add the initial value when setting up our state.
  const [val, setVal] = React.useState(
    typeof value === 'string'
      ? [
          {
            type: 'paragraph',
            children: [
              {
                text: value,
              },
            ],
          },
        ]
      : value
  )

  const changed = (newVal) => {
    debug({ newVal })
    setVal(newVal)
    onChange(newVal)
  }
  return (
    <Slate editor={editor} value={val} onChange={changed}>
      <Editable
        renderElement={(props) => <Element {...props} />}
        placeholder="Enter some text..."
        readOnly={readOnly}
      />
    </Slate>
  )
  // return (
  //   <TextField
  //     style={{ width: '100%' }}
  //     multiline
  //     label={label}
  //     value={value}
  //     onChange={onChange}
  //     InputLabelProps={{ shrink: true }}
  //     InputProps={{
  //       inputComponent: SlateEdit,
  //       inputProps: {
  //         onUpdate: setCode,
  //         style: { width: '100%' },
  //         code: JSON.stringify(value, null, 2),
  //       },
  //     }}
  //   />
  // )
}

Edit.propTypes = {
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}
export default Edit
