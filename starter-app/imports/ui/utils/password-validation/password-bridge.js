import { Bridge } from 'uniforms'

export default class UserLoginSchemaBridge extends Bridge {
  constructor(schema, validator) {
    super()

    this.schema = schema
    this.validator = validator
  }

  getError(name, error) {
    return error && error[name]
  }

  getErrorMessage(name, error) {
    return (error && error[name]) || ''
  }

  getErrorMessages(error) {
    return error ? Object.keys(this.schema).map((field) => error[field]) : []
  }

  getField(name) {
    return this.schema[name.replace(/\.\d+/g, '.$')]
  }

  getType(name) {
    return this.schema[name.replace(/\.\d+/g, '.$')].type
  }

  getProps(name) {
    return this.schema[name.replace(/\.\d+/g, '.$')]
  }

  getInitialValue(name) {
    return this.schema[name.replace(/\.\d+/g, '.$')].initialValue
  }

  getSubfields(name) {
    return name
      ? this.schema[name.replace(/\.\d+/g, '.$')].subfields || []
      : Object.keys(this.schema).filter((field) => field.indexOf('.') === -1)
  }

  getValidator() {
    return this.validator
  }
}
