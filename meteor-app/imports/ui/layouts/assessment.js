import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import AssessmentAddContainer from '/imports/ui/assessment/assessment-add-container'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/ordering/navbar'

const Assessment = () => (
  <div className="assessment-wrapper">
    <title>Back 2 Bikes | Assessment</title>
    <Nav />
        <div style={{ height: '100%' }}>
          <Switch>
            <Route path="/" component={AssessmentAddContainer} />
            <Route component={NotFound} />
          </Switch>
        </div>
  </div>
)

export default Assessment
