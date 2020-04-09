import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon, Image, Header, Segment } from 'semantic-ui-react'

const MemberAddReview = props => {
  if (props.formData.avatar === undefined) {
    props.formData.avatar = 'default.jpg'
  }
  return (
    <Segment style={{ textAlign: 'left' }}>
      <Header as="h1" content="Review your details:" textAlign="center" />
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
                      <span style={{ paddingLeft: '1em' }}>
                        {key === 'avatar' && <Image avatar src={`/images/avatars/${props.formData.avatar}`} />}
                        {key !== 'avatar' && <span>{props.formData[key]}</span>}
                      </span>
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
  goToStep: PropTypes.func.isRequired
}

export default MemberAddReview

// {
//   Object.keys(props.formData).map(key => {
//     if (props.formData[key]) {
//       return <div>{key}: {props.formData[key]}</div>
//     }
//   })
// }
