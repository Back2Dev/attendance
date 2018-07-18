// copied from member-add-success.stories.js - to be updated and changed to order

import React from 'react'
import { storiesOf } from '@storybook/react'
import OrderingAddSuccess from '/imports/ui/member/ordering-add-success'
import part from '/imports/test/fake-part'

storiesOf('Part.Add.Iframe', module)

  .add('Success', () => {
    const story = (
      <OrderingAddSuccess
        part={part}
      />
    )
    return story
  })
