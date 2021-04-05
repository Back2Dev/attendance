// bp - read.js
const fs = require('fs')
const buf = fs.readFileSync('bp-data.txt', { encoding: 'utf8' })
const lines = buf.split(/\n/)
const offices = []
const template = {
  name: '',
  organisation: 'Barry Plant',
  mappings: 'agentbox',
  slug: '',
  apiKey: '123AAAxxx123AAAxxx123AAXXX',
  secret: 'I-am-another-well-kept-secret',
  listingsUrl: 'https://api.agentboxcrm.com.au/listings',
  staffUrl: 'https://api.agentboxcrm.com.au/staff',
  contactsUrl: 'https://api.agentboxcrm.com.au/contacts',
  headers: {},
  active: false,
  poll: true,
  params: {
    version: 2,
    limit: 50,
    orderBy: 'lastModified',
    order: 'DESC',
    'filter[features]': 'SE_Buyer,SE_Vendor',
    include:
      'relatedContacts,relatedStaffMembers,contractDetails,internalInformation,inspectionDates,mainImage,documents,mainDescription',
  },
}
// Ballarat:
// API Key: 726c-76ff-9814-ec51-2340-c33b-37ff-8ffe-3fb7-a116
// ClientID: aHR0cHM6Ly9iYXJyeXBsYW50YmFsbGFyYXQuYWdlbnRib3hjcm0uY29tLmF1L2FkbWluLw==

let rec = {}
lines.forEach((line) => {
  if (line.match(/.*?:$/)) {
    if (rec.name) {
      template.name = `BP ${rec.name}`
      template.slug = `bp-${rec.name.replace(/\s+/g, '-')}`.toLowerCase()
      template.headers = { ['X-Client-ID']: rec.apikey, ['X-API-Key']: rec.clientid }
      offices.push(Object.assign({}, template))
    }
    rec.name = line.replace(/:/, '')
    rec.headers = {}
  }
  if (line.match(/API Key:\s*/)) rec.clientid = line.replace(/API Key:\s*/, '')
  if (line.match(/ClientID:\s*/)) rec.apikey = line.replace(/ClientID:\s*/, '')
})
fs.writeFileSync('bp.json', JSON.stringify(offices, null, 2))
