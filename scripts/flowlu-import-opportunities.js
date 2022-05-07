const fs = require('fs')
const axios = require('axios')

const apiKey = 'SEQ4NWdIbURyckNzTDhEdDV4ZHJ2bFNPUHhFQUE1bndfNzk5MTA'

const debug = require('debug')('app:flowlu')

const querystring = require('querystring')

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))

if (opts.help) {
  console.log(`
#Usage:
	node scripts/flowlu-import-opportunities.js --pipeline=xxx --stage=xxx
Where
  --pipeline = pipeline name
  --stage = stage name
  --customers = filename, eg "course-customers" will open './course-customers.json'
#Prerequisites
	- None

#Processing:
	This command will do the following

  `)
  process.exit(0)
}

let persons = []
const customerFile = opts.customers ? `./${opts.customers}.json` : './customers.json'
try {
  persons = require(customerFile)
} catch (e) {
  console.error(`Error ${e.message} when opening ${customerFile}`)
  process.exit(0)
}

const getStage = (pipe, stage, pipes) => {
  const allpipes = Object.keys(pipes).map((id) => pipes[id])
  const pipeline = allpipes.find((p) => p.name === pipe)
  if (pipeline) {
    const stg = pipeline.stages.find((s) => s.name === stage)
    return [stg ? stg.id : '1', pipeline.id]
  }
  return [0, 0]
}

const getPipelines = async (opts) => {
  debug('Fetching pipeline details')
  let pipes = await axios.get(
    `https://tracking.flowlu.com/api/v1/module/crm/pipeline/list?api_key=${apiKey}`
  )
  const pipelines = pipes.data.response.items.reduce((acc, item) => {
    acc[item.id] = item
    acc[item.id].stages = []
    return acc
  }, {})
  let stages = await axios.get(
    `https://tracking.flowlu.com/api/v1/module/crm/pipeline_stage/list?api_key=${apiKey}`
  )
  stages.data.response.items.forEach((item) => {
    pipelines[item.pipeline_id].stages.push(item)
  })
  debug({ pipelines })
  return pipelines
}

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
        existing[contact.email] = contact.id
      })
      if (count === 0) done = true
      getPage = getPage + 1
    }
    debug({ existing })

    const pipelines = await getPipelines()
    const [stageId, pipelineId] = getStage(opts.pipeline, opts.stage || 'New', pipelines)

    for (person of persons) {
      let url = `https://tracking.flowlu.com/api/v1/module/crm/account/create?api_key=${apiKey}`
      let params = querystring.stringify({
        ...person,
        type: '2',
        ref: 'someting',
        description: 'tues',
      })
      const fullname = person.first_name + ' ' + person.last_name
      if (existing[person.email]) {
        console.log(`Contact ${person.email} (${fullname}) exists already`)
      } else {
        let res = await axios.post(url, params)
        debug('created contact: ', res.data.response)

        url = `https://tracking.flowlu.com/api/v1/module/crm/lead/create?api_key=${apiKey}`
        debug('creating opportunites  ', url)
        params = querystring.stringify({
          contact_id: res.data.response.id,
          pipeline_id: pipelineId,
          name: person.first_name + ' ' + person.last_name,
          active: '1',
          pipeline_stage_id: stageId,
          customer_id: res.data.response.id,
          description: 'tues',
          ref: 'SOmething',
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
