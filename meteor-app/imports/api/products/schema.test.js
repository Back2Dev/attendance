import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Products from './schema'
import Factory from '/imports/test/factories'

const badProducts = [
    // 1. no productTitle
  {
    productDescription: 'Passes allow you to use Back 2 Bikes',
    productType:'pass',
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: "2019-02-18T16:00:00Z",
    endDate: "2019-05-18T16:00:00Z"
  },
    // 2. no productDescription 
  {
    productTitle: "Pass for Back2Bikes",
    productType:'pass',
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: "2019-02-18T16:00:00Z",
    endDate: "2019-05-18T16:00:00Z"
  },
    // 3. no productType
  {
    productTitle: "Pass for Back2Bikes",
    productDescription: 'Passes allow you to use Back 2 Bikes',
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: "2019-02-18T16:00:00Z",
    endDate: "2019-05-18T16:00:00Z"
  },
    // 4. duration a boolean instead of number
  {
    productTitle: "Pass for Back2Bikes",
    productDescription: 'Passes allow you to use Back 2 Bikes',
    productType:'pass',
    duration: true,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: "2019-02-18T16:00:00Z",
    endDate: "2019-05-18T16:00:00Z"
  },
    // 5. price a boolean instead of number
  {
    productTitle: "Pass for Back2Bikes",
    productDescription: 'Passes allow you to use Back 2 Bikes',
    productType:'pass',
    duration: 3,
    price: true,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: "2019-02-18T16:00:00Z",
    endDate: "2019-05-18T16:00:00Z"
  },
]

const goodProducts = [
  {
    productTitle: "3 Month membership for Back2Bikes",
    productDescription: 'Passes allow you to use Back 2 Bikes',
    productType:'membership',
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: "2019-02-18T16:00:00Z",
    endDate: "2019-05-18T16:00:00Z"
  },
  {
    productTitle: "Intro to Bikes",
    productDescription: 'A Free course on how to ride a bike',
    productType:'course',
    active: true,
  },

  {
    productTitle: "3 Month membership for Back2Bikes",
    productDescription: 'Passes allow you to use Back 2 Bikes',
    productType:'membership',
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: "2019-02-18T16:00:00Z",
    endDate: "2019-05-18T16:00:00Z"
  }
]

goodProducts.push(Factory.build('product'))
 
describe('schema', () => {
  beforeEach(resetDatabase)

  goodProducts.forEach((good, i) => {
    describe('ProductsSchema good products', () => {
      it(`Succeeds on GOOD Products insert ${i + 1}`, () => {
        expect(() => Products.insert(good)).not.to.throw()
      })
    })

    describe('query database good products', () => {
      it('success if database query matches', () => {
        const productId = Products.insert(good)
        const product = Products.findOne(productId)

        expect(product._id).to.equal(good._id)
        expect(product.productTitle).to.equal(good.productTitle)
        expect(product.productDescription).to.equal(good.productDescription)
        expect(product.productType).to.equal(good.productType)
        expect(product.duration).to.equal(good.duration)
        expect(product.price).to.equal(good.price)
        expect(product.image).to.equal(good.image)
        expect(product.active).to.equal(good.active)
        expect(product.startDate).to.equal(good.startDate)
        expect(product.endDate).to.equal(good.endDate)
      }) 
    })

    badProducts.forEach((bad, i) => {
      describe('ProductsSchema bad parts', () => {
        it(`Succeeds on BAD Products insert ${i + 1}`, () => {
          expect(() => Products.insert(bad)).to.throw()
        })
      })
    })
  })
})

