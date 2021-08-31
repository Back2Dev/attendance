const fs = require('fs')
const opts = require('minimist')(process.argv.slice(2))
const folder =
  opts.folder ||
  '/Users/mikkel/easy/settler/se2-admin/packages/fixtures/json/surveys.json'
const output = `./surveys.txt`

if (opts.help) {
  console.log(`
#Usage:
	node scripts/extract-survey-text.j s
Where
  --folder=se2-admin - folder to write files (defaults to se2-admin)

#Prerequisites

#Processing: 
	This command will do the following

  `)
  process.exit(0)
}

let level = 0
const levels = [
  // { letter: 'SURVEY', descend: 'xxx' },
  { letter: '# Survey\nH', descend: 'steps', name: 'name' },
  { letter: '\n# Section\nS', descend: 'questions', name: 'name' },
  { letter: '\nQ', descend: 'answers', name: 'prompt' },
  { letter: 'A', descend: '', name: 'name' },
]
const recurse = (arr, omit) => {
  const { descend, letter, name } = levels[level] || {}
  const stack = [`${letter} ${arr[name] || arr.id}`]
  return stack.concat(
    Object.keys(arr)
      .filter((key) => key !== name)
      .map((key) => {
        if (key === descend) {
          level++
          console.log(`dive ${key} ${level} ${arr[name]}`)
          const result = Array.isArray(arr[key])
            ? arr[key].map((sub) => recurse(sub, key))
            : ''
          level--
          return result
        } else {
          if (typeof arr[key] === 'object')
            return Array.isArray(arr[key])
              ? `  +${key}="${arr[key].join('" , "')}"`
              : `\n# Object\n  +${key}=${JSON.stringify(arr[key])}`
          else return `  +${key}=${arr[key]}`
        }
      })
  )
}

const surveys = require(folder)
const text = surveys.map((survey) => {
  const stext = recurse(survey)
  fs.writeFileSync(`./${survey.slug}.txt`, stext.flat(99).join('\n'))
  return stext
})
fs.writeFileSync('scripts/x.js', JSON.stringify(text, null, 2))
fs.writeFileSync(output, text.flat(99).join('\n'))
