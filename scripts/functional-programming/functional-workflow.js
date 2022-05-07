const { objectExpression } = require('@babel/types')
const buy = require('./wf-vic-buy.js')
console.clear()
console.log('Starting functional program demo...\n')

// console.log(buy)

// console.log(
//   buy.stages
//     .map((stage) => {
//       return {
//         stage: stage.name,
//         steps: stage.steps
//           .filter((step) => step.type === 'webform')
//           .map((step) => step.name),
//       }
//     })
//     .filter((stage) => stage.steps.length)
// )

// Build a lookup table
console.log(
  buy.stages[0].steps.reduce((acc, step) => {
    acc[step.slug] = { name: step.name, type: step.type }
    return acc
  }, {})
)
