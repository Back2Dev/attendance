import React from 'react'
import { Switch, Route } from 'react-router-dom'
import NotFound from '/imports/ui/not-found'
import Assessment from '/imports/ui/assessment/assessment'
import '/imports/ui/layouts/attendance.css'
import Nav from '/imports/ui/ordering/navbar'

const AssessmentLayout = () => (
  <div className="assessment-wrapper">
    <title>Back 2 Bikes | Assessment</title>
    <Nav />
        <div style={{ height: '100%' }}>
          <Switch>
            <Route path="/" component={Assessment} />
            <Route component={NotFound} />
          </Switch>
        </div>
  </div>
)

export default AssessmentLayout
