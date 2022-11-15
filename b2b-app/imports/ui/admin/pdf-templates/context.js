import React from 'react'

const PdfTemplateContext = React.createContext({})
export default PdfTemplateContext

function pdfTemplateReducer(state, action) {
  const { type, payload } = action
  switch (type) {
    case 'setItems':
      return {
        ...state,
        items: payload,
      }
    case 'setItem':
      return {
        ...state,
        item: payload,
      }
    case 'setMethods':
      return {
        ...state,
        methods: payload,
      }
    case 'setPdfid':
      return {
        ...state,
        pdfid: payload,
      }
    case 'setCode':
      return {
        ...state,
        code: payload,
      }
    default:
      return state
  }
}
export const PdfTemplateProvider = (props) => {
  const [state, dispatch] = React.useReducer(pdfTemplateReducer, {
    items: [],
    item: {},
    methods: {},
    pdfid: '',
    code: 'dd= {content: ["Hello World!"]}',
  })
  const setItems = (data) => {
    dispatch({ type: 'setItems', payload: data })
  }
  const setItem = (data) => {
    dispatch({ type: 'setItem', payload: data })
  }
  const setMethods = (data) => {
    dispatch({ type: 'setMethods', payload: data })
  }
  const setPdfid = (data) => {
    dispatch({ type: 'setPdfid', payload: data })
  }
  const setCode = (data) => {
    dispatch({ type: 'setCode', payload: data })
  }
  return (
    <PdfTemplateContext.Provider
      value={{ ...props.value, setItem, setItems, setMethods, setPdfid, setCode }}
    >
      {props.children}
    </PdfTemplateContext.Provider>
  )
}
