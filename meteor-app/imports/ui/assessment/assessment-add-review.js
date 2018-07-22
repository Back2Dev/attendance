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
      <Segment padded='very' >
        <h2>
          Total Price
        </h2>
        <div>
        <div>{props.formData.serviceCost ? "Total Service Cost: $" + props.formData.serviceCost/100 : ''}</div>
          <div>{props.formData.partsCost ? "Total Parts Cost: $" + props.formData.partsCost/100 : ''}</div>
          <div>{props.formData.additionalFee ? "Additional Fee: $" + props.formData.additionalFee : ''}</div>
          <div style={{borderTop: "1px solid black", margin: "5px 0px", padding: "5px 0px"}}><strong>Total Price = ${(props.formData.serviceCost/100 || 0) + (props.formData.partsCost/100 || 0) + (props.formData.additionalFee || 0)}</strong></div>
        </div>
      </Segment>
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
                    if (props.formData[key] && key !== 'serviceCost' && key !== 'partsCost') {
                      return (
                        <Segment key={key}>
                          <strong>{step.schema.properties[key].title}</strong>
                          <ul style={{ paddingLeft: '1em' }}>
                            {
                              Array.isArray(props.formData[key]) ?
                              props.formData[key].map(item => {
                                return (
                                  <li key={item}>{item}</li>
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