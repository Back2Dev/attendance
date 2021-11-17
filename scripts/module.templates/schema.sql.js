import SimpleSchema from 'simpl-schema'
import SQLTable from '/imports/api/utils/orm'
const debug = require('debug')('app:schema')

class MyCollection extends SQLTable {
  constructor(name) {
    super(name)
  }
}

export default new MyCollection('my_collection')

export const MyCollectionSQLSchema = new SimpleSchema({
  TEMPLATED_COLUMNS,
})
