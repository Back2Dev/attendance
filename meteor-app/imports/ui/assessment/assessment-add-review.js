import React from 'react'
import PropTypes from 'prop-types';
import { Button, Icon, Image, Header, Segment } from 'semantic-ui-react'

const AssessmentAddReview = (props) => {
  const stepsToDisplay = props.steps.filter(step => {
    if(step.stepTitle != "Review" && step.stepTitle != "Customer Details") {
      return step
    }    
  })
  return (
    <Segment style={{ textAlign: 'left' }}>
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
                  // TODO: Need to add estimated price quote
                  Object.keys(step.schema.properties).map((key, value, iy) => {
                    if (props.formData[key]) {
                      return (
                        <Segment key={key}>
                          <strong>{step.schema.properties[key].title}</strong>
                          <ul style={{ paddingLeft: '1em' }}>
                            {
                              Array.isArray(props.formData[key]) ?
                              props.formData[key].map(item => {
                                return (
                                  <li>{item}</li>
                                )
                              }) :
                              <li>
                                {
                                  typeof props.formData[key] === 'boolean' ?
                                  (props.formData[key] ? 'Yes' : 'No') :
                                  props.formData[key]
                                }
                              </li>
                            }
                          </ul>
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
    </Segment>
  )
}

AssessmentAddReview.propTypes = {
  formData: PropTypes.object.isRequired,
  goToStep: PropTypes.func.isRequired,
};

export default AssessmentAddReview