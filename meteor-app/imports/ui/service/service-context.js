import React, { useState, createContext } from 'react'

export const ServiceContext = createContext()

export const ServiceContextProvider = ({
  serviceOptions,
  tags,
  totalCost,
  name,
  email,
  phone,
  make,
  model,
  color,
  assessor,
  bikeValue,
  pickupDate,
  temporaryBike,
  urgent,
  sentimental,
  isRefurbish,
  paid,
  updateJob,
  calculateTotal,
  children,
}) => {
  const [state, setState] = useState({
    serviceOptions,
    tags,
    totalCost,
    name,
    email,
    phone,
    make,
    model,
    color,
    assessor,
    bikeValue,
    pickupDate,
    temporaryBike,
    urgent,
    sentimental,
    isRefurbish,
    paid,
    updateJob,
    calculateTotal,
  })

  return <ServiceContext.Provider value={[state, setState]}>{children}</ServiceContext.Provider>
}
