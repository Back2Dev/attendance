import faker from 'faker'
import orderItem from './fake-order-item'

const orderItems = []

let i
for (i = 0; i < 10; i++) {
  orderItems.push(orderItem)
}

const order = {
  _id = faker.finance.amount(),
  status = 1,
  additionalNotes = faker.lorem.sentences(),
  totalPrice = faker.finance.amount(),
  orderedParts = orderItems,
  createdAt = faker.date.recent(),
  updatedAt = faker.date.recent()
}

export default order