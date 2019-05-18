import React from 'react'
import PropTypes from 'prop-types'
import { Card, Icon, Image, Label, Button } from 'semantic-ui-react'
import { humaniseDate } from '/imports/helpers/dates'
import '/imports/ui/member/member-card.css'

const MyBadge = props => {
  if (!props.content) return <Button type="button" size="mini" icon={props.icon} color={props.color || 'orange'} />
  return <Label size="mini" icon={props.icon} content={props.content} color={props.color || 'orange'} />
}
const MemberCard = props => {
  const {
    _id,
    name,
    avatar,
    isSuper,
    list,
    isHere,
    sessionCount,
    subsType,
    remaining,
    sessions = [],
    lastIn = null
  } = props
  const rookie = sessionCount <= 5
  const isExpired = props.status === 'expired'
  const isSlsa = false

  const ribbon = isSuper
    ? {
        color: 'orange',
        icon: 'student',
        ribbon: true
      }
    : null
  const subsColor = isExpired ? 'red' : 'orange'
  const togo = subsType === 'pass' ? `(${remaining})` : ''
  return (
    <Card style={{ textAlign: 'center' }} className={props.className} key={_id}>
      <Image src={'/images/avatars/' + avatar} style={{ opacity: isExpired ? '0.25' : '1' }} />
      <Card.Content>
        <Card.Header list={list}>
          {isSlsa && <Image src="/images/slsa.png" width="25px" alt="Surf Life Saving" />}
          &nbsp;
          {name} {isExpired ? '(expired)' : ''}
        </Card.Header>
        <Card.Content>
          {isSuper && <Label corner="left" icon="student" color="orange" />}
          <div
            style={{
              padding: '10px 0'
            }}
          >
            <Label size="mini" color={rookie ? 'green' : isSuper ? 'orange' : 'blue'} about={name}>
              <Icon name={rookie ? 'star half full' : 'trophy'} />
              {sessionCount}
            </Label>
            {rookie && (
              <Label size="mini" color="green">
                rookie
              </Label>
            )}
            {props.subsType && (
              <Label size="mini" color={subsColor}>
                {props.subsType} {togo}
              </Label>
            )}
            {props.badges && props.badges.map(badge => <MyBadge {...badge} />)}
          </div>
          <div>{props.children}</div>
        </Card.Content>
      </Card.Content>
      <Card.Content extra>
        {lastIn && (
          <div>
            <p>
              {isHere ? 'Arrived:' : 'Last Seen'} {humaniseDate(lastIn)} ago{' '}
            </p>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}

MemberCard.propTypes = {
  className: PropTypes.string,
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  isHere: PropTypes.bool.isRequired,
  sessions: PropTypes.array.isRequired,
  lastIn: PropTypes.object,
  sessionCount: PropTypes.number.isRequired
}

export default MemberCard
