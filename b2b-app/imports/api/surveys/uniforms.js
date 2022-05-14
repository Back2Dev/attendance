const debug = require('debug')('app:survey')

const mv = (obj, from, to) => {
  if (obj[from] && !obj[to]) {
    obj[to] = obj[from]
    delete obj[from]
  }
}

export default map2Uniforms = (survey) => {
  if (survey.steps) return survey
  // Rename sections => steps
  // debugger
  const newSurvey = Object.assign({}, survey, { ['steps']: survey['sections'] })
  delete newSurvey.sections
  newSurvey.steps.forEach((step) => {
    mv(step, 'title', 'name')
    step.questions.forEach((q) => {
      // mv(q, 'type', 'qtype')
      mv(q, 'title', 'prompt')
      q.answers.forEach((a) => {
        mv(a, 'title', 'name')
      })
    })
  })
  debug(newSurvey)
  return newSurvey
  // debug(survey)
  // return survey
}
