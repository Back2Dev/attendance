const stepsMeta = [
  {
    type: 'external',
    name: 'External',
    actions: ['complete', 'status', 'skip', 'reset'],
    config: [
      // Workflow editor will allow up to 10 items to be configured
      // Backend will provide an array of items
      // Step UI will present a checklist of items to be completed
      { type: 'checklist', min: 1, max: 10 },
    ],
    complete: 'complete',
  },
  {
    type: 'set-date-time',
    name: 'Set date/time',
    actions: ['complete', 'status', 'skip', 'reset'], // 'complete' is the action of setting the date

    config: [
      // Workflow editor will ask for the DB field name (eg 'settlementDate'), and the label to display (eg 'Settlement Date')
      // Backend will provide the DB field name and display label
      // Step UI will present input boxes for the DB field name and display label
      { type: 'input', values: ['field', 'label'] },

      // Workflow editor will show checkboxes for `date` and `time`
      // Backend will provide a list of what was ticked (eg ['date'] or ['date','time'])
      // Step UI will show date/time pickers according to config
      { type: 'checkbox', values: ['date', 'time'] },
    ],
    complete: 'complete',
  },
  {
    type: 'upload',
    name: 'Document upload',
    actions: ['upload', 'download', 'status', 'skip', 'reset'],
    config: [
      // Workflow editor will show a dropdown/select for document type (using allowedValues)
      // Backend will provide the selected docType
      // Step UI doesn't change
      {
        type: 'select',
        name: 'docType',
        label: 'Document type',
        allowedValues: ['cos', 'leg', 'soa'],
      },
    ],
    complete: 'upload',
  },
  {
    type: 'nextstage',
    name: 'Next stage',
    actions: ['complete', 'status', 'reset'],
    config: [
      // Workflow editor will ask for the slug of the next stage (eg 'settle'), and the label to display (eg 'Stage')
      // Backend will provide the slug of the next stage
      // Step UI doesn't change
      { type: 'input', values: ['field', 'label'] },
    ],
    complete: 'complete',
  },
  // Approval step - usually includes a review of one or more documents
  {
    type: 'approve',
    name: 'Approve (v1)',
    actions: ['approve', 'download', 'reject', 'status', 'skip', 'reset'],
    complete: 'approve',
  },
  {
    type: 'approvev2',
    name: 'Approve (v2)',
    actions: ['approve', 'download', 'reject', 'status', 'skip', 'reset'],
    complete: 'approve',
  },
  {
    type: 'notification',
    name: 'Send notification',
    actions: ['send', 'status', 'skip', 'reset'],
    complete: 'send',
  },
  {
    type: 'assign',
    name: 'Assign person',

    actions: ['assign', 'status', 'skip', 'reset'],
    complete: 'assign',
  },
  {
    type: 'webform',
    name: 'Web form',
    actions: ['edit', 'download', 'status', 'skip', 'reset'],
    complete: 'edit',
  },
  {
    type: 'header',
    name: 'Header',
    actions: [],
  },
  {
    type: 'sign',
    name: 'Sign document (v1)',
    actions: ['sign', 'status', 'skip', 'reset'],
    complete: 'sign',
  },
  {
    type: 'signv2',
    name: 'Sign document (v2)',
    actions: ['sign', 'status', 'skip', 'reset'],
    complete: 'sign',
  },
  {
    type: 'question',
    name: 'Question',
    actions: ['complete', 'status', 'skip', 'reset'],
    complete: 'complete',
  },
  // Things that can be done by a bot, either initiating something (like sending automated notifications),
  // or waiting for something, like a webhook to tell us it's complete
  {
    type: 'bot',
    name: 'Robot',
    actions: ['complete', 'status', 'skip', 'reset'],
    complete: 'complete',
  },
  {
    type: 'survey',
    name: 'Survey',
    actions: ['complete', 'status', 'skip', 'reset'],
    complete: 'complete',
  },
  {
    type: 'prep',
    name: 'Prepare for signing (v1)',
    actions: ['prep', 'status', 'skip', 'reset'],
    complete: 'prep',
  },
  {
    type: 'prepv2',
    name: 'Prepare for signing (v2)',
    actions: ['prep', 'status', 'skip', 'reset'],
    complete: 'prep',
  },
  {
    type: 'multi',
    name: 'Approve or sign multiple documents',
    actions: ['edit', 'download', 'status', 'skip', 'reset'],
    complete: 'edit',
  },
  {
    type: 'edit-workshop',
    name: 'Edit Workshop',
    actions: ['edit', 'status', 'skip', 'reset'],
    complete: 'complete',
  },
]

export const defaultPermissions = {
  complete: ['PART', 'WSADM'],
  status: ['ADM', 'WSADM', 'PART'],
  skip: ['ADM'],
  sign: ['PART'],
  upload: ['PART', 'WSADM', 'ADM'],
  download: ['PART', 'WSADM', 'ADM'],
  assign: ['ADM'],
  approve: ['WSADM'],
  reject: ['WSADM', 'ADM'],
  edit: ['WSADM', 'PART', 'ADM'],
  prep: ['WSADM', 'ADM'],
  prepv2: ['WSADM', 'ADM'],
  reset: ['WSADM', 'ADM'],
}

// Helper functions
// Return array of step types:
stepsMeta.stepTypes = () => stepsMeta.map((stepType) => stepType.type)
// Return array of step types and names:
stepsMeta.stepTypeNames = () =>
  stepsMeta
    .map((stepType) => {
      const { type, name } = stepType
      return { type, name }
    })
    .sort((a, b) => {
      if (a.name > b.name) {
        return 1
      }
      if (a.name < b.name) {
        return -1
      }
      return 0
    })

stepsMeta.allowedActions = (type) =>
  stepsMeta
    .filter((stepType) => stepType.type === type)
    .map((stepType) => stepType.actions)
    .flat()

stepsMeta.allowedPermissions = (type) =>
  stepsMeta.allowedActions(type).reduce((permissions, action) => {
    permissions[action] = defaultPermissions[action] || []
    return permissions
  }, {})

export default stepsMeta
