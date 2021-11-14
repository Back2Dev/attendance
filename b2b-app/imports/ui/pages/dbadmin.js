import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
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
      <Switch>
        <Route path="/dba/archives/:collection" component={DBAArchives} />
        <Route path="/dba/archives" component={DBAArchives} />
        <Route exact path="/dba/:collection/add-view" component={ViewForm} />
        <Route exact path="/dba/:collection/edit-view/:view" component={ViewForm} />
        <Route path="/dba/:collection/:view?" component={DBA} />
      </Switch>
    </StyledAdminPage>
  )
}

// export default AdminPage
export default React.memo(AdminPage)
