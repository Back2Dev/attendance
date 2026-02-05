import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Routes, Route } from 'react-router-dom'
import DBA from '/imports/ui/dba'
import ViewForm from '/imports/ui/dba/view-form'
import DBAArchives from '/imports/ui/dba/archives'

const StyledAdminPage = styled.div``

const AdminPage = () => {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledAdminPage className="admin-page-container">
      <Routes>
        <Route path="archives/:collection" element={<DBAArchives />} />
        <Route path="archives" element={<DBAArchives />} />
        <Route path=":collection/add-view" element={<ViewForm />} />
        <Route path=":collection/edit-view/:view" element={<ViewForm />} />
        <Route path=":collection/:view?" element={<DBA />} />
      </Routes>
    </StyledAdminPage>
  )
}

// export default AdminPage
export default React.memo(AdminPage)
