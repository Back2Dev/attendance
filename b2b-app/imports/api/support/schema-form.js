import SimpleSchema from 'simpl-schema'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
// import { connectField } from 'uniforms'
import { LongTextField } from 'uniforms-material'

export const SupportFormSchema = new SimpleSchema({
  subject: {
    type: String,
    uniforms: {
      label: 'Subject',
      margin: 'normal',
    },
  },
  message: {
    type: String,
    uniforms: {
      label: 'Tell us what happened?',
      margin: 'normal',
      component: LongTextField,
    },
  },
})

export const bridge = new SimpleSchema2Bridge(SupportFormSchema)
