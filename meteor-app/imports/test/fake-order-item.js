import { faker } from '@faker-js/faker'

faker.seed(999)

const orderItem = {
  partId: parseFloat(faker.finance.amount()),
  name: faker.lorem.sentences(),
  partNo: "91234567",
  addedAt: faker.date.recent(),
  price: (parseFloat(faker.finance.amount()) / 10),
  qty: ((parseFloat(faker.finance.amount()) / 500) + 1),
  userId: parseFloat(faker.finance.amount()),
}


export default orderItem