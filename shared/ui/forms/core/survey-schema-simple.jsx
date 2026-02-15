import React from 'react'
// import SimpleSchema from 'simpl-schema'
import SimpleSchema from 'simpl-schema'
import { DateTime } from 'luxon'
import cloneDeep from 'lodash/cloneDeep'
import CreateIcon from '@mui/icons-material/Create'
import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'
import { HiddenField, LongTextField, NumField, SelectField } from 'uniforms-mui'
import RegEx from '/imports/api/regexp'
import IdField from '../fields/id-field'
import JSONField from '../fields/json-field'
import DatePicker from '../fields/date-field'
import GooglePlaces from '../fields/google-places'
// import customSchema2Bridge from './custom-schema-bridge'
import { accessByPath, getQAId } from '../utils/util'

import LookupField from '../fields/lookup-field'
import RadioImageField from '../fields/radio-image-field'
import RatingField from '../fields/rating-field'
import GridField from '../fields/grid-field'
import PasswordField from '../fields/password-field'
import UploadField from '../fields/upload-field'
import TagsField from '../fields/tags-field'
import dbg from 'debug'
const debug = dbg('app:survey-schema')

const LongField = (props) => (
  <LongTextField {...props} variant="outlined" minRows="3"></LongTextField>
)

import { Bridge } from 'uniforms'
import { Blackbox, OptionalString } from '/imports/ui/utils/schema-util'

class CustomBridge extends SimpleSchema2Bridge {
  constructor(options) {
    super(options)
  }

  getProps(name) {
    const props = super.getProps(name)

    // Override label for array item schemas to prevent auto-generation
    const isArraySchema = name.endsWith('.$')
    const isArrayInstance = /^\w+\.\d+$/.test(name)
    const isArrayField = isArraySchema || isArrayInstance

    if (isArrayField) {
      console.log(
        'Overriding label for array field:',
        name,
        'from',
        props.label,
        'to empty',
      )
      return { ...props, label: '' }
    }
    return props
  }
}
SimpleSchema.extendOptions(['uniforms'])
// SimpleSchema.setDefaultMessages({
//   messages: {
//     en: {
//       MustTick: 'You must agree to the terms and conditions',
//     },
//   },
// })

