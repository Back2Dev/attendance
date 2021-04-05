const animals = [
  'cat', 'dog', 'emu', 'koala', 'kangaroo', 'cow', 'bird', 'wombat', 'parrot',
  'bear', 'otter', 'hen', 'joey', 'dugong', 'lion', 'deer', 'gecko',
  'wallaby', 'tiger', 'wolf', 'hound', 'fish', 'carp', 'pokemon',
]

export default function randomAnimal() {
  return animals[ Math.floor(Math.random() * animals.length) ].toLowerCase()
}


