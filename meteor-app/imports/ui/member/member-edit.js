import React from 'react'
import MemberAdd from '/imports/ui/member/member-add-container'
const MemberEdit = (props) => {
  if(!props.member) return null
  const {member} = props
  return (
    <div>
    <h1>Edit page for {member.name}</h1>
    <MemberAdd member={member} />
    </div>
  )
}

export default MemberEdit