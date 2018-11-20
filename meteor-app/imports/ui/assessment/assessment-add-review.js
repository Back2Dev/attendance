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
    <Segment id="toPrint" style={{ textAlign: 'left'}}>
      <Header as='h1' content='Review your details:' textAlign='center' />
      <Segment padded='very' >
        <h2>
          Total Price
        </h2>
        <div>
          <div>Total Service Cost: ${props.formData.serviceCost/100}</div>
          <div>Total Parts Cost: ${props.formData.partsCost/100}</div>
          <div>Additional Fee: ${props.formData.additionalFee}</div>
          <div style={{borderTop: "1px solid black", margin: "5px 0px", padding: "5px 0px"}}><strong>Total Price = ${(props.formData.serviceCost/100) + (props.formData.partsCost/100) + (props.formData.additionalFee)}</strong></div>
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
                    const field = props.formData[key]
                    if (field && !['serviceCost','partsCost'].includes(key)) {
                      const listToRender = []

                      if(Array.isArray(field)) {
                        const arrayOfItems = field.map(item => (<li key={item}>{item}</li>))
                        listToRender.push(arrayOfItems)
                      } else if(typeof field === 'boolean') {
                        listToRender.push(field ? <li key={Math.random()}>Yes</li> : <li key={Math.random()}>No</li>)
                      } else {
                        listToRender.push(<li key={Math.random()}>{field}</li>)
                      }

                      return (
                        <Segment key={key}>
                          <strong>{step.schema.properties[key].title}</strong>
                          <ul style={{ paddingLeft: '1em' }}>
                            {listToRender}
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