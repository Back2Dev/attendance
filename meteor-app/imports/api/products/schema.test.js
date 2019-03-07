import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

import Products from './schema'
import Factory from '/imports/test/factories'

const badProducts = [
  // 1. no name
  {
    description: 'Passes allow you to use Back 2 Bikes',
    type: 1,
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-05-18T16:00:00Z'
  },
  // 2. no description
  {
    name: 'Pass for Back2Bikes',
    type: 1,
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-05-18T16:00:00Z'
  },
  // 3. no type
  {
    name: 'Pass for Back2Bikes',
    description: 'Passes allow you to use Back 2 Bikes',
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-05-18T16:00:00Z'
  },
  // 4. duration a boolean instead of number
  {
    name: 'Pass for Back2Bikes',
    description: 'Passes allow you to use Back 2 Bikes',
    type: 2,
    duration: true,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-05-18T16:00:00Z'
  },
  // 5. price a boolean instead of number
  {
    name: 'Pass for Back2Bikes',
    description: 'Passes allow you to use Back 2 Bikes',
    type: 3,
    duration: 3,
    price: true,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-05-18T16:00:00Z'
  }
]

const goodProducts = [
  {
    name: '3 Month membership for Back2Bikes',
    description: 'Passes allow you to use Back 2 Bikes',
    type: 2,
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-05-18T16:00:00Z'
  },
  {
    name: 'Intro to Bikes',
    description: 'A Free course on how to ride a bike',
    type: 1,
    active: true,
    bogus: "This won't be saved in the database (SimpleSchema silently drops it)"
  },
  {
    name: '3 Month membership for Back2Bikes',
    description: 'Passes allow you to use Back 2 Bikes',
    type: 2,
    duration: 3,
    price: 5000,
    image: '/public/images/gym.jpg',
    active: true,
    startDate: '2019-02-18T16:00:00Z',
    endDate: '2019-05-18T16:00:00Z'
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

        // ".name .description .type .duration .price .image .active"
        // .split(/\s+/)
        // .forEach(field => {
        //   expect(product[field].to.equal(good[field]))
        // }) // currently returns TypeError: Cannot read property 'to' of undefined
        
        expect(product._id).to.equal(good._id)
        expect(product.name).to.equal(good.name)
        expect(product.description).to.equal(good.description)
        expect(product.type).to.equal(good.type)
        expect(product.duration).to.equal(good.duration)
        expect(product.price).to.equal(good.price)
        expect(product.image).to.equal(good.image)
        expect(product.active).to.equal(good.active)
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
