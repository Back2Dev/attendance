import React from 'react'
import MemberAdd from '/imports/ui/member/member-add-container'

const MemberEdit = props => {
  const { member } = props
  if (!member) return <div>Sorry, I can't find that person</div>
  return (
    <div>
      <h1>Edit page for {member.name}</h1>
      <MemberAdd member={member} />
    </div>
  )
}

export default MemberEdit
