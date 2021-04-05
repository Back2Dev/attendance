// App notifications
module.exports = [
  {
    number: 500,
    slug: 'app-500-new-user',
    name: 'app-500-new-user',
    body: 'A new *|role|* has been created with email address *|email|*',
    recipients: ['ADM'],
    trigger: 'complete',
    type: 'APP',
  },
  {
    number: 121,
    slug: 'app-121-password-changed',
    name: 'app-121-password-changed',
    body: 'Your password was successfully changed',
    recipients: ['USR'],
    trigger: 'complete',
    type: 'APP',
  },
]
