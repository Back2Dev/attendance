import React, { useState, createContext } from 'react'
import { serviceState } from './service-context-data'

export const ServiceContext = createContext()

export const ServiceContextProvider = props => {
  const [state, setState] = useState(serviceState)

  return <ServiceContext.Provider value={[state, setState]}>{props.children}</ServiceContext.Provider>
}
