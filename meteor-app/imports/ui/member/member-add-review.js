import React from 'react'
import PropTypes from 'prop-types'
import { Button, Image, Header, Segment } from 'semantic-ui-react'

const MemberAddReview = (props) => {
  if (props.formData.avatar === undefined) {
    props.formData.avatar = 'default.jpg'
  }
  return (
    <Segment style={{ textAlign: 'left' }}>
      <Header as="h1" content="Review your details" textAlign="center" />
      <p><i>Your profile will be created when you click the "Submit" button at the bottom of the page</i></p>
      <Image
        circular
        centered
        size="tiny"
        src={`/images/avatars/${props.formData.avatar}`}
        onClick={() => props.goToStep(3)}
      />
      {props.steps.map((step, ix) => {
        return (
          <Segment padded="very" key={ix}>
            <h2 onClick={() => props.goToStep(ix)}>
              <span>{step.stepTitle}</span>
              <Button basic circular icon="pencil" id={step.stepId} floated="right" />
            </h2>
            <Segment.Group>
              {Object.keys(step.schema.properties).map((key, iy) => {
                if (props.formData[key]) {
                  return (
                    <Segment key={iy}>
                      <strong>{step.schema.properties[key].title}</strong>
                      {step.schema.properties[key].title === 'Password for member portal' ||
                      step.schema.properties[key].title === 'Confirm password' ? (
                        <span style={{ paddingLeft: '1em' }}>Hidden</span>
                      ) : (
                        <span style={{ paddingLeft: '1em' }}>
                          {key === 'avatar' && <Image avatar src={`/images/avatars/${props.formData.avatar}`} />}
                          {key !== 'avatar' && <span>{props.formData[key]}</span>}
                        </span>
                      )}
                    </Segment>
                  )
                }
              })}
            </Segment.Group>
          </Segment>
        )
      })}
    </Segment>
  )
}

MemberAddReview.propTypes = {
  formData: PropTypes.object.isRequired,
  goToStep: PropTypes.func.isRequired,
}

export default MemberAddReview
