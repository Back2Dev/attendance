import React from 'react'
import MemberAdd from '/imports/ui/member/member-add-container'

const MemberEdit = props => {
  if (!props.member) return <h1>Person not found</h1>
  const { member } = props
  return (
    <div>
      <h4>Edit page for {member.name}</h4>
      <MemberAdd member={member} />
    </div>
  )
}

export default MemberEdit
