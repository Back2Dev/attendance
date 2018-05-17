import React from 'react'
import { withRouter } from 'react-router-dom'
import MemberList from './member/member-list'
import MemberCardSmall from './member/member-card-small'
import MemberCard from './member/member-card'

const MemberMain = (props) => {

  function onCardClick() {
    props.history.push(`/${this}`)
}

  return (
    <div>
      <div style={{ paddingBottom: '20vh' }}>
        <MemberList
          title={'Check In:'}
          members={props.membersOut}
          Component={MemberCard}
          onCardClick={onCardClick}
        />
      </div>
      <MemberList
        style={{
          position: 'fixed',
          zIndex: '999',
          backgroundColor: 'white',
          bottom: '0',
          left: '0',
          right: '0',
          height: '20vh',
          padding: '0 20px 10px',
          textAlign: 'center'
        }}
        title={'Who\'s Here:'}
        members={props.membersIn}
        Component={MemberCardSmall}
        onCardClick={onCardClick}
      />
    </div>
  )
}

export default withRouter(MemberMain)
