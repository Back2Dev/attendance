import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema'
const debug = require('debug')('app:getschema')
const ajv = new Ajv({ allErrors: true, useDefaults: true, strict: false })
addFormats(ajv)

function createValidator(schema) {
  const validator = ajv.compile(schema)

  return (model) => {
    validator(model)
    return validator.errors && validator.errors.length
      ? { details: validator.errors }
      : null
  }
}

const getSchemas = (survey) => {
  survey.steps.forEach((step, ix) => {
    step.schema = {
      title: step.name || `Unnamed step ${ix + 1}`,
      type: 'object',
      properties: {},
    }
    if (!step.questions) console.error(`Step ${ix} ${step.id} has no questions`)
    else {
      // step.schema.fieldOrder = step.questions.map((q) => q.id)
      step.schema.required = step.questions
        .filter((q) => !q.optional && q.type === 'single')
        .map((q) => q.id)
      debug(`${step.id} required`, step.schema.required)
      step.questions.forEach((q) => {
        step.schema.properties[q.id] = {
          type: 'string',
          label: '', //q.prompt
        }
        const qSchema = step.schema.properties[q.id]
        switch (q.type) {
          case 'text':
            delete step.schema.properties[q.id]
            step.schema.required = step.schema.required.concat(
              q.answers.filter((a) => !a.optional).map((a) => `${q.id}-${a.id}`)
            )
            q.answers.forEach((a) => {
              step.schema.properties[`${q.id}-${a.id}`] = {
                type: 'string',
                label: a.name,
              }
            })
            break
          case 'multi':
            delete step.schema.properties[q.id]
            q.answers.forEach((a) => {
              const id = `${q.id}-${a.id}`
              step.schema.properties[id] = {
                type: 'boolean',
                label: a.name,
              }
            })
            step.schema.required = step.schema.required.concat(
              q.answers
                .filter((a) => a.specify)
                .map((a) => {
                  const specifyId = `${q.id}-${a.id}-specify`
                  step.schema.properties[specifyId] = {
                    type: 'string',
                    label: a.specify,
                  }
                  return specifyId
                })
            )
            break
          case 'single':
            qSchema.uniforms = {
              checkboxes: true,
            }
            qSchema.options = q.answers.map((a) => {
              return { label: a.name, value: a.value || a.id }
            })
            step.schema.required = step.schema.required.concat(
              q.answers
                .filter((a) => a.specify)
                .map((a) => {
                  const specifyId = `${q.id}-${a.id}-specify`
                  step.schema.properties[specifyId] = {
                    type: 'string',
                    label: a.specify,
                  }
                  return specifyId
                })
            )
            break
          case 'boolean':
            qSchema.type = 'boolean'
            qSchema.options = q.answers.map((a) => {
              return { label: a.name, value: a.value }
            })
            break
          case 'address':
            delete step.schema.properties[q.id]
            // qSchema.type = 'string'
            break
          case 'paragraph':
            delete step.schema.properties[q.id]
            break
          case 'upload':
            break
          case 'date':
            delete step.schema.properties[q.id]
            q.answers.forEach((a) => {
              const id = `${q.id}-${a.id}`
              step.schema.properties[id] = {
                type: 'object',
                format: 'full',
                label: a.name,
              }
            })
            break
          // Need a better way to handle this
          default:
            delete step.schema.properties[q.id]
            console.error(`Unsupported question type: ${q.type}`)
        }
      })
      debug(`${step.id} required`, step.schema.required)

      debug('schema', step.schema)
      step.bridge = new JSONSchemaBridge(step.schema, createValidator(step.schema))
    }
  })
}

export default getSchemas
