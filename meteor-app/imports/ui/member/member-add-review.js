import React from 'react'
import PropTypes from 'prop-types';
import { Header, Segment } from 'semantic-ui-react'

const MemberAddReview = (props) => {
  return (
    <Segment style={{ textAlign: 'left' }}>
      <Header as='h1' content='Review your details:' textAlign='center'/>
      {
        props.steps.map((step, ix) => {
          return (
            <Segment padded='very' key={ix}>
              <Header as='h2' attached='top'>
                {step.stepTitle}
              </Header>
              <Segment.Group>
                {
                  Object.keys(step.schema.properties).map((key, iy) => {
                    if (props.formData[key]) {
                      return (
                        <Segment key={iy}>
                          <strong>{step.schema.properties[key].title}</strong>
                          <span style={{ paddingLeft: '1em' }}>
                            {props.formData[key]}
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
    </Segment>
  )
}

MemberAddReview.propTypes = {
  formData: PropTypes.object.isRequired,
};

export default MemberAddReview

// {
//   Object.keys(props.formData).map(key => {
//     if (props.formData[key]) {
//       return <div>{key}: {props.formData[key]}</div>
//     }
//   })
// }

