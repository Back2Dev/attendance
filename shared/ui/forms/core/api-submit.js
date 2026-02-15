import { Meteor } from 'meteor/meteor'
import React from 'react'
import axios from 'axios'
import { DateTime } from 'luxon'
import { showInfo, showSuccess, showError } from '/imports/ui/utils/toast-alerts'
import { accessByPath, setByPath } from '/imports/ui/forms/utils/util'
import { textMerge } from '/imports/api/util'
import headerFns, { bodyFns, guidReplacer } from '/imports/api/dw/header-fns'
import dbg from 'debug'
const debug = dbg('app:api-submit')

//collect url
const getUploadValues = (data) => {
  const urls = []

  const traverse = (obj) => {
    if (typeof obj !== 'object' || obj === null) return

    if (Array.isArray(obj)) {
      obj.forEach(traverse)
    } else {
      Object.values(obj).forEach((value) => {
        if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value.upload)) {
            value.upload.forEach((item) => {
              if (item.url)
                urls.push(
                  `${Meteor.settings.public.S3_PUBLIC_URL}${item.url}`
                )
            })
          }
          traverse(value)
        }
      })
    }
  }

  traverse(data)
  return urls
}

const apiSubmit = async (survey, formData, logit) => {
  try {
    debug({ formData })
    let url

    const { submit } = survey
    const body = submit.body || {} // Provide a container for the data
    // Mapping of fields and (optionally) values...
    const values = {}
    if (submit.fieldMaps) {
      populateValues(submit, values, submit.fieldMaps, formData)
    }
    // Assemble the arguments (if we are doing a GET)
    const args = Object.keys(values)
      .map((key) => `${key}=${values[key]}`)
      .join('&')
    // Do we need to poke the data into a place in the body object?
    // Copy in the values
    const bodyRef = submit.keyValuePath ? accessByPath(body, submit.keyValuePath) : body
    Object.keys(values).forEach((key) => {
      bodyRef[key] = values[key]
    })

    // Do we need to process some additional data in a function?
    if (submit.bodyFn?.fn) {
      await bodyFns[submit.bodyFn.fn]({ formData, body: bodyRef })
    } else {
      debug({ body })
    }
    if (submit.headerFn?.fn) {
      headerFns[submit.headerFn.fn](
        survey.submit.headers,
        '', //args,
        survey.submit.privateKey // PRIVATE API KEY
      )
    }
    debug({ headers: survey.submit.headers, body })

    //
    // Ready to make API request
    //
    let ret
    const urls = Array.isArray(survey.submit.url)
      ? survey.submit.url
      : [survey.submit.url]
    for (let theUrl of urls) {
      let url = theUrl
      if (url.match(/^meteor:[\/]*/)) {
        const method = url.replace(/^meteor:[\/]*/, '')
        Meteor.call(method)
      } else {
        if (survey.submit.urlReplacer) {
          const parts = guidReplacer(survey.submit.urlReplacer, theUrl)
          url = parts.url
          body.Guid = parts.guid
        }
        const imageUrls = getUploadValues(formData)

        //use formData instance to send the body
      const formParam  = survey.submit.appendFormParam 
        const form = formParam ? new FormData() : body
      
        if(formParam){
          form.append(formParam, JSON.stringify(body))


          const imagePromises = imageUrls.map(async (imageUrl, index) => {
            try {
              const response = await axios.get(imageUrl, { responseType: 'blob' })
  
              if (!response.data) {
                throw new Error(`No data returned for ${imageUrl}`)
              }
  
              const file = new File([response.data], `image${index}.png`, {
                type: response.data.type,
              })
  
              form.append('files', file)
            } catch (error) {
              console.error(`Error downloading file ${imageUrl}:`, error)
            }
          })
  
          await Promise.all(imagePromises)
        }

        //Todo: get formData passed into the backend
        if (submit.server) {
          //todo: new Form() won't go into the backend
          showInfo('Submitting Proxy API request via server')
          ret = await Meteor.callAsync('api.proxy', {
            url,
            method: 'post',
            body,
            options: {
              headers: survey.submit.headers,
            },
          })
        } else {
          showInfo('Submitting API request')

          ret = await axios.post(url, form, {
            headers: survey.submit.headers,
          })
        }

        const { status, data } = ret
        logit('submit', status, data ? data[0]?.message : '', data)
        if (![200, 201].includes(status)) {
          debug(`Error from API request: ${data[0].message}`)
          showError('Something went wrong, please contact support')
          return { status: 'failed', message: data[0].message }
        }

        if (!data) return showError('Missing data info from response')
        debug({ data })
        let successMsg = textMerge(submit.successMsg || `Request submitted ok`, data)
        showSuccess(successMsg)
        return data
      }
    }
    return ret
  } catch (error) {
    console.error(error)
    showError('Something went wrong, please contact support')
    if (error.response?.data?.errors)
      debug({
        message: `api.proxy`,
        errors: JSON.stringify(error.response.data.errors, null, 2),
      })
    logit('submit', error.response.status, error.message, error.response.data)
    return { status: 'failed', message: error.message }
  }
}

export default apiSubmit

const populateValues = (submit, values, maps, formData, prefix = '') => {
  Object.entries(maps).forEach(([key, pathOrMap]) => {
    if (typeof pathOrMap === 'string') {
      let value = accessByPath(formData, pathOrMap)

      if (value instanceof Date) {
        value = DateTime.fromJSDate(value).toISODate()
      }

      if (value) {
        const fullKey = prefix ? `${prefix}.${key}` : key

        // Optional value remapping
        if (submit.valueMaps && submit.valueMaps[value]) {
          value = submit.valueMaps[value]
        }

        setByPath(values, fullKey, value)
      }
    } else if (typeof pathOrMap === 'object') {
      // Recurse into nested maps
      const nextPrefix = prefix ? `${prefix}.${key}` : key
      populateValues(submit, values, pathOrMap, formData, nextPrefix)
    }
  })
}
