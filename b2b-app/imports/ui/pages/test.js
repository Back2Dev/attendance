import React, { Suspense, lazy } from 'react'
import { Link as RouterLink, Routes, Route } from 'react-router-dom'
import styled from 'styled-components'

import { Typography, Link } from '@mui/material'

import SecureRoute from '/imports/ui/utils/secure-route.js'

const Test1 = lazy(() => import('/imports/ui/components/test-components/test-1.js'))
const Test2 = lazy(() => import('/imports/ui/components/test-components/test-2.js'))
const TestLayouts = lazy(() =>
  import('/imports/ui/components/test-components/test-layouts.js')
)
const TestThemes = lazy(() =>
  import('/imports/ui/components/test-components/test-themes.js')
)
const TestError = lazy(() => import('/imports/ui/components/test-components/error.js'))
const TestSecureRoute = lazy(() =>
  import('/imports/ui/components/test-components/test-secure-route.js')
)
const TestDataGrid = lazy(() =>
  import('/imports/ui/components/test-components//imports/ui/components/commons/mui-rdg.js')
)
const TestUseTracker = lazy(() =>
  import('/imports/ui/components/test-components/test-usetracker.js')
)

const InlineEditTest = lazy(() =>
  import('/imports/ui/components/test-components/inline-edit.js')
)

const BeautifulDnDTest = lazy(() =>
  import('/imports/ui/components/test-components/beautiful-dnd.js')
)

const StyledTestPage = styled.div`
  padding: 40px 10px;
`

export default function TestPage() {
  return (
    <StyledTestPage>
      <Typography variant="h1">Test page</Typography>
      <div>
        <Link component={RouterLink} to="/">
          Home page
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/1">
          Test 1
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/2">
          Test 2
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/layout">
          Test Layouts
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/theme">
          Test Themes
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/error">
          Test error
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/secure">
          Test secure route: please login
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/alerts">
          Test Alerts
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test//imports/ui/components/commons/mui-rdg">
          Test React Data Grid
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/inline-edit">
          Test Inline edit
        </Link>
      </div>
      <div>
        <Link component={RouterLink} to="/test/beautiful-dnd">
          Drag and Drop (beautiful DnD)
        </Link>
      </div>
      <div style={{ margin: '20px 0' }}>
        <Suspense fallback={<div>loading tests...</div>}>
          <Routes>
            <Route path="/test/1" element={<Test1 />} />
            <Route path="/test/2" element={<Test2 />} />
            <Route path="/test/layout" element={<TestLayouts />} />
            <Route path="/test/theme" element={<TestThemes />} />
            <Route path="/test/error" element={<TestError />} />
            <Route
              path="/test/secure"
              element={
                <SecureRoute>
                  <TestSecureRoute />
                </SecureRoute>
              }
            />
            <Route path="/test//imports/ui/components/commons/mui-rdg" element={<TestDataGrid />} />
            <Route path="/test/usetracker" element={<TestUseTracker />} />
            <Route path="/test/inline-edit" element={<InlineEditTest />} />
            <Route path="/test/beautiful-dnd" element={<BeautifulDnDTest />} />
          </Routes>
        </Suspense>
      </div>
    </StyledTestPage>
  )
}
