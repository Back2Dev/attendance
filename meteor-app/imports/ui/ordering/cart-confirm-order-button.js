import React from 'react'
import { Icon, Button } from 'semantic-ui-react'


const ConfirmOrder = (props) => (
    <div>
      <Button icon labelPosition="right" primary>
        <Icon name='check circle' size='big'/>
        CONFIRM <br /> ORDER
      </Button>
    </div>
)

export default ConfirmOrder
