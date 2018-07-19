import { Meteor } from 'meteor/meteor'
import Services from '/imports/api/assessments/services'
import Parts from '/imports/api/assessments/parts'

Meteor.methods({
  'seed.services'() {
    // CUrrently placeholder data
    const services = [
      {
        name: 'Check functionality/adjust brakes and gears',
        price: 1000,
        package: 'Minor',
      },
      {
        name: 'Check hubs for wear/play',
        price: 1000,
        package: 'Minor',
      },
      {
        name: 'Remove, clean and oil chain',
        price: 1000,
        package: 'Minor',
      },
      {
        name: 'Clean rear cassette',
        price: 1000,
        package: 'Minor',
      },
      {
        name: 'Check tyre pressure',
        price: 500,
        package: 'Minor',
      },
      {
        name: 'Lube deraileurs',
        price: 500,
        package: 'Minor',
      },
      {
        name: 'Check/tighten bolts on cranks, headset, wheels and bottom bracket',
        price: 1000,
        package: 'Minor',
      },
      {
        name: 'Check wheels are true',
        price: 1200,
        package: 'Major',
      },
      {
        name: 'Clean and re-grease wheel bearings',
        price: 1200,
        package: 'Major',
      },
      {
        name: 'Clean and re-grease headset',
        price: 1200,
        package: 'Major',
      },
      {
        name: 'Clean and re-grease bottom bracket',
        price: 1200,
        package: 'Major',
      },
      {
        name: 'Clean and re-grease seat post and clamps',
        price: 1200,
        package: 'Major',
      }
    ]

    for (let i = 0; i < services.length; i++) {
      Services.insert(services[i])
    }
  },
  'seed.repairParts'() {
    // Currently placeholder data
    const parts = [
      {
        name: '1 x Tyre',
        price: 1000
      },
      {
        name: '2 x Tyre',
        price: 2000
      },
      {
        name: '1 x Brake Cables',
        price: 1000
      },
      {
        name: '2 x Brake Cables',
        price: 2000
      },
      {
        name: '3 x Brake Cables',
        price: 3000
      },
      {
        name: '4 x Brake Cables',
        price: 4000
      },
      {
        name: '1 x Gear Cables',
        price: 1000
      },
      {
        name: '2 x Gear Cables',
        price: 2000
      },
      {
        name: '3 x Gear Cables',
        price: 3000
      },
      {
        name: '4 x Gear Cables',
        price: 4000
      },
      {
        name: 'Chain and Cassette',
        price: 1000
      },
      {
        name: 'Handlebar Grips',
        price: 2000
      },
      {
        name: 'Wheel Bearings',
        price: 3000
      },
      {
        name: 'Rack and Basket Fitting',
        price: 4000
      },
      {
        name: 'Bar Tape',
        price: 1000
      },
      {
        name: 'Bottom Bracket',
        price: 2000
      },
      {
        name: 'Wheel Truing',
        price: 3000
      },
      {
        name: 'Locks',
        price: 4000
      },
      {
        name: 'Lights',
        price: 4000
      },
      {
        name: 'Helmet',
        price: 4000
      }
    ]

    for (let i = 0; i < parts.length; i++) {
      Parts.insert(parts[i])
    }
  }
})

Meteor.startup(() => {
  if (Services.find().count() === 0) {
    Meteor.call('seed.services')
  }

  if (Parts.find().count() === 0) {
    Meteor.call('seed.repairParts')
  }
})