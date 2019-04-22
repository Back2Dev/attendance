import React from 'react'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import cloneDeep from 'lodash'
import { CartContext } from './cart-data'

const debug = require('debug')('b2b:shop')

const ErrMsg = props => <span style={{ fontSize: '9px', color: 'red' }}>{props.children}</span>
const Required = props => <span style={{ color: 'red', paddingRight: '20px' }}>*</span>

const Address = props => {
  const { state, dispatch } = React.useContext(CartContext)
  const [a, setAddress] = React.useState(state.creditCard || {})
  const [e, setError] = React.useState([])

  const fieldChange = event => {
    const addr = cloneDeep(a)
    debug(`changed: ${event.target.name} => ${event.target.value}`)
    addr[event.target.name] = event.target.value
    setAddress(addr)
    setError([])
  }

  const submitAddress = event => {
    event.preventDefault()
    const required = 'line1 city postcode state'.split(/\s+/)
    const errs = []
    // If we are valid...
    if (
      required
        .map(field => {
          const f = `address_${field}`
          const isValid = a[f] && a[f] !== ''
          if (!isValid) errs.push(field)
          debug(`${f}: ${a[f]} ${isValid}`)
          return isValid
        })
        .every(f => f)
    ) {
      // Add the address to the cart
      dispatch({ type: 'save-address', payload: a })
      props.history.push('/shop/credit-card')
    } else setError(errs)
  }

  const isAbsent = name => e.indexOf(name) === -1

  return (
    <Form id="address_form" action="" method="post" size="mini">
      <Form.Input
        fluid
        error={e.indexOf('line1') !== -1}
        label="Address"
        placeholder="Billing Address"
        defaultValue={a.address_line1}
        onChange={fieldChange}
        name="address_line1"
      />

      <Form.Input
        fluid
        error={e.indexOf('line2') !== -1}
        label="Address (Continued)"
        placeholder="Address line 2"
        defaultValue={a.address_line2}
        onChange={fieldChange}
        name="address_line2"
      />

      <Form.Input
        fluid
        error={e.indexOf('city') !== -1}
        label="City or suburb"
        placeholder="City"
        defaultValue={a.address_city}
        onChange={fieldChange}
        name="address_city"
      />

      <Form.Input
        fluid
        error={e.indexOf('postcode') !== -1}
        label="Postcode or ZIP"
        placeholder="Postcode/ZIP"
        defaultValue={a.address_postcode}
        onChange={fieldChange}
        name="address_postcode"
      />

      <Form.Input
        fluid
        error={e.indexOf('state') !== -1}
        label="State or Province"
        placeholder="State/Province"
        defaultValue={a.address_state}
        onChange={fieldChange}
        name="address_state"
      />

      <Form.Input
        fluid
        error={e.indexOf('country') !== -1}
        label="Country"
        placeholder="Country"
        defaultValue={a.address_country}
        onChange={fieldChange}
        name="address_country"
      />

      {e.length > 1 && <Message negative header="Oops, your address is missing:" content={e.join(', ')} />}
      <Button size="mini" type="button" color="green" floated="right" onClick={submitAddress}>
        Next
      </Button>
    </Form>
  )
}

export default Address
