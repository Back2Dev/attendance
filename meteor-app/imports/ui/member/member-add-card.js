import React from 'react'

const MemberAddCard = ({ member }) => {
  if (!member) return <div>No member supplied to MemberAddCard component</div>
  return (
    <div>
      <h1>Add Credit Card for {member.name}</h1>
    </div>
  )
}

export default MemberAddCard
