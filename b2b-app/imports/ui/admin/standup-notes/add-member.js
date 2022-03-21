import { Label } from '$sb/components/question/question.stories'
import React from 'react'

const addmember = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        // justifyContent: 'center',
        flexDirection: 'row',
        //   alignItems: 'flex-start',
      }}
    >
      <h1>"Add team Member" </h1>

      <Button name="add-member" colour="purple" />

      <Button name="cancel" colour="blue" />
    </div>
  )
}

export default addmember
