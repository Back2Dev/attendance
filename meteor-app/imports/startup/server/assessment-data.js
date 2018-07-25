import { Meteor } from 'meteor/meteor'
import Services from '/imports/api/assessments/services'
import ServiceItems from '/imports/api/assessments/serviceItems'

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
        name: 'Front Tyre (second hand)',
        price: 500
      },
      {
        name: 'Rear Tyre (second hand)',
        price: 500
      },
      {
        name: 'Front Tyre (new)',
        price: 1000
      },
      {
        name: 'Rear Tyre (new)',
        price: 1000
      },
      {
        name: 'Brake pads - Dual pivot',
        price: 1500
      },
      {
        name: 'Brake pads - V brakes',
        price: 1000
      },
      {
        name: 'Tube',
        price: 800
      },
      {
        name: 'Tube & fitting',
        price: 2000
      },
      {
        name: 'Cable x 1',
        price: 500
      },
      {
        name: 'Cables x 2',
        price: 1000
      },
      {
        name: 'Cables x 3',
        price: 1500
      },
      {
        name: 'Cables x 4',
        price: 2000
      },
      {
        name: 'Cable fitted x 1',
        price: 1000
      },
      {
        name: 'Cables fitted x 2',
        price: 2000
      },
      {
        name: 'Cables fitted x 3',
        price: 3000
      },
      {
        name: 'Cables fitted x 4',
        price: 4000
      },      
      {
        name: 'Front brake cable fitted',
        price: 1000
      },
      {
        name: 'Rear brake cable fitted',
        price: 1000
      },
      {
        name: 'Front gear cable fitted',
        price: 1000
      },
      {
        name: 'Rear gear cable fitted',
        price: 1000
      },
      {
        name: 'Cable fitting x 1',
        price: 1500
      },
      {
        name: 'Cable fitting x 2',
        price: 3000
      },
      {
        name: 'Wheel true',
        price: 2500
      },
      {
        name: 'Spokes and nipples',
        price: 500
      },
      {
        name: 'Hub service',
        price: 1500
      },
      {
        name: 'Hub service with new cones',
        price: 2500
      },
      {
        name: 'Bottom Bracket - square taper cartridge',
        price: 2200
      },
      {
        name: 'Bottom Bracket - Octalink, Hollowtech etc',
        price: 2200
      },
      {
        name: 'Chain - 6/7/8 Speed',
        price: 2500
      },
      {
        name: 'Chain - 9 Speed',
        price: 3200
      },
      {
        name: 'Chain - 10 Speed',
        price: 4400
      },
      {
        name: 'Chain - 11 Speed',
        price: 6600
      },
      {
        name: 'Chain - single speed/hub gear',
        price: 1200
      },
      {
        name: 'Locks - cable/combination',
        price: 2000
      },
      {
        name: 'Locks - D',
        price: 3400
      },
      {
        name: 'Light set - button rechargable',
        price: 4000
      },
      {
        name: 'Light set - button battery',
        price: 2000
      },
      {
        name: 'Lights - high power, per end',
        price: 3600
      },
      {
        name: 'Rear cog sets - free wheel 5 speed',
        price: 2000
      },
      {
        name: 'Rear cog sets - free wheel 6 speed',
        price: 2200
      },
      {
        name: 'Rear cog sets - free wheel 7 speed',
        price: 2500
      },
      {
        name: 'Rear cog sets - free wheel 8 speed',
        price: 3200
      },
      {
        name: 'Rear cog sets - free wheel 9 speed',
        price: 4800
      },
      {
        name: 'Rear cog sets - free wheel 10 speed',
        price: 6600
      },
      {
        name: 'Rear cog sets - free wheel 11 speed',
        price: 8500
      },
      {
        name: 'Single Speed',
        price: 3200
      },
      {
        name: 'Grips - standard',
        price: 1000
      },
      {
        name: 'Grips - lock on',
        price: 2000
      },
      {
        name: 'Bar tape',
        price: 2000
      },
      {
        name: 'Bar tape supply and fitting',
        price: 3500
      },
      {
        name: 'Racks supply and fit',
        price: 4500
      },
      {
        name: 'Saddle',
        price: 2000
      },
      {
        name: 'Bell',
        price: 600
      },
      {
        name: 'Side stand including fitting',
        price: 1500
      },
    ]

    for (let i = 0; i < parts.length; i++) {
      ServiceItems.insert(parts[i])
    }
  }
})

Meteor.startup(() => {
  if (Services.find().count() === 0) {
    Meteor.call('seed.services')
  }

  if (ServiceItems.find().count() === 0) {
    Meteor.call('seed.repairParts')
  }
})