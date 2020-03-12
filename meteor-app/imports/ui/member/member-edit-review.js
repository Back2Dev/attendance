import React from 'react'
import PropTypes from 'prop-types'
import { Button, Image, Header, Segment, Form } from 'semantic-ui-react'
import UserDetailForm from './member-edit-user-details'

const MemberEditReview = props => {
  const [disabled, setDisabled] = React.useState(true)

  if (props.formData.avatar === undefined) {
    props.formData.avatar = 'default.jpg'
  }
  return (
    <Segment style={{ textAlign: 'left' }}>
      <Header as="h1" content="Edit your details:" textAlign="center" />
      <Image
        circular
        centered
        size="tiny"
        src={`/images/avatars/${props.formData.avatar}`}
        onClick={() => props.goToStep(3)}
      />
      <Segment padded="very">
        <h3 onClick={() => setDisabled(!disabled)}>
          <span>Change Email/Password</span>
          <Button basic circular icon="pencil" floated="right" />
        </h3>
        {!disabled ? <UserDetailForm formData={props.formData} setUser={props.setUser} /> : null}
      </Segment>
      {props.steps.map((step, ix) => {
        return (
          <Segment padded="very" key={ix}>
            <h2 onClick={() => props.goToStep(ix)}>
              <span>{step.stepTitle}</span>
              <Button basic circular icon="pencil" floated="right" />
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

MemberEditReview.propTypes = {
  formData: PropTypes.object.isRequired,
  goToStep: PropTypes.func.isRequired
}

export default MemberEditReview

// {
//   Object.keys(props.formData).map(key => {
//     if (props.formData[key]) {
//       return <div>{key}: {props.formData[key]}</div>
//     }
//   })
// }
