const fs = require('fs')
const axios = require('axios')

const apiKey = 'SEQ4NWdIbURyckNzTDhEdDV4ZHJ2bFNPUHhFQUE1bndfNzk5MTA'

const debug = require('debug')('app:flowlu')

const querystring = require('querystring')

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2))

const { from, to, tag, pipeline } = opts
const required = 'from, to, pipeline'.split(/[\s,;]+/)

if (opts.help || !required.every((option) => opts[option])) {
  console.log(`
#Usage:
	node scripts/flowlu-import-opportunities.js --from=nnn --to=nnn [--via=nnn] --pipeline=nnn --tag=xxx [--op=set|delete]
Where
  --from=xxx - name of "from" stage
  --to=xxx  - name of "to" stage
  --pipeline=xxx  - name of pipeline
  --tag=xxx - filters 'description' for this
  --op=set | delete

#Prerequisites
	- None

#Processing:
	This command will do the following

  `)
  process.exit(0)
}

const getStage = (pipe, stage, pipes) => {
  const allpipes = Object.keys(pipes).map((id) => pipes[id])
  const pipeline = allpipes.find((p) => p.name === pipe)
  if (pipeline) {
    const stg = pipeline.stages.find((s) => s.name === stage)
    if (stg) return [stg.id, pipeline.id]
  }
  return [0, 0]
}

const doit = async () => {
  try {
    // Get the list of contacts
    let done = false
    const persons = []
    let getPage = 1
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

    debug('Fetching leads...')
    const [fromId, pipelineId] = getStage(pipeline, from, pipelines)
    const [toId] = getStage(pipeline, to, pipelines)
    const [viaId] = getStage(pipeline, opts.via, pipelines)

    while (!done) {
      let contacts = await axios.get(
        `https://tracking.flowlu.com/api/v1/module/crm/lead/list?api_key=${apiKey}&page=${getPage}`
      )
      const { total, page, count, total_response } = contacts.data.response
      debug('contacts: ', { total, page, count, total_response })
      contacts.data.response.items.forEach((contact) => {
        if (
          contact.description.includes(tag) &&
          contact.pipeline_stage_id === fromId &&
          contact.pipeline_id === pipelineId
        )
          persons.push(contact)
      })
      if (count === 0) done = true
      getPage = getPage + 1
    }
    debug({ persons })

    for (person of persons) {
      let url = `https://tracking.flowlu.com/api/v1/module/crm/lead/update/${person.id}?api_key=${apiKey}`
      if (opts.op === 'delete')
        url = `https://tracking.flowlu.com/api/v1/module/crm/lead/delete/${person.id}?api_key=${apiKey}`
      let params = {
        pipeline_stage_id: toId,
      }
      if (viaId) {
        params.pipeline_stage_id = viaId
        debug('updating opportunities via', url, params)
        let res = await axios.post(url, querystring.stringify(params))
        debug('update result: ', res.status, res.data)
        // Set the target to the final destination
        params.pipeline_stage_id = toId
      }
      debug('updating opportunities', url, params)
      let res = await axios.post(url, querystring.stringify(params))
      debug('update result: ', res.status, res.data)
    }
  } catch (e) {
    console.error(
      `API Call failed: ${e.message}, ${e.response && e.response.data.message}`
    )
  }
}

doit()
