import React, { useState, createContext } from 'react'

export const ServiceContext = createContext()

export const ServiceContextProvider = ({ data, tags, children }) => {
  console.log('data and tag =')

  const [state, setState] = useState({ data, tags })

  return <ServiceContext.Provider value={[state, setState]}>{children}</ServiceContext.Provider>
}
