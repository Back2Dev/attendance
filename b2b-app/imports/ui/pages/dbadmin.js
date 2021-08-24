import React, { useEffect, Suspense, lazy } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'
import Loading from '/imports/ui/components/commons/loading.js'
import DBA from '/imports/ui/dba'

const StyledAdminPage = styled.div``

function AdminPage(props) {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledAdminPage className="admin-page-container">
      <Suspense fallback={<Loading loading />}>
        <Switch>
          <Route path="/dba/:collection/:view?/:id?" component={DBA} />
        </Switch>
      </Suspense>
    </StyledAdminPage>
  )
}

export default AdminPage
