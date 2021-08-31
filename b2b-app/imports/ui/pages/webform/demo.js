import React from 'react'
import { Button, Link, Typography } from '@material-ui/core'
import { Refresh } from '@material-ui/icons'
import {
  UIStoreProvider,
  UIMetaProvider,
  UIRootRenderer,
  isInvalid,
  createOrderedMap,
  createStore,
  storeUpdater,
} from '@ui-schema/ui-schema'
import { Step, Stepper, widgets } from '@ui-schema/ds-material'
import { RichText, RichTextInline } from '@ui-schema/material-richtext'
import { browserT } from './t'

const customWidgets = { ...widgets }
customWidgets.custom = {
  ...widgets.custom,
  RichText: RichText,
  RichTextInline: RichTextInline,
  Stepper: Stepper,
  Step: Step,
}

const schema1 = {
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
    headline: {
      type: 'string',
      view: {
        sizeXs: 6,
        sizeSm: 6,
        sizeMd: 6,
        sizeLg: 6,
        sizeLx: 6,
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
    length: {
      type: 'number',
      multipleOf: 2,
      view: {
        sizeMd: 3,
      },
    },
    text: {
      type: 'string',
      widget: 'Text',
      view: {
        sizeMd: 6,
      },
    },
    usaPhone: {
      type: 'string',
      // only valid for: (888)555-1212 or 555-1212
      pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$',
      view: {
        sizeMd: 3,
      },
    },
    style: {
      type: 'object',
      view: {
        sizeMd: 3,
      },
      properties: {
        center_items: {
          type: 'boolean',
          default: true,
          view: {
            sizeMd: 12,
          },
        },
        center_item_content: {
          type: 'boolean',
          view: {
            sizeMd: 12,
          },
        },
      },
      required: ['center_item_content'],
    },
    rich_text: {
      type: 'string',
      widget: 'RichText',
      view: {
        sizeMd: 12,
      },
    },
    layouts: {
      type: 'array',
      widget: 'OptionsCheck',
      view: {
        sizeMd: 3,
      },
      enum: ['sidebar_left', 'sidebar_right', 'notice', 'content', 'footer'],
      default: ['sidebar_left'],
    },
    sizeDef: {
      type: 'string',
      widget: 'OptionsRadio',
      default: 'middle',
      view: {
        sizeMd: 3,
      },
      enum: ['small', 'middle', 'big'],
    },
    age: {
      type: 'string',
      widget: 'Select',
      //default: "adult",
      view: {
        sizeMd: 3,
      },
      enum: ['child', 'teen', 'adult', '50plus'],
    },
  },
  required: ['layouts', 'size'],
}

const data1 = {
  stepper: { 'step-1': { name: 'Max' } },
  headline: 'Some Demo Content Headline',
}

const Editor = () => {
  const [showValidity, setShowValidity] = React.useState(false)
  const [store, setStore] = React.useState(() => createStore(createOrderedMap(data1)))
  const [schema, setSchema] = React.useState(() => createOrderedMap(schema1))

  React.useEffect(() => {
    // simulating getting `schema` and `data` from an API
    /*setTimeout(() => {
            setStore(createStore(createOrderedMap(data1)));
            setSchema(createOrderedMap(schema1));
        }, 1200);*/
  }, [setStore, setSchema])

  const onChange = React.useCallback(
    (storeKeys, scopes, action) => {
      setStore(storeUpdater(storeKeys, scopes, action))
    },
    [setStore]
  )

  if (!store || !schema)
    return (
      <div style={{ textAlign: 'center', margin: '75px 0' }}>
        <Refresh className={'refresh-spin'} fontSize={'large'} />
        <p>Loading Schema & Data</p>
      </div>
    )

  return (
    <React.Fragment>
      <UIStoreProvider store={store} onChange={onChange} showValidity={showValidity}>
        <UIRootRenderer schema={schema} />
        {/*
                add children that should be under the schema editor,
                they can use the UIStoreContext and UIConfigContext
            */}
      </UIStoreProvider>

      <Button
        style={{ marginTop: 24 }}
        onClick={() => {
          console.log(
            'data-store: ',
            store.getValues() ? store.getValues().toJS() : undefined
          )
          console.log('is-invalid: ', !!isInvalid(store.getValidity()))
          isInvalid(store.getValidity())
            ? setShowValidity(true)
            : console.log('should do some action here')
        }}
        variant={'contained'}
      >
        send!
      </Button>

      <Typography component={'p'} variant={'body1'} style={{ marginTop: 24 }}>
        See <code>console.log</code> after clicking on <code>SEND!</code>
      </Typography>
      <hr style={{ opacity: 0.2 }} />
      <Typography component={'p'} variant={'body1'}>
        Code of this form/schema:{' '}
        <Link
          href={
            'https://github.com/ui-schema/demo-cra/blob/master/src/Schema/DemoEditor.js'
          }
        >
          src/Schema/DemoEditor.js
        </Link>
      </Typography>
    </React.Fragment>
  )
}

const AppEditor = () => {
  return (
    <UIMetaProvider widgets={customWidgets} t={browserT}>
      <Editor />
    </UIMetaProvider>
  )
}

export default AppEditor
