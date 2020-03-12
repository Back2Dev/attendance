import React, { useState, createContext } from 'react'

export const ServiceContext = createContext()

export const ServiceContextProvider = ({ data, tags, totalServicePrice, children }) => {
  const [state, setState] = useState({ data, tags, totalServicePrice })

  return <ServiceContext.Provider value={[state, setState]}>{children}</ServiceContext.Provider>
}
