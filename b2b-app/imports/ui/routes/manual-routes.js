import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from '/imports/ui/admin/register'
import Users from '/imports/ui/admin/users'
import Calendar from '/imports/ui/admin/calendar'

export default ManualRoutes = () => {
  return (
    <Routes>
      <Route path="/admin/register" element={<Register />} />
      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/calendar" element={<Calendar />} />
    </Routes>
  )
}
