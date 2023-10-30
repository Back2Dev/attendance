import React from 'react'
import SportsBasketball from '@material-ui/icons/SportsBasketball'
import DirectionsRun from '@material-ui/icons/DirectionsRun'
import Accessibility from '@material-ui/icons/Accessibility'
import SportsHandball from '@material-ui/icons/SportsHandball'
import DirectionsWalk from '@material-ui/icons/DirectionsWalk'
import EmojiPeople from '@material-ui/icons/EmojiPeople'
import FlashOn from '@material-ui/icons/FlashOn'
const debug = require('debug')('app:tree-field')

const icons = [
  SportsBasketball,
  DirectionsRun,
  SportsHandball,
  Accessibility,
  DirectionsWalk,
  EmojiPeople,
  FlashOn,
]

const slugify = (text) => {
  if (!text || typeof text !== 'string') return 'no-slug'
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
}

const orgs = {
  name: 'NBA',
  children: [
    {
      name: 'Eastern Conference',
      children: [
        {
          name: 'Atlantic',
          kids: [
            'Boston Celtics',
            'Brooklyn Nets',
            'New York Knicks',
            'Philadelphia 76ers',
            'Toronto Raptors',
          ],
        },
        {
          name: 'Central',
          kids: [
            'Chicago Bulls',
            'Cleveland Cavaliers',
            'Detroit Pistons',
            'Indiana Pacers',
            'Milwaukee Bucks',
          ],
        },
        {
          name: 'Southeast',
          kids: [
            'Atlanta Hawks',
            'Charlotte Hornets',
            'Miami Heat',
            'Orlando Magic',
            'Washington Wizards',
          ],
        },
      ],
    },
    {
      name: 'Western Conference',
      children: [
        {
          name: 'Northwest',
          kids: [
            'Denver Nuggets',
            'Minnesota Timberwolves',
            'Oklahoma City Thunder',
            'Portland Trail Blazers',
            'Utah Jazz',
          ],
        },
        {
          name: 'Pacific',
          kids: [
            'Golden State Warriors',
            'Los Angeles Clippers',
            'Los Angeles Lakers',
            'Phoenix Suns',
            'Sacramento Kings',
          ],
        },
        {
          name: 'Southwest',
          kids: [
            'Dallas Mavericks',
            'Houston Rockets',
            'Memphis Grizzlies',
            'New Orleans Pelicans',
            'San Antonio Spurs',
          ],
        },
      ],
    },
  ],
}

let iconIx = 0
const nextIcon = () => {
  const res = icons[iconIx]
  iconIx = iconIx === icons.length - 1 ? 0 : iconIx + 1
  return res
}

const fix = (node) => {
  if (!node.id) node.id = slugify(node.name)
  if (!node.icon) {
    node.icon = nextIcon()
  }
  if (node.children) {
    node.children.forEach((child) => fix(child))
  }
  if (node.kids)
    node.children = node.kids.map((kid) => ({
      name: kid,
      id: slugify(kid),
      icon: nextIcon(),
    }))
}

fix(orgs)
debug(JSON.stringify(orgs, null, 2))

export default orgs
