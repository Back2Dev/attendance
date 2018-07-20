import React from 'react'
import { Input, Divider, Container, Segment, Table, Button } from 'semantic-ui-react'
import Component from '/imports/ui/ordering/cart-list-item'


const CartList = (props) => {
  let { order } = props

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '100%',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        <Container>
          <Table striped size='large' celled compact='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Part #</Table.HeaderCell>
                <Table.HeaderCell>Part</Table.HeaderCell>
                <Table.HeaderCell>Price</Table.HeaderCell>
                <Table.HeaderCell>Qty</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>Edit</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                (!props.loading && order) &&
                order.orderedParts.map((part) => (
                  <Component className='cart-item' key={part.partId} {...part} />
                ))
              }
            </Table.Body>
          </Table>
        </Container>

        <br />

        <Container textAlign='center'>
          <Input fluid label='Additional Notes' />
          <Segment raised>
            {(!props.loading && order) && <div>Total Price: $ {order.totalPrice / 100}</div>}
            <br />
            <Button primary>
              CONFIRM <br />ORDER
        </Button>
          </Segment>
        </Container>
      </div>
    </div>
  )
}

export default CartList