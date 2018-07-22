import React from 'react'
import { Input, Header, Container, Segment, Table, Button } from 'semantic-ui-react'
import Component from '/imports/ui/ordering/cart-list-item'
import CartIcon from '/imports/ui/ordering/cart-icon'

const CartList = (props) => {
  let { order } = props
  let noOfParts = 0


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
      <Container textAlign='center'>
          <Segment raised clearing>

            {(!props.loading && order) && order.orderedParts.forEach(part =>{
              noOfParts =+ part.qty
              return noOfParts
            }) }
           <Header as='h3' block>Review Shop Order </Header>
           
  
          <CartIcon noOfParts={noOfParts}  />
  
          </Segment>
        </Container>
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
            {(!props.loading && order) && <Header as='h3' block>Total Price: $ {order.totalPrice / 100}</Header>}
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