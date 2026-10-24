import CONSTANTS from '/imports/api/constants.js'

export const jsonSchema = {
  type: 'object',
  required: ['name', 'duration'],
  properties: {
    name: {
      type: 'string',
      title: 'Event name',
    },
    when: {
      type: 'string',
      title: 'Date & Time',
    },
    duration: {
      type: 'integer',
      title: 'Duration (hours)',
    },
    price: {
      type: 'integer',
      title: 'Price (cents)',
      default: 0,
    },
    status: {
      type: 'string',
      title: 'Status',
      enum: Object.keys(CONSTANTS.EVENT_STATUS),
      default: 'active',
    },
    locationId: {
      type: 'string',
      title: 'Location',
    },
    backupLocationId: {
      type: 'string',
      title: 'Backup Location',
    },
    description: {
      type: 'string',
      title: 'Description',
    },
    public: {
      type: 'boolean',
      title: 'Public (visible without login)',
      default: false,
    },
  },
}

export const uiSchema = {
  'ui:order': [
    'name', 'when', 'duration', 'price', 'status',
    'locationId', 'backupLocationId',
    'description', 'public', '*',
  ],
  description: {
    'ui:widget': 'textarea',
    'ui:options': { rows: 3 },
    'ui:emptyValue': '',
  },
  when: { 'ui:widget': 'datetime' },
  public: { 'ui:widget': 'checkbox' },
  locationId: { 'ui:widget': 'location' },
  backupLocationId: { 'ui:widget': 'location' },
}

const config = {
  view: {
    header: true,
    rows: [{ field: 'name', label: 'Name' }],
  },
  list: {
    columns: [
      { field: 'name', title: 'name', editor: true, formatter: null },
      { field: 'description', title: 'description', editor: true, formatter: null },
      { field: 'location', title: 'location', editor: true, formatter: null },
      { field: 'when', title: 'when', editor: false, formatter: (cell) => {
        const v = cell.getValue()
        if (!v) return ''
        const d = v instanceof Date ? v : new Date(v)
        return isNaN(d) ? String(v) : d.toLocaleString()
      }},
      { field: 'status', title: 'status', editor: true, formatter: null },
      { field: 'duration', title: 'duration', editor: true, formatter: null },
      { field: 'price', title: 'price', editor: true, formatter: null },
    ],
  },
  add: {
    defaultObject: {
      name: 'Untitled',
      description: '',
      location: '',
      status: 'active',
      duration: 0,
      price: 0,
    },
  },
}

export default config
