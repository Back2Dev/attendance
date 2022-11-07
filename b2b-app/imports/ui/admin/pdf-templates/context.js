import React from 'react'

const PdfTemplateContext = React.createContext({})
export default PdfTemplateContext

export const PdfTemplateProvider = (props) => {
  return (
    <PdfTemplateContext.Provider value={props.value}>
      {props.children}
    </PdfTemplateContext.Provider>
  )
}
