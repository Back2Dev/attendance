const fs = require('fs')
const axios = require('axios')

const apiKey = 'SEQ4NWdIbURyckNzTDhEdDV4ZHJ2bFNPUHhFQUE1bndfNzk5MTA'

const debug = require('debug')('se:flowlu')

const querystring = require('querystring')

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))

if (opts.help) {
  console.log(`
#Usage:
	node scripts/flowlu-import-opportunities.js [--only=slug] 
Where

#Prerequisites
	- None

#Processing:
	This command will do the following

  `)
  process.exit(0)
}
const persons = require('./customers.json')

const pipeline_id = opts.pipeline_id || '1'
const doit = async () => {
  try {
    // Get the list of contacts
    let done = false
    const existing = {}
    let getPage = 1
    while (!done) {
      let contacts = await axios.get(
        `https://tracking.flowlu.com/api/v1/module/crm/account/list?api_key=${apiKey}&page=${getPage}`
      )
      const { total, page, count, total_response } = contacts.data.response
      debug('contacts: ', { total, page, count, total_response })
      contacts.data.response.items.forEach((contact) => {
        existing[contact.name] = contact.id
      })
      if (count === 0) done = true
      getPage = getPage + 1
    }
    debug({ existing })

    for (person of persons) {
      let url = `https://tracking.flowlu.com/api/v1/module/crm/account/create?api_key=${apiKey}`
      debug('creating contacts  ', url)
      let params = querystring.stringify({ ...person, type: '2' })
      const fullname = person.first_name + ' ' + person.last_name
      if (existing[fullname]) {
        console.log(`Contact ${fullname} exists already`)
      } else {
        let res = await axios.post(
          url,

          params
        )
        debug('contact: ', res.data.response)

        url = `https://tracking.flowlu.com/api/v1/module/crm/lead/create?api_key=${apiKey}`
        debug('creating opportunites  ', url)
        params = querystring.stringify({
          contact_id: res.data.response.id,
          pipeline_id: pipeline_id,
          name: person.first_name + ' ' + person.last_name,
          active: '1',
          pipeline_stage_id: '1',
          customer_id: res.data.response.id,
        })
        res = await axios.post(
          url,

          params
        )
        debug('opportunity: ', res.data.response)
      }
    }
  } catch (e) {
    console.error(
      `API Call failed: ${e.message}, ${e.response && e.response.data.message}`
    )
  }
}

doit()
