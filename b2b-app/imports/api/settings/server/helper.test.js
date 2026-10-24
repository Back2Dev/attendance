import { Random } from 'meteor/random'

import { use, expect } from 'chai'
import assertArrays from 'chai-arrays'

import {
  rmSettings,
  updateSettings,
  insertSettings,
  getSetting,
  getSettings,
  getCfg,
  getCfgs,
} from './helper'
import Settings from '../schema'

use(assertArrays)

const debug = require('debug')('app:settings:helper:test')

const goodSettings = [
  {
    name: 'some name',
    key: Random.id(),
    value: 'some test value',
  },
  {
    name: 'readonly settings',
    key: Random.id(),
    value: 'other test value',
    readonly: true,
  },
  {
    name: 'public test',
    key: Random.id(),
    value: 'public test value',
    public: true,
  },
  {
    name: 'private test',
    key: Random.id(),
    value: 'private test value',
    public: false,
  },
  {
    name: 'Not readonly',
    key: Random.id(),
    value: 'A test value',
    readonly: false,
  },
]

const badSettings = [
  {
    value: 'key is missing',
  },
  {
    key: 'value is missing',
  },
  {
    key: 'invalid public value',
    value: 'some value',
    public: 'some string',
  },
]

const goodSettingKeys = goodSettings.map((item) => item.key)

describe('Settings helper functions', () => {
  describe('Test inserting settings', () => {
    it('insertSettings should work with good settings', async () => {
      for (const setting of goodSettings) {
        let result
        result = await insertSettings(setting)
        expect(result).to.be.a('object')
        expect(result.status).equal('success')
        expect(result.id).to.be.a('string')
      }
    })
    it('insertSettings should not work with bad settings', async () => {
      for (const setting of badSettings) {
        let result
        result = await insertSettings(setting)
        expect(result).to.be.a('object')
        expect(result.status).equal('failed')
      }
    })
  })

  describe('Reading setting items', () => {
    it('getSetting should work', async () => {
      let result
      result = await getSetting({ key: goodSettings[0].key })
      expect(result).to.be.a('object')
    })
    it('getSetting should work with default value', async () => {
      let result
      const defaultValue = 'default value'
      result = await getSetting({
        key: 'some key which does not exist',
        defaultValue,
      })
      expect(result).to.be.a('object')
      expect(result.value).equal(defaultValue)
    })
    it('getSettings should work', async () => {
      let result
      result = await getSettings({ keys: goodSettingKeys })
      // debug('getSettings', result)
      expect(result).to.be.a('object')
      expect(result.hasOwnProperty(goodSettingKeys[0])).equal(true)
    })
  })
  describe('Reading setting values', () => {
    it('getCfg should work', async () => {
      let result
      result = await getCfg(goodSettings[0].key)
      expect(result).equal(goodSettings[0].value)
    })
    it('getCfg should work with default value', async () => {
      let result
      const defaultValue = 'default value'
      result = await getCfg('some key which does not exist', defaultValue)
      expect(result).equal(defaultValue)
    })

    it('getCfgs should work', async () => {
      let result
      result = await getCfgs(goodSettingKeys)
      expect(result).to.be.a('object')
      expect(result.hasOwnProperty(goodSettingKeys[0])).equal(true)
      expect(result[goodSettingKeys[0]]).equal(goodSettings[0].value)
    })
  })

  // find a readonly setting
  describe('Updating settings', () => {
    it('updateSettings should NOT works with invalid id', async () => {
      let result
      result = await updateSettings({ _id: 'not_exist_id', value: 'updated value' })
      // debug('updateSettings', result)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
      expect(result.updated).equal(0)
    })
    let readonlySetting
    before(async () => {
      readonlySetting = await Settings.findOneAsync({ readonly: true })
    })
    it('updateSettings should NOT works with readonly setting', async () => {
      let result
      result = await updateSettings({ _id: readonlySetting._id, value: 'updated value' })
      // debug('updateSettings', result)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
      expect(result.updated).equal(0)
    })
    it('updateSettings should works with readonly setting and incReadonly enable', async () => {
      let result
      result = await updateSettings(
        { _id: readonlySetting._id, value: 'updated value' },
        true
      )
      // debug('updateSettings', result)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
      expect(result.updated).equal(1)
    })
  })
  describe('Removing settings', () => {
    // remove the first inserted good setting item
    it('rmSettings should work', async () => {
      await Promise.all(goodSettings.map((setting) => insertSettings(setting)))
      // find a setting which is not readonly
      const tobeDeleted = await Settings.findOneAsync({ readonly: false })

      expect(tobeDeleted).to.be.a('object')
      let result
      result = await rmSettings(tobeDeleted._id)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
      expect(result.removed).equal(1)
    })

    it('rmSettings should NOT be able to delete a readonly setting', async () => {
      await Promise.all(goodSettings.map((setting) => insertSettings(setting)))
      let result
      const readonlySetting = await Settings.findOneAsync({ readonly: true })
      result = await rmSettings(readonlySetting._id)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
      expect(result.removed).equal(0)
    })

    it('rmSettings should works with readonly one and incReadonly enable', async () => {
      await Promise.all(goodSettings.map((setting) => insertSettings(setting)))
      let result
      const readonlySetting = await Settings.findOneAsync({ readonly: true })
      result = await rmSettings(readonlySetting._id, true)
      expect(result).to.be.a('object')
      expect(result.status).equal('success')
      expect(result.removed).equal(1)
    })
  })
})
