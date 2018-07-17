import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
import { Random } from 'meteor/random'

import Parts from '/imports/api/parts/schema'
import Factory from '/imports/test/factories'
import { RegExId } from '../schema';

const badParts = [
    {
        imageUrl: '/public/images/logo-large.jpg',
        wholesalePrice: 3000, // in cents
        partNo: '12345',
        desc: 'golden bell',
        barcode: '0001000010102345',
        status: 1,
    },
    {
        imageUrl: '/public/images/logo-large.jpg',
        retailPrice: 5070,
        wholesalePrice: 33.40,
        desc: 'golden bell',
        barcode: '0102345001000010',
        status: 0,
    },
    {
        imageUrl: '/public/images/logo-large.jpg',
        retailPrice: 9690,
        partNo: 101,
        desc: 'bmx pegs',
        barcode: '11100011102',
        status: 'sent',
    },
]

const goodParts = [
    {
        imageUrl: '/public/images/logo-large.jpg',
        retailPrice: 5000,
        wholesalePrice: 3000,
        partNo: '12345',
        desc: 'golden bell',
        barcode: '0001000010102345',
        status: 1,
    },
    {
        imageUrl: '/public/images/logo-large.jpg',
        retailPrice: 600.00,
        wholesalePrice: 34000,
        partNo: '12345',
    },
    {
        retailPrice: 34500,
        wholesalePrice: 333000,
        partNo: '54321',
        desc: "pink pedals"
    },
]

describe('schema', () => {

    goodParts.forEach((good, i) => {
        describe('PartsSchema good parts', () => {
            it(`Succeeds on GOOD Parts insert ${i + 1}`, () => {
                console.log(good);
                expect(() => Parts.insert(good)).not.to.throw()
            })
        })
    })

    badParts.forEach((bad, i) => {
        describe('PartsSchema bad parts', () => {
            it(`Succeeds on BAD Parts insert ${i + 1}`, () => {
                console.log(bad);
                expect(() => Parts.insert(bad)).to.throw()
            })
        })
    })
})