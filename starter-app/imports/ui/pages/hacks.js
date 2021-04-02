import React, { useEffect, Suspense, lazy } from 'react'
import styled from 'styled-components'
import { Route, Switch } from 'react-router-dom'

import { Grid } from '@material-ui/core'

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
            <Switch>
              <Route path="/hacks/aws" exact component={AWS} />
              <Route path="/hacks/transporter" exact component={Transporter} />
              <Route path="/hacks/launch" exact component={Launch} />
              <Route path="/hacks/notes" exact component={NotesList} />
              <Route path="/hacks/notes/edit/:id" exact component={NotesEditor} />
              <Route path="/hacks/notes/view/:id" exact component={NotesViewer} />
              <Route path="/hacks/releases" exact component={Releases} />
              <Route path="/hacks/surveys" exact component={SurveyList} />
              <Route path="/hacks/timeline" exact component={Timeline} />
              <Route path="/hacks/voi" exact component={VOI} />
              <Route component={NotFoundComponent} />
            </Switch>
          </Suspense>
        </Grid>
      </Grid>
    </StyledHacksPage>
  )
}

export default HacksPage
