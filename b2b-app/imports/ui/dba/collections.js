import forms from '/imports/api/forms/schema'
import registrations from '/imports/api/registrations/schema'
import messageTemplates from '/imports/api/message-templates/schema'

const collections = { forms, registrations, messageTemplates }

export default getCollection = (name) => {
  if (!collections[name]) {
    console.error(`Could not find collection ${name}`)
  } else return collections[name]
}
