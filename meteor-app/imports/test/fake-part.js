import faker from 'faker'

const imagesUrls = [
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/4f8065b290713ff3dbca44641f3a52b5882c5e21.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/b574ff4cedc436ba4185849b666179acfcb9f1b0.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/28e301c326d101dadbdf52cf28cdb8f3e6bb0a4e.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/ef76b6b5a5d1b9f30db8db6a3da8a7c01d523a5b.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/0d629cb4986dc2e298ee30afd3dd89431dc7beca.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/a1bd6d38c8f70b572f1c75814f260538371a6645.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/57e14cd56d743a41459b30251cbc0a14c74c1b73.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/cc3e94374ecfc00e82c1eafdf626c03c5f5bd11f.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/bb751cf61ae9acd5fd514c2491f1911d811e544f.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/917b18f1ea145ca30274450651c6411434e37046.jpg',
  'http://cdn.webninjashops.com/bicycleparts/images/resized/556176e6d76f32931cb7b97b59de8cbd4068b3aa.png',
]

const part = {
  imageUrl: imagesUrls[Math.floor(Math.random() * imagesUrls.length)],
  retailPrice: faker.finance.amount(),
  wholesalePrice: faker.finance.amount(),
  partNo: faker.finance.amount(),
  desc: faker.lorem.sentences(),
  barcode: faker.finance.amount(),
  status: 1,
}

export default part