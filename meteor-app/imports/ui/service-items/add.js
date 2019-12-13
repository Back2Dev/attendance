import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Button, Form, Image, Input, TextArea } from 'semantic-ui-react'
import Stackedit from 'stackedit-js'

const debug = require('debug')('manx:add')

const defaultMarkdown = `# New document

Please replace this text with a detailed description.

`

const MarkdownEdit = props => {
  const [md, setMD] = React.useState(props.defaultValue)
  const mdChange = (e, data) => {
    console.log(data)
    setMD(data.value)
    props.onChange({ target: { name: props.name, value: data.value } })
  }
  const openSE = () => {
    const el = document.querySelector('textarea')
    const se = new Stackedit()

    // Open the iframe
    se.openFile({
      name: props.name, // with an optional filename
      content: {
        text: md // and the Markdown content.
      }
    })

    // Listen to StackEdit events and apply the changes to the textarea.
    se.on('fileChange', file => {
      el.value = file.content.text
      setMD(file.content.text)
    })
  }

  return (
    <>
      <TextArea rows={10} defaultValue={md} onChange={mdChange} />
      <Button size="mini" onClick={openSE} type="button">
        Edit with Stackedit
      </Button>
    </>
  )
}

const Add = props => {
  const { item = { name: 'Untitled', markdown: defaultMarkdown }, loading } = props
  const [form, setForm] = React.useState(item)
  const inputChange = e => {
    form[e.target.name] = e.target.value
    setForm(form)
  }

  const mdChange = e => {
    form.markdown = e.target.value
    setForm(form)
  }

  const cancel = () => {
    props.cancel()
  }
  const save = () => {
    props.save(form)
  }

  debug(loading, form)
  if (loading) return <div>Loading...</div>
  let src = form
  return (
    <Segment>
      <Form>
        <span>
          <h4>
            Add to Service Items
            <span style={{ float: 'right', right: '0px' }}>
              <Button size="mini" onClick={cancel} color="red" type="button">
                Cancel
              </Button>
              <Button size="mini" onClick={save} color="black" type="button">
                Save
              </Button>
            </span>
          </h4>
        </span>
        Name:
        <br />
        <Input type="text" name="name" onChange={inputChange} defaultValue={form.name} fluid />
        <br />
        Markdown: <br />
        <MarkdownEdit defaultValue={form.markdown} name="markdown" onChange={mdChange} />
      </Form>
    </Segment>
  )
}

Add.propTypes = {}

Add.propTypes = {
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}
export default Add
