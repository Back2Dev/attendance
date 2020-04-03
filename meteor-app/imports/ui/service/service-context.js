import React, { useState, createContext } from 'react'

export const ServiceContext = createContext()

export const ServiceContextProvider = ({ serviceItems, tags, totalPrice, formData, setAssessment, children }) => {
  const [state, setState] = useState({ serviceItems, tags, totalPrice, formData, setAssessment })

  return <ServiceContext.Provider value={[state, setState]}>{children}</ServiceContext.Provider>
}
