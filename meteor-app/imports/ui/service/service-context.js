import React, { useState, createContext } from 'react'

export const ServiceContext = createContext()


export const ServiceContextProvider = ({
  serviceItems,
  tags,
  totalCost,
  name,
  email,
  phone,
  make,
  model,
  color,
  replacement,
  urgent,
  sentimental,
  isRefurbish,
  updateJob,
  calculateTotal,
  children,
}) => {
  const [state, setState] = useState({
    serviceItems,
    tags,
    totalCost,
    name,
    email,
    phone,
    make,
    model,
    color,
    replacement,
    urgent,
    sentimental,
    isRefurbish,
    updateJob,
    calculateTotal,
  })

  return <ServiceContext.Provider value={[state, setState]}>{children}</ServiceContext.Provider>
}
