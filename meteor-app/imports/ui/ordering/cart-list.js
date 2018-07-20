import React from 'react'
import { Input, Divider, Container, Segment, Table, Button } from 'semantic-ui-react'
import Component from '/imports/ui/ordering/cart-list-item'


const CartList = (props) => {
  let { order } = props

  // const componentOrderedParts = orders.orderedParts.map(part => {
  //   return <Component key={part._id} {...part} />
  // })

  return (

    <div>
      {console.log(order)}
      {React.Children.map(props.children, (child) => child)}
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
                order.orderedParts.map(part => (

                  <Component key={part._id} className="part-card"{...part} />
                ))
              }
            </Table.Body>
          </Table>
        </Container>

        <Divider />

        <Container textAlign='center'>
          <Input fluid label='Additional Notes' />
          <Segment text raised>
            Total Price: $
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