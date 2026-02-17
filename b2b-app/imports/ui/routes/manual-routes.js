import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '/imports/ui/admin/register'
import Users from '/imports/ui/admin/users'
import Calendar from '/imports/ui/admin/calendar'
import Shop from '/imports/ui/shop'

const ManualRoutes = () => {
  return (
    <Routes>
      {/* <Route path="register/*" element={<Register />} />
      <Route path="users/*" element={<Users />} />
      <Route path="calendar/*" element={<Calendar />} /> */}
      <Route path="/shop/*" element={<Shop />} />
    </Routes>
  )
}

export default ManualRoutes
