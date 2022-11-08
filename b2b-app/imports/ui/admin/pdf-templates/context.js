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
    default:
      return state
  }
}
export const PdfTemplateProvider = (props) => {
  const [state, dispatch] = React.useReducer(pdfTemplateReducer, {
    items: [],
    item: {},
    methods: {},
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
  return (
    <PdfTemplateContext.Provider
      value={{ ...props.value, setItem, setItems, setMethods }}
    >
      {props.children}
    </PdfTemplateContext.Provider>
  )
}