const checkVolume = function () {
  // debug(`Checking ${this.key} ${this.value}`, this.definition)
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
//
// This function is called by the <DisplayIf> component, to test the condition
// - the result determines if the field should be displayed or not
export const evaluate = (formData, context, condition) => {
  if (!Array.isArray(condition)) return true
  // debug(`Evaluate ${condition?.join()}`, { formData, context })
  if (!condition) return true
  const [lhs, op = 'truthy', rhs] = condition
  const [section, field = lhs] = lhs.split(/[\/\.]/)
  const model =
    field !== lhs && formData && formData[section] ? formData[section] : context
  if (!model) return true

  // debug({ section, field, op, lhs, model })
  const value = model[field]
  let result = false // Default to NO
  if (['equal', 'eq', '='].includes(op)) result = value === rhs
  if (['not equal', 'ne', '!='].includes(op)) result = value !== rhs
  if (['falsy', '!'].includes(op)) result = !value
  if (['contains', 'contain'].includes(op)) result = value && value.includes(rhs)
  if (['truthy'].includes(op)) result = !!value
  // debug({ result })
  return result
}

const getRequiredFunc = (q, uniforms, required) => {
  // If the question is conditional, create a function instead of
  // the regular "required" property
  if (q.condition && required) {
    uniforms.condition = q.condition
    // return true // BIG HACK to make fields optional if they are conditional :(
    return function () {
      const result = evaluate(
        this.obj,
        this.obj,
        this.validationContext?._schema[this.key].uniforms.condition,
      )
      // debug(
      //   `evaluating required ${q.condition?.join()} result=${result}`,
      //   this.obj,
      //   this.validationContext?._schema
      // )
      return result
    }
  }
  if (required === undefined) return true // Return a positive value rather than 'undefined'
  return required
}

/** 
   * The config will look like this
   *      answers: {
            combine: [
              { array: 'company.directors', field: 'directors.name' },
              { array: 'individual.individuals', field: 'individuals.name' },
              { array: 'trust.trustees', field: 'trustees.name' },
            ],
          },
   */
const getAnswers = (formData, q) => {
  if (Array.isArray(q.answers)) return q.answers
  // debug({ answers: q.answers, formData })
  if (typeof q.answers === 'object') {
    if (q.answers.combine) {
      const list = q.answers.combine
        .map((selector) => {
          const [section, field = selector.array] = selector.array.split(/[\/\.]/)
          return (
            formData[section] &&
            formData[section][field] &&
            Array.isArray(formData[section][field]) &&
            formData[section][field]
              .filter(Boolean)
              .map((row) => {
                return row[selector.field]
              })
              .filter(Boolean)
          )
        })
        .flat()
        .filter(Boolean)
        .map((name, ix) => {
          return { id: name.replace(/\W/g, '-').toLowerCase(), name }
        })
      // debug('Computed answers', list)
      return list
    }
  }
  return []
}

const getSchemas = (survey, currentData, validators = {}, bridges = {}) => {
  return (
    survey.steps
      // .filter((step) => {
      //   debug('Checking ', step, currentData, step.condition)
      //   return evaluate(currentData, { model: {} }, step.condition)
      // })
      .map((s, ix) => {
        const step = cloneDeep(s)
        step.schema = {}
        step.visible = true
        if (!evaluate(currentData, { model: {} }, step.condition)) step.visible = false
        else if (!step.questions)
          console.error(`Section ${ix} ${step.id} has no questions`)
        else {
          step.questions.forEach((q) => {
            step.schema[q.id] = {
              type: String,
              label: q.prompt,

              uniforms: {},
            }
            const qSchema = step.schema[q.id]
            if (q.custom && validators[q.custom]) qSchema.custom = validators[q.custom]

            let subSchema = {}
            const answers = getAnswers(currentData, q)

            switch (q.type) {
              case 'table': // A temporary hack - just model this as an array, and let the UI be something different
              // // step.schema[q.id].type = Array
              // qSchema.uniforms.component = TableField
              // step.schema[`${q.id}.$`] = new SimpleSchema(subSchema)
              // break
              case 'array':
                step.schema[q.id].type = Array
                step.schema[q.id].minCount = q.minCount || 1
                if (q.maxCount) step.schema[q.id].maxCount = q.maxCount
                step.schema[q.id].label = q.custom ? q.id : ''
                step.schema[q.id].uniforms.addIcon = q.plus || 'Add another'
                step.schema[q.id].required = !q.optional
                subSchema = {}
                answers.forEach((a, ix) => {
                  const qaId = getQAId(q.id, answers, ix) //`${q.id}__${a.id}`
                  let required = !a.optional
                  const uniforms = {}
                  required = getRequiredFunc(q, uniforms, required)

                  subSchema[qaId] = {
                    type: String,
                    label: a.name,
                    required,
                    uniforms,
                  }
                  if (a.re) {
                    subSchema[qaId].regEx = new RegExp(a.re)
                    subSchema[qaId].custom = checkVolume
                  }
                  if (a.type === 'address') {
                    subSchema[qaId].uniforms.margin = 'normal'
                    subSchema[qaId].uniforms.component = GooglePlaces
                    subSchema[qaId].uniforms.autocompleteBugFix = true
                  }
                  if (a.type === 'date') {
                    subSchema[qaId].type = Date
                    subSchema[qaId].uniforms.margin = 'normal'
                    subSchema[qaId].uniforms.component = DatePicker
                  }
                  if (a.type === 'long') {
                    // subSchema[qaId].uniforms.margin = 'normal'
                    subSchema[qaId].uniforms.component = LongField
                  }
                  if (a.type === 'number') {
                    subSchema[qaId].uniforms.component = NumField
                    if (a.min) subSchema[qaId].uniforms.min = a.min
                    if (a.max) subSchema[qaId].uniforms.max = a.max
                  }
                  if (a.type === 'id') {
                    subSchema[qaId].uniforms.component = IdField
                  }

                  if (a.type === 'email') subSchema[qaId].regEx = RegEx.EmailWithTLD
                  if (a.type === 'calculated') {
                    subSchema[qaId].required = true
                    subSchema[qaId].uniforms.expression = a.expression
                  }
                })
                step.schema[`${q.id}.$`] = new SimpleSchema(subSchema)
                break
              case 'id':
                delete step.schema[q.id]
                answers.forEach((a, ix) => {
                  const qaId = getQAId(q.id, answers, ix)
                  const uniforms = {
                    required: false, // Can't make a id field required
                  }

                  step.schema[qaId] = {
                    type: String,
                    label: a.name,
                    required: false,
                    uniforms,
                  }
                })
                break
              case 'hidden':
                delete step.schema[q.id]
                answers.forEach((a, ix) => {
                  const qaId = getQAId(q.id, answers, ix)
                  const uniforms = {
                    required: false, // Can't make a hidden field required
                  }

                  step.schema[qaId] = {
                    type: String,
                    label: a.name,
                    required: false,
                    uniforms,
                  }
                })
                break
              case 'text':
                delete step.schema[q.id]
                answers.forEach((a, ix) => {
                  const qaId = getQAId(q.id, answers, ix) //`${q.id}__${a.id}`

                  const uniforms = {
                    helperText: a.note,
                    placeholder: a.placeholder,
                  }
                  let required = q.optional !== undefined ? !q.optional : !a.optional
                  required = getRequiredFunc(q, uniforms, required)
                  uniforms.required = required

                  // const regEx = new RegExp(a.regEx)

                  step.schema[qaId] = {
                    type: String,
                    label: a.name,
                    required,
                    uniforms,
                    regEx: new RegExp(a.regEx),
                  }

                  if (a.confirmPassword) {
                    step.schema[`${qaId}_2`] = {
                      type: String,
                      label: 'Confirm Password',
                      required,
                      uniforms,
                    }
                  }
                  if (a.type === 'long') {
                    step.schema[qaId].uniforms = {
                      ...uniforms,
                      component: LongTextField,
                      minRows: '3',
                      variant: 'outlined',
                    }
                  }
                  if (a.type === 'number') {
                    step.schema[qaId].uniforms = {
                      ...uniforms,
                      component: NumField,
                    }
                    if (a.min) step.schema[qaId].uniforms.min = a.min
                    if (a.max) step.schema[qaId].uniforms.max = a.max
                  }

                  if (a.re) {
                    step.schema[qaId].regEx = new RegExp(a.re)
                    // TODO: Work out how to have multiple custom validators
                    step.schema[qaId].custom = checkVolume
                  }
                  if (a.type === 'address') {
                    // step.schema[qaId].uniforms.margin = 'normal'
                    step.schema[qaId].uniforms.component = GooglePlaces
                    step.schema[qaId].uniforms.autocompleteBugFix = true
                    step.schema[qaId].uniforms.required = required
                  }
                  if (['json', 'object'].includes(a.type)) {
                    // step.schema[qaId].uniforms.margin = 'normal'
                    step.schema[qaId].uniforms.component = JSONField
                    step.schema[qaId].uniforms.required = required
                  }
                  if (a.type === 'date') {
                    step.schema[qaId].uniforms = {
                      ...uniforms,
                      component: DatePicker,
                    }
                  }

                  // if (a.type === 'phoneNumber') {
                  //   step.schema[qaId].uniforms.margin = 'normal'
                  //   step.schema[qaId].uniforms.component = PhoneField
                  // }

                  if (a.type === 'password') {
                    // step.schema[qaId].uniforms.type = 'password'
                    step.schema[qaId].uniforms.component = PasswordField
                    // step.schema[qaId].uniforms.required = required
                    if (a.confirmPassword) {
                      // step.schema[`${qaId}_2`].uniforms.type = 'password'
                      step.schema[`${qaId}_2`].uniforms.component = PasswordField
                      step.schema[`${qaId}_2`].custom = function () {
                        if (this.value !== this.siblingField(qaId).value) {
                          return 'password mismatch'
                        }
                      }
                    }
                  }

                  if (a.type === 'email')
                    step.schema[qaId].regEx = a.regEx
                      ? new RegExp(a.regEx)
                      : RegEx.EmailWithTLD
                  step.schema[qaId].uniforms.variant = 'outlined'

                  if (a.type === 'calculated') {
                    step.schema[qaId].required = true
                    step.schema[qaId].uniforms.expression = a.expression
                  }
                  if (a.type === 'id') {
                    debug(`type=id ${qaId}`)
                    step.schema[qaId].required = false
                    step.schema[qaId].uniforms = {
                      ...uniforms,
                      component: IdField,
                    }
                  }
                })
                break
              case 'multiple':
                delete step.schema[q.id]
                if (answers.length <= 10 || q.expand) {
                  answers.forEach((a, ix) => {
                    const qaId = getQAId(q.id, answers, ix)
                    const uniforms = {}
                    const required = getRequiredFunc(q, uniforms, !q.optional)
                    step.schema[qaId] = {
                      type: Boolean,
                      label: a.name,
                      required, // Need a way to count these and set a minimum #required
                      uniforms,
                    }
                  })
                  answers
                    .filter((a) => a.specify)
                    .map((a) => {
                      const specifyId = `${q.id}__${a.id}__specify`
                      const uniforms = {}
                      step.schema[specifyId] = {
                        type: String,
                        label: a.specify,
                        uniforms,
                      }
                      return specifyId
                    })
                } else {
                  step.schema[q.id] = {
                    type: Array,
                    label: q.name,
                    // optional, // Need a way to count these and set a minimum #required
                    uniforms: {
                      component: TagsField,
                    },
                  }
                  step.schema[`${q.id}.$`] = {
                    type: String,
                  }
                }
                break
              case 'single':
                qSchema.uniforms.checkboxes = 'true'
                qSchema.uniforms.component = RadioImageField
                qSchema.uniforms.options = answers.map((a) => {
                  return { label: a.name, value: a.value || a.id, image: a.image }
                })
                qSchema.label = q.prompt
                qSchema.required = getRequiredFunc(q, qSchema.uniforms, !q.optional)
                // qSchema.uniforms.required = required
                // debug(`${q.id} required`, qSchema.required)

                answers
                  .filter((a) => a.specify)
                  .map((a) => {
                    const specifyId = `${q.id}__${a.id}__specify`
                    const uniforms = {}
                    const required = getRequiredFunc(q, uniforms, a.specifyRequired)
                    step.schema[specifyId] = {
                      type: String,
                      label: a.specify,
                      required,
                      uniforms,
                    }
                    return specifyId
                  })
                break
              case 'rating':
                qSchema.uniforms.component = RatingField
                qSchema.required = getRequiredFunc(q, qSchema.uniforms, !q.optional)

                answers
                  .filter((a) => a.specify)
                  .map((a) => {
                    const specifyId = `${q.id}__${a.id}__specify`
                    const uniforms = {}
                    const required = getRequiredFunc(q, uniforms, a.specifyRequired)
                    step.schema[specifyId] = {
                      type: String,
                      label: a.specify,
                      required,
                      uniforms,
                    }
                    return specifyId
                  })
                break

              case 'grid':
                qSchema.uniforms.component = GridField
                qSchema.required = getRequiredFunc(q, qSchema.uniforms, !q.optional)

                answers
                  .filter((a) => a.specify)
                  .map((a) => {
                    const specifyId = `${q.id}__${a.id}__specify`
                    const uniforms = {}
                    const required = getRequiredFunc(q, uniforms, a.specifyRequired)
                    step.schema[specifyId] = {
                      type: String,
                      label: a.specify,
                      required,
                      uniforms,
                    }
                    return specifyId
                  })
                break

              case 'calculation':
                const getExpId = (target, targetValue) => {
                  if (target === 'integer') return Number(targetValue)
                  let expId
                  step.questions.forEach((q) => {
                    if (q[target] === targetValue) {
                      return (expId = q.id)
                    }

                    q.answers.forEach((a) => {
                      if (a[target] === targetValue) {
                        return (expId = `${q.id}__${a.id}`)
                      }
                    })
                  })

                  return expId
                }
                const a = q.answers[0]
                const { target1, targetValue1, target2, operator, targetValue2 } =
                  a.expression
                const expId1 = getExpId(target1, targetValue1)
                const expId2 = getExpId(target2, targetValue2)
                qSchema.uniforms.expression = [expId1, operator, expId2]

                break

              // case 'multiple':
              //   qSchema.uniforms.checkboxes = "true"
              //   qSchema.uniforms.options = answers.map((a) => {
              //     return { label: a.name, value: a.value || a.id }
              //   })
              //   qSchema.optional = getOptionalFunc(q, qSchema.uniforms, q.optional)

              //   answers
              //     .filter((a) => a.specify)
              //     .map((a) => {
              //       const specifyId = `${q.id}__${a.id}__specify`
              //       const uniforms = {}
              //       const optional = getOptionalFunc(q, uniforms, !a.specifyRequired)
              //       step.schema[specifyId] = {
              //         type: Boolean,
              //         label: a.specify,
              //         optional,
              //         uniforms,
              //       }
              //       return specifyId
              //     })

              //   break

              case 'upload':
                if (0) {
                  delete step.schema[q.id]
                  answers.forEach((a, ix) => {
                    const qaId = getQAId(q.id, answers, ix)
                    const uniforms = {}
                    const required = getRequiredFunc(q, uniforms, !q.optional)
                    step.schema[qaId] = {
                      type: Object,
                      label: a.name,
                      required, // Need a way to count these and set a minimum #required
                      uniforms,
                    }
                  })
                } else {
                  // qSchema.uniforms.value = answers.map((a) => a.val)
                  qSchema.uniforms.component = UploadField
                  qSchema.required = getRequiredFunc(q, qSchema.uniforms, !q.optional)
                  qSchema.label = q.prompt
                  qSchema.type = Array
                  const subSchema = {
                    path: String,
                    lastModified: SimpleSchema.Integer,
                    name: String,
                    size: SimpleSchema.Integer,
                    type: String,
                    url: OptionalString,
                  }
                  step.schema[`${q.id}.$`] = new SimpleSchema(subSchema)
                  // debug({ qSchema, '.$': subSchema })
                }
                break
              // I don't know if we'll ever need this, just 'multi' instead
              // case 'boolean':
              //   qSchema.type = Boolean
              //   qSchema.uniforms.options = Array.isArray(answers) &&answers.map((a) => {
              //     return { label: a.name, value: a.value }
              //   })
              //   break
              case 'address':
                // delete step.schema[q.id]
                // debug(`Rendering address field ${q.id}`)
                qSchema.uniforms.margin = 'normal'
                qSchema.uniforms.component = GooglePlaces
                // qSchema.uniforms.component = true
                break
              case 'id':
                // delete step.schema[q.id]
                // debug(`Rendering address field ${q.id}`)
                qSchema.uniforms.component = HiddenField
                break
              case 'paragraph':
                delete step.schema[q.id]
                break
              case 'signature':
                qSchema.required = getRequiredFunc(q, qSchema.uniforms, !q.optional)
                // TODO: declare a varible for the signature image? Or should it use slingshot
                // directly like (I think) the upload field does?
                // delete step.schema[q.id]
                break
              case 'geolocation':
                // Nothing to do, just accept it as is
                break
              case 'lookup':
                qSchema.uniforms.margin = 'normal'
                qSchema.uniforms.component = LookupField
                break
              case 'dropdown':
                qSchema.required = getRequiredFunc(q, qSchema.uniforms, !q.optional)
                qSchema.label = ''
                // qSchema.uniforms.textFieldProps = { helperText: 'this is a helper' }
                // Nothing to do, just accept it as is ??
                break
              case 'date':
                delete step.schema[q.id]
                answers.forEach((a, ix) => {
                  const qaId = getQAId(q.id, answers, ix)
                  step.schema[qaId] = {
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
                q.prompt = `Unknown question type (${q.type}) for "${q.prompt}"`
                console.log(`Unsupported question type: [${q.type}]`)
                // Setting type to paragraph stops it trying to render a question
                q.type = 'paragraph'
            }
          })
        }
        // debug('schema', step.schema)
        const schema = new SimpleSchema(step.schema, {
          getErrorMessage(error, label) {
            debug({ error, label })
            if (error.type === 'minActivities')
              return `You should complete at least 3 activities`
            // Returning undefined will fall back to using defaults
          },
        })
        step.bridge = bridges[survey.slug]
          ? new bridges[survey.slug]({ schema })
          : new CustomBridge({ schema })

        return step
      })
  )
}

export default getSchemas
