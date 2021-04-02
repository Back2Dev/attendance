module.exports = [
  {
    body:
      'Dear Startup Inc Admin, \nA new *|role|* user has been created at Startup Inc. \n*|nickname|* with email address *|email|* was created in the system at *|timestamp|*',
    name: 'convx-newuser',
    revision: 1,
    slug: 'new-user',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nPlease change your password by clicking [here.] (*|url|*)',
    name: 'convx-forgotpassword',
    revision: 1,
    slug: 'forgot-password',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThis email confirms that your password has been changed on *|timestamp|*\nIf this wasn’t you, please contact us to secure your account.',
    name: 'password-change',
    revision: 1,
    slug: 'password-change',
    type: 'EMAIL',
  },
]
