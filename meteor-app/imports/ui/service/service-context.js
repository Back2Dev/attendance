import React, { useState, createContext } from 'react'

export const ServiceContext = createContext()

export const ServiceContextProvider = ({ serviceItems, tags, totalPrice, formData, children }) => {
  const [state, setState] = useState({ serviceItems, tags, totalPrice, formData })

  return <ServiceContext.Provider value={[state, setState]}>{children}</ServiceContext.Provider>
}
