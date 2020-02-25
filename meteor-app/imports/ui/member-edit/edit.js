import React from 'react'
import MemberEditForm from '/imports/ui/member/member-edit-container'
import Kioskbutton from '/imports/ui/member/return-to-kiosk-button.js'

const MemberEdit = props => {
  if (!props.member) return <h1>Person not found</h1>
  const { member } = props
  return (
    <div>
      <h4>Edit page for {member.name}</h4>
      <MemberEditForm member={member} />
      <Kioskbutton />
    </div>
  )
}

export default MemberEdit
