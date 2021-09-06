const debug = require('debug')('app:survey')

const mv = (obj, from, to) => {
  if (obj[from] && !obj[to]) {
    obj[to] = obj[from]
    delete obj[from]
  }
}

export default map2UiSchema = (survey) => {
  if (survey.steps) return survey
  // sections => nested
  // Create a stepper container as a starting point
  const newSurvey = {
    type: 'object',
    title: 'Heading',
    properties: {
      stepper: {
        type: 'object',
        widget: 'Stepper',
        properties: {},
      },
    },
  }
  // "step-1": {
  //   "type": "object",
  //   "properties": {
  //     "name": {
  //       "type": "string",
  //       "minLength": 2,
  //       "maxLength": 3,
  //       "view": {
  //         "sizeMd": 6
  //       }
  //     },
  //     "surname": {
  //       "type": "string",
  //       "view": {
  //         "sizeMd": 6
  //       }
  //     }
  //   },
  //   "required": [
  //     "surname"
  //   ]
  // },

  const stepper = newSurvey.properties.stepper.properties
  survey.sections.forEach((section, ix) => {
    const step = { type: 'object', properties: {}, required: [] }
    stepper[`step-${ix + 1}`] = step
    section.questions.forEach((q) => {
      step[q.id] = { type: 'string' }
      if (!q.optional) step.required.push(q.id)
    })
  })
  debug(newSurvey)
  return newSurvey
}

// // Rename sections => steps
//   // debugger
//   const newSurvey = Object.assign({}, survey, { ['steps']: survey['sections'] })
//   delete newSurvey.sections
//   newSurvey.steps.forEach((step) => {
//     mv(step, 'title', 'name')
//     step.questions.forEach((q) => {
//       mv(q, 'type', 'qtype')
//       mv(q, 'title', 'prompt')
//       q.answers.forEach((a) => {
//         mv(a, 'title', 'name')
//       })
//     })
//   })
//   debug(newSurvey)
//   return newSurvey
//   // debug(survey)
//   // return survey
// }
