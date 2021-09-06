import React from 'react'
import { HotKeys } from 'react-hotkeys'
import { useHistory } from 'react-router-dom'
import SplitPane from 'react-split-pane'
import { DoubleLayout } from './double-layout'
import { EditorPanel } from './editor-panel'
import { EditorToolbar } from './editor-toolbar'
import { PreviewPanel } from './preview-panel'
import { SingleLayout } from './single-layout'
import { parse } from '/imports/api/forms/engine.js'
import map2Uniforms from '/imports/api/surveys/uniforms'

const debug = require('debug')('app:forms:framework')

export const EditorContext = React.createContext()

const Framework = ({ id, item, methods }) => {
  const keyMap = {
    save: ['command+s', 'Control+s'],
  }

  const handlers = {
    save: (event) => {
      event.preventDefault()
      save(false)
    },
  }

  const save = (quit, autosave = false) => {
    try {
      methods.update(
        id,
        {
          _id: id,
          source: formEditorInput,
          json: JSON.parse(jsonEditorInput),
          survey: raw,
          autosave,
        },
        quit
      )
    } catch (e) {
      debug(`Update error ${e.message}`)
    }
  }

  const { goBack } = useHistory()
  const back = () => {
    goBack()
  }
  // State of the form editor, exposed in the EditorContext
  const [formEditorInput, setFormEditorInput] = React.useState(item.source)

  const [jsonEditorInput, setJsonEditorInput] = React.useState(
    JSON.stringify(item.json, null, 2),
    null,
    2
  )

  const [raw, setRaw] = React.useState({})

  const [errors, setErrors] = React.useState(parse(formEditorInput).errs)
  const [autoRun, setAutoRun] = React.useState(false)
  const [autoSave, setAutoSave] = React.useState(true)
  //codemirror references
  const [editor, setEditor] = React.useState()
  const [doc, setDoc] = React.useState()
  //error widgets
  const [widgets, setWidgets] = React.useState([])
  const [tab, setTab] = React.useState(0)

  const [layout, setLayout] = React.useState('single')

  const changeLayout = (newLayout) => {
    const layouts = ['single', 'double', 'dnd']

    if (layouts.includes(newLayout)) {
      setLayout(newLayout)
    }
  }

  // Function to update state of editor input, i.e. stores input form syntax
  const updateFormInput = (input) => {
    setFormEditorInput(input)
  }

  const compileForm = () => {
    const result = parse(formEditorInput)
    const specific = map2Uniforms(result.survey)
    debug({ specific })
    setRaw(specific)

    if (result.status === 'success') {
      setJsonEditorInput(JSON.stringify(result.survey, null, 2))
      setErrors(result.errs)
      showErrors(result.errs)
    } else {
      setJsonEditorInput(JSON.stringify(result.survey, null, 2))
      setErrors(result.errs)
      showErrors(result.errs)
    }
  }

  // Function to update state of editor input, i.e. stores input form syntax
  const updateJsonInput = (input) => {
    setJsonEditorInput(input)

    // parse input here?
  }

  const toggleAutoRun = () => {
    setAutoRun(autoRun ? false : true)
  }

  const toggleAutoSave = () => {
    setAutoSave(autoSave ? false : true)
  }

  const showErrors = (errors) => {
    hideErrors()
    setWidgets([])

    if (errors === 'No Errors' || !errors) return

    const newWidgets = []

    for (let i = 0; i < errors.length; i++) {
      const error = errors[i]
      const msg = document.createElement('div')
      const icon = msg.appendChild(document.createElement('span'))
      icon.innerHTML = '!!'
      icon.className = 'lint-error-icon'
      msg.appendChild(document.createTextNode(error.error))
      msg.className = 'lint-error'
      newWidgets.push(doc.addLineWidget(error.lineno - 1, msg))
    }
    setWidgets(newWidgets)
  }

  const hideErrors = () => {
    for (var i = 0; i < widgets.length; ++i) editor.removeLineWidget(widgets[i])
  }

  // display errors on load
  React.useEffect(() => {
    if (editor) {
      showErrors(errors)
    }
  }, [editor])

  let layoutComponent = <SingleLayout />

  switch (layout) {
    case 'single':
      layoutComponent = <SingleLayout />
      break
    case 'double':
      layoutComponent = <DoubleLayout />
      break
    default:
      layoutComponent = <SingleLayout />
      break
  }

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <EditorContext.Provider
        value={{
          editors: [
            {
              name: 'details.form',
              editorValue: formEditorInput,
              updateEditor: updateFormInput,
              editorType: 'null',
            },
            {
              name: 'detailsForm.json',
              editorValue: jsonEditorInput,
              updateEditor: updateJsonInput,
              editorType: { name: 'javascript', json: true },
            },
          ],
          errors: errors ? errors : 'No Errors',
          save,
          autoRun,
          toggleAutoRun,
          autoSave,
          toggleAutoSave,
          compileForm,
          editor,
          doc,
          setEditorDoc: (editor) => {
            setEditor(editor)
            setDoc(editor.getDoc())
          },
          hideErrors,
          showErrors,
          tab,
          changeTab: (i) => setTab(i),
          layout,
          changeLayout,
          name: item.name,
          slug: item.slug,
        }}
      >
        <EditorToolbar />
        {layoutComponent}
      </EditorContext.Provider>
    </HotKeys>
  )
}

export default Framework
