import React, { useState, createContext } from 'react'

export const ServiceContext = createContext()

export const ServiceContextProvider = ({
  serviceItems,
  tags,
  totalPrice,
  name,
  email,
  phone,
  make,
  model,
  color,
  replacement,
  urgent,
  sentimental,
  updateJob,
  children,
}) => {
  const [state, setState] = useState({
    serviceItems,
    tags,
    totalPrice,
    name,
    email,
    phone,
    make,
    model,
    color,
    replacement,
    urgent,
    sentimental,
    updateJob,
  })

  return <ServiceContext.Provider value={[state, setState]}>{children}</ServiceContext.Provider>
}
