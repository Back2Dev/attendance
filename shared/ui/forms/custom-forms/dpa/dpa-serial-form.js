import React from 'react'
import SimpleSchema from 'simpl-schema'
import axios from 'axios'
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2'
import { AutoForm, AutoField, HiddenField, TextField } from 'uniforms-mui'
import Box from '@mui/material/Box'
import ProductCard from './victron-product'

import dbg from 'debug'
import { Typography } from '@mui/material'
const debug = dbg('app:dpa-serial-form')

const fields = 'brand serial'.split(' ')
let timer

const schema = new SimpleSchema({
  serial: String,
  brand: String,
})
const bridge = new SimpleSchema2Bridge({ schema })
/**
 *
 * Custom form - will become great!
 *
 */
export const form = ({
  formData = { device: { brand: 'Victron', serial: 'HQ2128FDAXT' } },
  onChangeCustom = () => console.error('onChangeCustom prop missing'),
}) => {
  const [model, setModel] = React.useState(formData?.device)
  const [status, setStatus] = React.useState('')
  const [product, setProduct] = React.useState(null)

  // Timer for Victron serial lookup
  React.useEffect(() => {
    // Don't create a timer yet, this is the cleanup code
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [])

  const victronLookup = async () => {
    debug('Victron lookup')
    setStatus(`Requesting product info for ${model.serial}`)
    setProduct(null)
    try {
      const ret = false
        ? await axios.get(
            `https://cms.victronenergy.com/api/v1/product-from-serial/${model.serial}/?format=json`
          )
        : await Meteor.callAsync('api.proxy', {
            url: `https://cms.victronenergy.com/api/v1/product-from-serial/${model.serial}/`,
            method: 'get',
          })
      debug(ret)
      setStatus(ret.data.message)
      setProduct(ret.data)
    } catch (e) {
      console.error(e)
      setStatus(e.message)
    }
  }

  const onChangeModel = (model) => {
    debug({ model })
    onChangeCustom(model)
  }

  const onChange = (key, value) => {
    debug({ key, value })
    const doit = key === 'serial' // && model?.brand.match(/victron/i)
    if (doit) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
        victronLookup()
        timer = null
      }, 4000) // 7s isn't that long

      // debug({ [key]: value })
    }
  }

  const save = (model) => {
    debug({ model })
  }

  return (
    <Box>
      <AutoForm
        onChange={onChange}
        onChangeModel={onChangeModel}
        schema={bridge}
        model={model}
        onSubmit={save}
      >
        <AutoField id="brand" name="brand" defaultValue="" label={'Brand'} />
        <AutoField id="serial" name="serial" defaultValue="" label={'Serial No'} />
      </AutoForm>
      {product && <ProductCard {...product} />}
      <Typography variant="body2">{status}</Typography>
    </Box>
  )
}

// Default export not really necessary
export default { form }
