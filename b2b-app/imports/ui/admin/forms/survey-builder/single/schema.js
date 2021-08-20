import SimpleSchema from 'simpl-schema'

const schema = new SimpleSchema({
  question: Object,
  'question.label': String,
  'question.+type': String,
  'question.+id': String,
  answers: Array,
  'answers.$': Object,
  'answers.$.label': String,
  'answers.$.+val': {
    type: String,
    optional: true,
    custom() {
      if (this.isSet) {
        for (let i = 0; i < this.field('answers').value.length; i++) {
          if (!this.field(`answers.${i}.+val`).isSet) {
            return 'all answers must have +val'
          }
        }
      }
    },
  },
})

export default schema
