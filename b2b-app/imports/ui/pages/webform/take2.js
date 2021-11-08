import React from 'react'

// export default Demo = () => <div>Demo</div>

// Import UI Generator
import {
  UIGenerator, // main component
  isInvalid, // for validity checking
  createEmptyStore,
  createStore, // for initial data-store creation
  createMap,
  createOrderedMap, // for deep immutables
  storeUpdater, // for on change handling
} from '@ui-schema/ui-schema'
import { Step, Stepper, widgets } from '@ui-schema/ds-material'

// individual components, e.g. use one `UIMetaProvider` for many `UIStoreProvider` instead of `UIGenerator`
import { UIStoreProvider } from '@ui-schema/ui-schema/UIStore'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
// instead of `UIGenerator` use `UIRootRenderer` and pass down the schema
import { UIRootRenderer } from '@ui-schema/ui-schema/UIRootRenderer'

// Simple translator for in-schema translation, keyword `t`
import { relTranslator } from '@ui-schema/ui-schema/Translate/relT'

const customWidgets = { ...widgets }
customWidgets.custom = {
  ...widgets.custom,
  Stepper,
  Step,
}

// Minimal Schema, transformed from JS-Object into deep immutable
const sampleSchema2 = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
    },
    comment: {
      type: 'string',
      widget: 'Text',
      view: {
        rows: 3,
      },
    },
    accept_privacy: {
      type: 'boolean',
    },
  },
  required: ['accept_privacy'],
}
const sampleSchema = {
  type: 'object',
  title: 'headline',
  properties: {
    stepper: {
      type: 'object',
      widget: 'Stepper',
      properties: {
        'step-1': {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 3,
              view: {
                sizeMd: 6,
              },
            },
            surname: {
              type: 'string',
              view: {
                sizeMd: 6,
              },
            },
            qty: {
              type: 'number',
              minimum: 2,
              maximum: 15,
              view: {
                sizeMd: 3,
              },
            },
          },
          required: ['surname'],
        },
        'step-2': {
          type: 'object',
          widget: 'Step',
          properties: {
            topics: {
              type: 'array',
              widget: 'SelectMulti',
              view: {
                sizeMd: 3,
              },
              enum: ['theater', 'crime', 'sci-fi', 'horror'],
            },
          },
        },
        'step-3': {
          type: 'object',
          widget: 'Step',
          properties: {
            accepted: {
              type: 'boolean',
            },
          },
        },
      },
    },
    required: [],
  },
}

const values = {}

export default Generator = ({ schema = sampleSchema }) => {
  // Create a state with the data, transforming into immutable on first mount
  const [store, setStore] = React.useState(() => createStore(createOrderedMap(values)))
  const [schemaMap, setSchemaMap] = React.useState(() => createOrderedMap(schema))

  // or create empty store, based on the schema type:
  // const [store, setStore] = React.useState(() => createEmptyStore(schema.get('type'));

  const onChange = React.useCallback(
    (storeKeys, scopes, updater, deleteOnEmpty, type) => {
      setStore(storeUpdater(storeKeys, scopes, updater, deleteOnEmpty, type))
    },
    [setStore]
  )

  return (
    <UIGenerator
      schema={schemaMap}
      store={store}
      onChange={onChange}
      showValidity={true}
      widgets={customWidgets}
      t={relTranslator}
    />
  )
}
