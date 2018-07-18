import faker from 'faker'

const orderItem = {
  partId: faker.finance.amount(),
  part: faker.lorem.sentences(),
  partNo: faker.finance.amount(),
  addedAt: faker.date.recent(),
  price: (faker.finnce.amount() / 10),
  qty: ((faker.finance.amount() / 500) + 1),
  userId: faker.finance.amount(),
}

export default orderItem