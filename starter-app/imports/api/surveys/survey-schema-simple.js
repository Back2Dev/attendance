import SimpleSchema from 'simpl-schema'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import DatePicker from '/imports/ui/components/date-field'
// I would like to use a more modern looking date picker, but the
// lab@next has deprecated it. The newest version looks boring
//import { DatePicker } from '@material-ui/lab'
import GooglePlaces from '/imports/ui/components/google-places.js'

SimpleSchema.extendOptions(['uniforms'])
SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      MustTick: 'You must agree to the terms and conditions',
    },
  },
})
const debug = require('debug')('se:survey-schema')

const checkVolume = function () {
  debug(`Checking ${this.key} ${this.value}`, this.definition)
  if (!this.value) return 'This is required'
  if (this.value?.match(this.definition.regEx)) return undefined
  this.validationContext.addValidationErrors([
    {
      name: this.key,
      type: 'notUnique',
    },
  ])
  return 'notUnique'
}

const evaluate = (context, condition) => {
  // debug('evaluate', condition, context)
  if (!condition) return true
  const [lhs, op, rhs] = condition
  if (['equal', 'eq'].includes(op)) return context[lhs] === rhs
  if (['not equal', 'ne'].includes(op)) return context[lhs] !== rhs
  if (['falsy'].includes(op)) return !context[lhs]
  if (op === 'contains') return context[lhs] && context[lhs].includes(rhs)
  // TODO: Add more things, like 'greater', 'less' etc
  if (!op || ['truthy'].includes(op)) return !!context[lhs]
  return false
}

const getSchemas = (survey) => {
  survey.steps.forEach((step, ix) => {
    let required = [] // Not sure if we need this at all any more
    step.schema = {}
    if (!step.questions) console.error(`Step ${ix} ${step.id} has no questions`)
    else {
      // step.schema.fieldOrder = step.questions.map((q) => q.id)
      required = step.questions
        .filter((q) => !q.optional && q.qtype === 'single')
        .map((q) => q.id)
      debug(`${step.id} required`, required)
      step.questions.forEach((q) => {
        step.schema[q.id] = {
          type: String,
          label: q.prompt,
          uniforms: {},
        }
        const qSchema = step.schema[q.id]
        switch (q.qtype) {
          case 'text':
            delete step.schema[q.id]
            required = required.concat(
              q.answers.filter((a) => !a.optional).map((a) => `${q.id}-${a.id}`)
            )
            q.answers.forEach((a) => {
              const qaId = `${q.id}-${a.id}`
              let optional = !!a.optional
              const uniforms = {}
              if (q.condition && !optional) {
                uniforms.condition = q.condition
                // condition: ['buyerType', 'equal', 'individual']  // This is an expression
                // condition: ['buyerType'] // This just wants the value to be truthy
                optional = function () {
                  console.log('evaluating', this.obj, this.validationContext?._schema)
                  return !evaluate(
                    this.obj,
                    this.validationContext?._schema[this.key].uniforms.condition
                  )
                }
              }

              step.schema[qaId] = {
                type: String,
                label: a.name,
                optional,
                uniforms,
              }
              if (a.re) {
                step.schema[qaId].regEx = new RegExp(a.re)
                step.schema[qaId].custom = checkVolume
                // step.schema[qaId].optional = true
              }
              if (a.type === 'address') {
                step.schema[qaId].uniforms.margin = 'normal'
                step.schema[qaId].uniforms.component = GooglePlaces
              }
              if (a.type === 'date') {
                step.schema[qaId].type = Date
                step.schema[qaId].uniforms.margin = 'normal'
                step.schema[qaId].uniforms.component = DatePicker
              }

              if (a.type === 'email')
                step.schema[qaId].regEx = SimpleSchema.RegEx.EmailWithTLD
              if (a.type === 'calculated') {
                step.schema[qaId].optional = false
                step.schema[qaId].uniforms.expression = a.expression
              }
            })
            break
          case 'multi':
            delete step.schema[q.id]
            q.answers.forEach((a) => {
              const id = `${q.id}-${a.id}`
              step.schema[id] = {
                type: Boolean,
                label: a.name,
                optional: true, // Need a way to count these and set a minimum #required
              }
            })
            required = required.concat(
              q.answers
                .filter((a) => a.specify)
                .map((a) => {
                  const specifyId = `${q.id}-${a.id}-specify`
                  step.schema[specifyId] = {
                    type: String,
                    label: a.specify,
                    optional: true,
                  }
                  return specifyId
                })
            )
            break
          case 'single':
            qSchema.uniforms.checkboxes = true
            qSchema.uniforms.options = q.answers.map((a) => {
              return { label: a.name, value: a.value || a.id }
            })
            required = required.concat(
              q.answers
                .filter((a) => a.specify)
                .map((a) => {
                  const specifyId = `${q.id}-${a.id}-specify`
                  step.schema[specifyId] = {
                    type: String,
                    label: a.specify,
                    optional: true,
                  }
                  return specifyId
                })
            )
            break
          case 'boolean':
            qSchema.type = Boolean
            qSchema.uniforms.options = q.answers.map((a) => {
              return { label: a.name, value: a.value }
            })
            break
          case 'address':
            // delete step.schema[q.id]
            debug(`Rendering address field ${q.id}`)
            qSchema.uniforms.margin = 'normal'
            qSchema.uniforms.component = GooglePlaces

            break
          case 'paragraph':
            delete step.schema[q.id]
            break
          case 'upload':
            break
          case 'date':
            delete step.schema[q.id]
            q.answers.forEach((a) => {
              const id = `${q.id}-${a.id}`
              step.schema[id] = {
                type: Date,
                label: a.name,
                // This is NOT THE ONE YOU WANT !
                // It's for an individual field, not a list
                uniforms: { component: DatePicker },
              }
            })
            break
          // Need a better way to handle this
          default:
            delete step.schema[q.id]
            console.error(`Unsupported question type: ${q.qtype}`)
        }
      })
      debug(`${step.id} required`, required)

      debug('schema', step.schema)
      step.bridge = new SimpleSchema2Bridge(new SimpleSchema(step.schema))
    }
  })
}

export default getSchemas
