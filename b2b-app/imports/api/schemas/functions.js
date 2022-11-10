import SimpleSchema from 'simpl-schema'

const ALLOWED_TYPES = {
  string: String,
  boolean: Boolean,
  integer: SimpleSchema.Integer,
  array: Array,
  object: Object,
  date: Date,
}
/**
 * @param {SchemaData[]} schemasList
 * @return {{
 * compiledSchemas: Object.<string, SimpleSchema>,
 * compileData: Object.<string, {schema: SchemaData, children: string[]}>
 * }}
 */
function compileSchemas(schemasList) {
  /**
   * @type {Object.<string, {schema: SchemaData, children: string[]}>}
   */
  const compileData = {}

  /**
   * @type {{
      schema: SchemaData;
      children: any[];
    }[]}
   */
  const compileFrontier = []

  schemasList.forEach((schema) => {
    // Compile all data types
    if (schema.fields)
      schema.fields.forEach((field) => {
        if (ALLOWED_TYPES[field.type]) field.type = ALLOWED_TYPES[field.type]
      })

    compileData[schema.slug] = {
      schema,
      children: [],
    }
  })

  schemasList.forEach((schema) => {
    if (schema.extends) {
      compileData[schema.extends].children.push(schema.slug)
    } else {
      compileFrontier.push(compileData[schema.slug])
    }
  })

  /**
   * @type {Object.<string, SimpleSchema>}
   */
  const compiledSchemas = {}
  let schemaData
  while ((schemaData = compileFrontier.pop())) {
    let schema = schemaData.schema
    let compiledSchema = new SimpleSchema(schemaData.schema)

    if (schema.extends)
      compiledSchema = compiledSchema.extend(compiledSchemas[schema.extends])

    // Factory.define(`schema.${schema.slug}`, Schemas, compiledSchema)
    compiledSchemas[schema.slug] = compiledSchema
    schemaData.children.forEach((child) => {
      compileFrontier.push(compileData[child])
    })
  }
  return { compiledSchemas, compileData }
}

export { compileSchemas }
