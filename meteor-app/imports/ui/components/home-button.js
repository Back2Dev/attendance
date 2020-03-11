import React from 'react'
import { Button } from 'semantic-ui-react'
import context from '/imports/ui/utils/nav'

const HomeButton = props => {
  return (
    <Button
      onClick={() => {
        props.history.push(context.goHome())
      }}
    >
      Home
    </Button>
  )
}

export default HomeButton
