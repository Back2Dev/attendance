import faker from 'faker'
import orderItem from './fake-order-item'

faker.seed(1234)
const orderItems = []

for (let i = 0; i < 10; i++) {
  orderItems.push(orderItem)
}

const order = {
  status: 1,
  additionalNotes: faker.lorem.sentences(),
  totalPrice: faker.finance.amount() * 100,
  orderedParts: orderItems,
  oldOrders: []
}

export default order
