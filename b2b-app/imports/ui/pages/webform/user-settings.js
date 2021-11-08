import React from 'react'
import { Link, Typography } from '@material-ui/core'
import { widgets } from '@ui-schema/ds-material'
import { UIGenerator } from '@ui-schema/ui-schema/UIGenerator'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap'
import { createStore, storeUpdater } from '@ui-schema/ui-schema/UIStore'
import { browserT } from './t'

const schema1 = {
  type: 'object',
  title: 'headline',
  properties: {
    call_count: {
      type: 'number',
      minimum: 2,
      maximum: 10,
      view: {
        sizeMd: 3,
      },
    },
    privacy: {
      type: 'boolean',
      default: true,
      view: {
        sizeMd: 12,
      },
    },
    spam: {
      type: 'boolean',
      view: {
        sizeMd: 12,
      },
    },
    accepted: {
      type: 'boolean',
      view: {
        sizeMd: 12,
      },
    },
    type: {
      type: 'string',
      widget: 'Select',
      default: 'customer',
      view: {
        sizeMd: 3,
      },
      enum: ['customer', 'supplier', 'buyer', 'business', 'partner'],
    },
  },
  required: ['call_count', 'type'],
}

const UserSettings = () => {
  const [store, setStore] = React.useState(() => {
    let data = false
    try {
      data = JSON.parse(window.localStorage.getItem('user_settings'))
    } catch (e) {
      // not existing user_settings
    }
    return createStore(createOrderedMap(typeof data === 'object' ? data : {}))
  })
  const [schema /* setSchema */] = React.useState(createOrderedMap(schema1))

  const onChange = React.useCallback(
    (storeKeys, scopes, action) => {
      setStore((prevStore) => {
        const newStore = storeUpdater(storeKeys, scopes, action)(prevStore)

        // if using a big schema this can be performance problematic!
        // if using strings, throttle the `toJS` operation!
        window.localStorage.setItem(
          'user_settings',
          JSON.stringify(newStore.getValues().toJS())
        )

        return newStore
      })
    },
    [setStore]
  )

  return (
    <React.Fragment>
      <UIGenerator
        schema={schema}
        store={store}
        onChange={onChange}
        widgets={widgets}
        showValidity={true}
        t={browserT}
      >
        {/*
                add children that should be under the schema editor,
                they can use the context of the editor for working
            */}
      </UIGenerator>

      <Typography
        component={'p'}
        variant={'body1'}
        style={{ marginTop: 24, marginBottom: 24 }}
      >
        This form saves the values onChange in the browsers <code>localStorage</code> and
        restores it at component mount, code in{' '}
        <Link
          href={
            'https://github.com/ui-schema/demo-cra/blob/master/src/Schema/UserSettings.js'
          }
        >
          src/Schema/UserSettings.js
        </Link>
      </Typography>
    </React.Fragment>
  )
}

export default UserSettings
