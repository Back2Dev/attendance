import React, { useEffect, Suspense, lazy } from 'react'
import styled from 'styled-components'
import { Routes, Route } from 'react-router-dom'

import { Grid } from '@mui/material'

import Loading from '/imports/ui/components/commons/loading.js'

const AWS = lazy(() => import('/imports/ui/hacks/aws/aws-box.js'))
const Transporter = lazy(() => import('/imports/ui/hacks/transporter/transporter-box.js'))
const Launch = lazy(() => import('/imports/ui/hacks/launch/launch-box.js'))
const NotesList = lazy(() => import('/imports/ui/hacks/notes/lister.js'))
const NotesEditor = lazy(() => import('/imports/ui/hacks/notes/editor.js'))
const NotesViewer = lazy(() => import('/imports/ui/hacks/notes/viewer.js'))
const Releases = lazy(() => import('/imports/ui/hacks/releases.js'))
const SurveyList = lazy(() => import('/imports/ui/hacks/surveys/lister.js'))
const Timeline = lazy(() => import('/imports/ui/hacks/timeline/timeline.js'))
const VOI = lazy(() => import('/imports/ui/hacks/voi/voi-box.js'))
const NotFoundComponent = lazy(() =>
  import('/imports/ui/components/commons/not-found.js')
)

const StyledHacksPage = styled.div``

function HacksPage() {
  useEffect(() => {
    // scroll to the top
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  return (
    <StyledHacksPage className="hacks-page-container">
      <Grid container>
        <Grid item xs={12}>
          <Suspense fallback={<Loading loading />}>
            <Routes>
              <Route path="aws" element={<AWS />} />
              <Route path="transporter" element={<Transporter />} />
              <Route path="launch" element={<Launch />} />
              <Route path="notes" element={<NotesList />} />
              <Route path="notes/edit/:id" element={<NotesEditor />} />
              <Route path="notes/view/:id" element={<NotesViewer />} />
              <Route path="releases" element={<Releases />} />
              <Route path="surveys" element={<SurveyList />} />
              <Route path="timeline" element={<Timeline />} />
              <Route path="voi" element={<VOI />} />
              <Route path="*" element={<NotFoundComponent />} />
            </Routes>
          </Suspense>
        </Grid>
      </Grid>
    </StyledHacksPage>
  )
}

export default HacksPage
