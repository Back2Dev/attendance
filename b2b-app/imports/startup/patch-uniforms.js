import { SimpleSchema2Bridge } from 'uniforms-bridge-simple-schema-2'

// Guard against missing validator() on schemas to prevent runtime crashes.
const originalGetValidator = SimpleSchema2Bridge.prototype.getValidator
SimpleSchema2Bridge.prototype.getValidator = function (options = { clean: true, mutate: true }) {
  if (this.schema && typeof this.schema.validator === 'function') {
    return originalGetValidator.call(this, options)
  }
  // Fallback no-op validator to keep forms rendering
  return () => null
}
