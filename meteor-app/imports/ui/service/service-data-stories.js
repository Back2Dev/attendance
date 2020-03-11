const services = [
  {
    name: 'Safety check / adjust brakes and gears',
    price: 1000,
    package: 'Minor',
    code: 'FR'
  },
  {
    name: 'Check hubs for wear/play',
    price: 1000,
    package: 'Minor',
    code: 'FR'
  },
  {
    name: 'Remove, clean and oil chain',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Clean rear cassette',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Check tyre pressure',
    price: 500,
    package: 'Minor',
    code: 'FR'
  },
  {
    name: 'Lube derailleurs',
    price: 500,
    package: 'Minor',
    code: 'FR'
  },
  {
    name: 'Check/tighten bolts on cranks, headset, wheels and bottom bracket',
    price: 1000,
    package: 'Minor'
  },
  {
    name: 'Check wheels are true',
    price: 1200,
    package: 'Major',
    code: 'FR'
  },
  {
    name: 'Clean and re-grease wheel bearings',
    price: 1200,
    package: 'Major',
    code: 'FR'
  },
  {
    name: 'Clean and re-grease headset',
    price: 1200,
    package: 'Major'
  },
  {
    name: 'Clean and re-grease bottom bracket',
    price: 1200,
    package: 'Major'
  },
  {
    name: 'Clean and re-grease seat post and clamps',
    price: 1200,
    package: 'Major'
  }
]

const parts = [
  {
    name: 'Front Tyre (second hand)',
    price: 500,
    code: 'F',
    category: 'tyre',
    used: true
  },
  {
    name: 'Rear Tyre (second hand)',
    price: 500,
    code: 'R',
    category: 'tyre',
    used: true
  },
  {
    name: 'Front Tyre (new)',
    price: 1000,
    code: 'F',
    category: 'tyre',
    used: false
  },
  {
    name: 'Rear Tyre (new)',
    price: 1000,
    code: 'R',
    category: 'tyre',
    used: false
  },
  {
    name: 'Brake pads - Dual pivot',
    price: 1500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Brake pads - V brakes',
    price: 1000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Tube',
    price: 800,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Tube & fitting',
    price: 2000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Front brake cable fitted',
    price: 1000,
    code: 'F',
    category: 'cable',
    used: false
  },
  {
    name: 'Rear brake cable fitted',
    price: 1000,
    code: 'R',
    category: 'cable',
    used: false
  },
  {
    name: 'Front gear cable fitted',
    price: 1000,
    code: 'F',
    category: 'cable',
    used: false
  },
  {
    name: 'Rear gear cable fitted',
    price: 1000,
    code: 'R',
    category: 'cable',
    used: false
  },
  {
    name: 'Cable fitting x 1',
    price: 1500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Cable fitting x 2',
    price: 3000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Wheel true',
    price: 2500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Spokes and nipples',
    price: 500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Hub service',
    price: 1500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Hub service with new cones',
    price: 2500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Bottom Bracket - square taper cartridge',
    price: 2200,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Bottom Bracket - Octalink, Hollowtech etc',
    price: 2200,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Chain - 6/7/8 Speed',
    price: 2500,
    code: 'O',
    category: 'chain',
    used: false
  },
  {
    name: 'Chain - 9 Speed',
    price: 3200,
    code: 'O',
    category: 'chain',
    used: false
  },
  {
    name: 'Chain - 10 Speed',
    price: 4400,
    code: 'O',
    category: 'chain',
    used: false
  },
  {
    name: 'Chain - 11 Speed',
    price: 6600,
    code: 'O',
    category: 'chain',
    used: false
  },
  {
    name: 'Chain - single speed/hub gear',
    price: 1200,
    code: 'O',
    category: 'chain',
    used: false
  },
  {
    name: 'Locks - cable/combination',
    price: 2000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Locks - D',
    price: 3400,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Light set - button rechargable',
    price: 4000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Light set - button battery',
    price: 2000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Lights - high power, per end',
    price: 3600,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Rear cog sets - free wheel 5 speed',
    price: 2000,
    code: 'R',
    category: 'cog set',
    used: false
  },
  {
    name: 'Rear cog sets - free wheel 6 speed',
    price: 2200,
    code: 'R',
    category: 'cog set',
    used: false
  },
  {
    name: 'Rear cog sets - free wheel 7 speed',
    price: 2500,
    code: 'R',
    category: 'cog set',
    used: false
  },
  {
    name: 'Rear cog sets - free wheel 8 speed',
    price: 3200,
    code: 'R',
    category: 'cog set',
    used: false
  },
  {
    name: 'Rear cog sets - free wheel 9 speed',
    price: 4800,
    code: 'R',
    category: 'cog set',
    used: false
  },
  {
    name: 'Rear cog sets - free wheel 10 speed',
    price: 6600,
    code: 'R',
    category: 'cog set',
    used: false
  },
  {
    name: 'Rear cog sets - free wheel 11 speed',
    price: 8500,
    code: 'R',
    category: 'cog set',
    used: false
  },
  {
    name: 'Single Speed',
    price: 3200,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Grips - standard',
    price: 1000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Grips - lock on',
    price: 2000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Bar tape',
    price: 2000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Bar tape supply and fitting',
    price: 3500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Racks supply and fit',
    price: 4500,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Saddle',
    price: 2000,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Bell',
    price: 600,
    code: 'O',
    category: 'other',
    used: false
  },
  {
    name: 'Side stand including fitting',
    price: 1500,
    code: 'O',
    category: 'other',
    used: false
  }
]

export const storiesData = {
  data: [...parts, ...services],
  tags: []
}
