import faker from 'faker'
import orderItem from './fake-order-item'

const orderItems = []

for (let i = 0; i < 10; i++) {
  orderItems.push(orderItem)
}

const order = {
  status: 1,
  additionalNotes: faker.lorem.sentences(),
  totalPrice: faker.finance.amount(),
  orderedParts: orderItems
}

export default order