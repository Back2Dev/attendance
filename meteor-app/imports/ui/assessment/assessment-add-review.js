import React from 'react'
import PropTypes from 'prop-types';
import { Button, Icon, Image, Header, Segment } from 'semantic-ui-react'
import PrintJobCard from './assessment-print-job-card'

const AssessmentAddReview = (props) => {
  const stepsToDisplay = props.steps.filter(step => {
       if(step.stepTitle != "Review" && step.stepTitle != "Customer Details") {
         return step
       }    
  })
  return (
    <Segment id="toPrint" style={{ textAlign: 'left'}}>
      <Header as='h1' content='Review your details:' textAlign='center' />
      {
        stepsToDisplay.map((step, ix) => {
          return (
            <Segment padded='very' key={ix}>
              <h2>
                {step.stepTitle}
                <Button basic circular icon='pencil' floated='right' onClick={() => props.goToStep(ix)} />
              </h2>
              <Segment.Group>
                {
                  Object.keys(step.schema.properties).map((key, value, iy) => {
                    if (props.formData[key]) {
                      return (
                        <Segment key={iy}>
                          <strong>{step.schema.properties[key].title}</strong>
                          <span style={{ paddingLeft: '1em' }}>
                    
                            {
                              <span>
                                {props.formData[key]}
                              </span>
                            }
                          </span>
                        </Segment>
                      )
                    }
                  })
                }
              </Segment.Group>
            </Segment>
          )
        })
      }
      <PrintJobCard /> 
    </Segment>
  )
}

AssessmentAddReview.propTypes = {
  formData: PropTypes.object.isRequired,
  goToStep: PropTypes.func.isRequired,
};

export default AssessmentAddReview