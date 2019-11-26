import React from 'react'
import PropTypes from 'prop-types'
import { Segment, Button, Form, Image, Input, TextArea } from 'semantic-ui-react'
import Stackedit from 'stackedit-js'

const debug = require('debug')('manx:edit')

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
      <Button size="mini" onClick={openSE}>
        Edit with Stackedit
      </Button>
    </>
  )
}

const Edit = props => {
  const { item, loading } = props
  const [form, setForm] = React.useState(item)
  if (!loading && !form._id && item._id) {
    debug("Loading item",item)
  // setTimeout(() => {setForm(item)},0)
}
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

  debug(loading,form)
  if (loading) return <div>Loading...</div>
  let src = form
  if (!form._id && item._id) {
    debug("forcing")
    // src = item
    setTimeout(() => {setForm(item)},0)
  }
  return (
    <Segment>
      <Form>
        <span>
          <h4>
            Edit Service Items
            <span style={{ float: 'right', right: '0px' }}>
              <Button size="mini" onClick={cancel} color="red">
                Cancel
              </Button>
              <Button size="mini" onClick={save} color="black">
                Save
              </Button>
            </span>
          </h4>
        </span>
        Name:
        <br />
        <Input type="text" name="name" defaultValue={src.name} onChange={inputChange} fluid />
        <br />
        Markdown: <br />
        <MarkdownEdit defaultValue={src.markdown} name="markdown" onChange={mdChange} />
      </Form>
    </Segment>
  )
}

Edit.propTypes = {
  item: PropTypes.object.isRequired
}

Edit.propTypes = {
  save: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
}
export default Edit
