import { Meteor } from 'meteor/meteor'
// Import React dependencies.
import React, { useEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormControl, FormLabel } from '@material-ui/core'

// Import the Slate editor factory.
import { createEditor } from 'slate'
// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

const StyledSlateEditor = styled.div`
  margin: 20px 0;
  .field-name {
  }
`

const SlateEditor = ({ className, disabled = false, onChange, value = [], label }) => {
  const editor = useMemo(() => withReact(createEditor()), [])

  // const v = value.map((item) => JSON.parse(item))

  const [eValue, setValue] = useState(() => {
    if (value && value.length) {
      return value.map((item) => JSON.parse(item))
    } else {
      return [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ]
    }
  })

  const changeTimeout = useRef()
  const handleChange = (newValue) => {
    setValue(newValue)

    // prevent overload calculation
    Meteor.clearTimeout(changeTimeout.current)
    changeTimeout.current = Meteor.setTimeout(() => {
      onChange(newValue.map((item) => JSON.stringify(item)))
    }, 500)
  }

  return (
    // Add the editable component inside the context.
    <StyledSlateEditor>
      <FormControl fullWidth>
        <FormLabel className="field-name">{label}</FormLabel>
        <Slate editor={editor} value={eValue} onChange={handleChange}>
          <Editable />
        </Slate>
      </FormControl>
    </StyledSlateEditor>
  )
}

SlateEditor.propTypes = {
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(String),
  disabled: PropTypes.bool,
}

export default SlateEditor
