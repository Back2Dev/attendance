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
  {
    number: 456,
    slug: 'app-456-property-added',
    name: 'app-456-property-added',
    body: '*|nickname|* has just added a property: *|address|*',
    recipients: ['PM'],
    trigger: 'complete',
    url: '/dispatch/:id',
    type: 'APP',
  },
  {
    number: 123,
    slug: 'app-123-property-added',
    name: 'app-123-property-added',
    body: 'You have added a new property with address: *|address|*',
    recipients: ['USR'],
    trigger: 'complete',
    url: '/properties/:id',
    type: 'APP',
  },
  {
    number: 125,
    slug: 'app-125-conveyancer-assigned',
    name: 'app-125-conveyancer-assigned',
    body: '*|conveyancer|* was assigned as a conveyancer to your property',
    recipients: ['CUS'],
    trigger: 'complete',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 237,
    recipients: ['CON'],
    trigger: 'complete',
    delay: '',
    slug: 'app-237-assign-con',
    name: 'app-237-assign-con',
    body: 'You have been assigned *|customers|* as your client(s) to *|address|*',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 235,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-235-signed-cos',
    name: 'app-235-signed-cos',
    body: 'The signed contract of sale has been uploaded for *|address|*',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 126,
    recipients: ['CUS'],
    slug: 'app-126-egl-approved',
    name: 'app-126-egl-approved',
    body: 'The engagement letter has been approved for *|address|*',
    trigger: 'complete',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 140,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-140-client-auth',
    name: 'app-140-client-auth',
    body: 'The client authorisation form has been completed for *|address|*',
    url: '/caf/:taskId',
    type: 'APP',
  },
  {
    number: 150,
    text: '150-VOI-ready',
    body: 'The verification of your identity is ready',
    recipients: ['CUS'],
    trigger: 'ready',
    URL: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 104,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-104-review-cos',
    name: 'app-104-review-cos',
    body: 'Re: *|address|* \nYour contract review has been completed.',
    type: 'APP',
    url: '/next-steps/:id',
  },
  {
    number: 250,
    slug: 'app-250-go-ahead',
    recipients: ['CON'],
    type: 'SMS',
    trigger: 'ready',
    body: 'Re: {{address}}\nCAF is completed',
  },
  {
    number: 109,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-109-initial-remind',
    name: 'app-109-initial-remind',
    body: 'Please remember to complete your initial documents',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 115,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-115-move-pos',
    name: 'app-115-move-pos',
    body:
      'Re: *|address|*\nThe settlement of your property is fast approaching. We have just emailed you.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 118,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-118-upload-soc',
    name: 'app-118-upload-soc',
    body: '*|address|* Settlement costs has been approved',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 189,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-189-congrats-settled',
    name: 'app-189-congrats-settled',
    body: 'Congratulations! The settlement of your purchase is now complete.',
    url: '/properties/:id',
    type: 'APP',
  },
  {
    number: 106,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-106-upload-soa',
    name: 'app-106-upload-soa',
    body:
      '*|address|* Statement of adjustments & settlement statement have been approved',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 134,
    recipients: ['CUS'],
    trigger: 'complete',
    delay: '',
    slug: 'app-134-email-inv',
    name: 'app-134-email-inv',
    body: 'Your conveyancing bill is now due. Please pay here',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 260,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-260-pay-inv',
    name: 'app-260-pay-inv',
    body: 'The Tax Invoice for *|address|* has now been paid.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 297,
    recipients: ['CON'],
    trigger: 'ready',
    delay: '',
    slug: 'app-297-settle-review',
    name: 'app-297-settle-review',
    body: 'The customer experience survey for *|property address|* is now complete. ',
    type: 'APP',
  },
  {
    number: 402,
    trigger: 'complete',
    recipients: ['PM'],
    slug: 'app-402-engagement-letter',
    name: 'app-402-engagement-letter',
    body: 'Re: *|address|*\nThe engagement letter is ready for review',
    url: '/approve/:taskId',
    type: 'APP',
  },
  {
    number: 271,
    recipients: ['CON'],
    slug: 'app-271-review-decision',
    name: 'app-271-review-decision',
    body: 'Re: *|address|*\n',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 446,
    recipients: ['PM'],
    trigger: 'ready',
    slug: 'app-446-pm-auth',
    name: 'app-446-pm-auth',
    body: 'Re: *|address|*\nPlease sign the client authorisation form',
    url: '/caf/:taskId',
    type: 'APP',
  },
  {
    number: 243,
    trigger: 'complete',
    recipients: ['CON'],
    slug: 'app-243-pm-auth',
    name: 'app-243-pm-auth',
    body: 'Re: *|address|*\n*|seller|* has completed the Customer Authorisation Form.',
    url: '/caf/:taskId',
    type: 'APP',
  },
  {
    number: 210,
    trigger: 'complete',
    recipients: ['CON'],
    slug: 'app-210-seller-q',
    name: 'app-210-seller-q',
    body: "Re: *|address|*\n*|seller|* has completed the Seller's questionnaire",
    url: '/sq/:taskId',
    type: 'APP',
  },
  {
    number: 261,
    trigger: 'ready',
    recipients: ['CUS'],
    delay: '',
    slug: 'app-261-voi-cus',
    name: 'app-261-voi-cus',
    body:
      'Re: *|address|* For security and compliance we are required to verify your identity.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 262,
    trigger: 'complete',
    recipients: ['CON'],
    slug: 'app-262-voi-con',
    name: 'app-262-voi-con',
    body: 'Re: *|address|* *|seller|* VOI is complete',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 129,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-129-prep-s27',
    name: 'app-129-prep-s27',
    body: 'Re: *|address|* We have prepared your deposit release statement',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 246,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-246-sign-s27',
    name: 'app-246-sign-s27',
    body:
      'Re: *|address|*\nThe Section 27. has been signed. Please email this to the buyer’s representative.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 422,
    recipients: ['PM'],
    trigger: 'ready',
    slug: 'app-422-approve-contract',
    name: 'app-422-approve-contract',
    body:
      'Re: *|address|*\nThe draft contract and section 32 documents are ready for review',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 122,
    trigger: 'complete',
    recipients: ['CUS'],
    slug: 'app-122-approve-contract',
    name: 'app-122-approve-contract',
    body:
      'Re: *|address|* Your draft contract of sale and section 32 are ready for your approval and signing of the section 32',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 323,
    trigger: 'complete',
    recipients: ['AGT'],
    slug: 'app-323-approve-contract',
    name: 'app-323-approve-contract',
    body:
      'Re: *|address|*\nWe have just provided the customer a draft Contract of Sale and Section 32 for their approval and signature.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 325,
    recipients: ['AGT'],
    slug: 'app-325-release-s32',
    name: 'app-325-release-s32',
    body:
      'Re; *|address|* The final contract of sale and  section 32 are ready via My Documents',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 124,
    trigger: 'complete',
    recipients: ['CUS'],
    slug: 'app-124-release-s32',
    name: 'app-124-release-s32',
    body:
      'Re; *|address|* Your final contract of sale and  section 32 are ready via My Documents',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 266,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-266-seller-sign-contract',
    name: 'app-266-seller-sign-contract',
    body: 'Please fill in the details of the contract',
    url: '/next-steps/:id',
    type: 'APP',
  },

  {
    number: 238,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-238-review-cos',
    name: 'app-238-review-cos',
    body:
      'Re: *|address|*\nPlease call *|buyer|* to check that they understand the Contract Review and inform them about next steps.',
    type: 'APP',
  },
  {
    number: 263,
    recipients: ['CON'],
    trigger: 'ready',
    slug: 'app-263-voi-complete',
    name: 'app-263-voi-complete',
    body: "All VOI's have been completed for *|address|*",
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 268,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-268-unconditional',
    name: 'app-268-unconditional',
    body: 'Re: *|address|*\nThe sale of your property is now unconditional',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 242,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-242-settle-time',
    name: 'app-242-settle-time',
    body:
      'Is it time to prepare the following for *|address|*? Statement of Adjustments, Settlement Statement, Settlement Costs Statement, Tax Invoice',
    type: 'APP',
  },
  {
    number: 116,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-116-upload-invoice',
    name: 'app-116-upload-invoice',
    body:
      'Re: *|address|*\nWe are almost ready to settle and have just sent you an important email.',
    type: 'APP',
  },
  {
    number: 113,
    trigger: 'complete',
    recipients: ['CUS'],
    slug: 'app-113-final-inspection',
    name: 'app-113-final-inspection',
    body: 'Re: *|address|*\nHave you done a final inspection of the property?',
    type: 'APP',
  },
  {
    number: 135,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-135-pexa-settled',
    name: 'app-135-pexa-settled',
    body:
      'Re: *|address|*\nCongratulations! Settlement is now complete. We will send our final email soon.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 336,
    recipients: ['AGT'],
    trigger: 'complete',
    delay: '',
    slug: 'app-336-pexa-settled',
    name: 'app-336-pexa-settled',
    body:
      'Re: *|address|*\nSettlement is now complete. Please release keys to the purchaser.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 236,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-236-pexa-settled',
    name: 'app-236-pexa-settled',
    body:
      'Re: *|address|*\nSettlement is now complete. Please send notices to relevant authorities',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 315,
    recipients: ['AGT'],
    trigger: 'complete',
    slug: 'app-315-settle-reminder',
    name: 'app-315-settle-reminder',
    body:
      'Property at *|address|* is now settling. Purchaser will collect keys after settlement.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 250,
    recipients: ['CON'],
    trigger: 'ready',
    slug: 'app-250-go-ahead',
    name: 'app-250-go-ahead',
    body: 'Re: *|address|*\nCAF is completed\n',
    type: 'APP',
  },
  {
    number: 255,
    recipients: ['CON'],
    slug: 'app-255-voi-all',
    name: 'app-255-voi-all',
    body: "Re: *|address|*\nAll VOI's are complete",
    type: 'APP',
  },
  {
    number: 251,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-251-unconditional',
    name: 'app-251-unconditional',
    body: 'Re: *|address|*',
    type: 'APP',
  },
  {
    number: 254,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-254-move-pos-con',
    name: 'app-254-move-pos-con',
    body:
      'Re: *|address|*\nIt is now time to prepare for settlement. If applicable, please check that your customer’s finance is ready for settlement.',
    type: 'APP',
  },

  {
    number: 248,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-248-settle-date-time',
    name: 'app-248-settle-date-time',
    body:
      'Re: *|address|*\nIs it time to prepare the following?\n\n    - Statement of Adjustments\n    - Settlement Statement \n    - Settlement Costs Statement\n    - Tax Invoice.',
    type: 'APP',
  },
  {
    number: 114,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-114-buyer-sro',
    name: 'app-114-buyer-sro',
    body:
      'Re: *|address|*\nYou will receive an email from the State Revenue Office. Please action this, so we can proceed to settlement.',
    type: 'APP',
  },
  {
    number: 241,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-241-upload-soa',
    name: 'app-241-upload-soa',
    body:
      'Re: *|address|*\nPlease prepare and upload statement of adjustments and settlement statement, settlement costs statement, tax invoice and account sales',
    type: 'APP',
  },
  {
    number: 116,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-116-upload-invoice',
    name: 'app-116-upload-invoice',
    body:
      'Re: *|address|*\nWe are almost ready to settle and have just sent you an important email.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 112,
    trigger: 'complete',
    recipients: ['CUS'],
    slug: 'app-112-final-inspection',
    name: 'app-112-final-inspection',
    body: 'Re: *|address|*\nHave you done a final inspection of the property?',
    type: 'APP',
  },
  {
    number: 117,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-117-pexa-settled',
    name: 'app-117-pexa-settled',
    body:
      'Re: *|address|*\nCongratulations! Settlement is now complete. We will send our final email soon.\n',
    type: 'APP',
  },
  {
    number: 318,
    recipients: ['AGT'],
    trigger: 'complete',
    slug: 'app-318-pexa-settled',
    name: 'app-318-pexa-settled',
    body:
      'Re: *|address|*\nSettlement is complete. Please release keys to the purchaser.',
    type: 'APP',
  },
  {
    number: 218,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-218-pexa-settled',
    name: 'app-218-pexa-settled',
    body:
      'Re: *|address|*\nSettlement is complete. Please release keys to the purchaser.',
    type: 'APP',
  },
  {
    recipients: ['CUS'],
    trigger: 'complete',
    number: 101,
    slug: 'app-101-assign-conv',
    name: 'app-101-assign-conv',
    body:
      'Your Startup Inc conveyancer will contact you soon. Please expect a call from *|conveyancer|*.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    recipients: ['CON'],
    trigger: 'complete',
    number: 201,
    slug: 'app-201-assign-conv',
    name: 'app-201-assign-conv',
    body: 'You have been assigned *|customers|* as your client to *|address|*',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    recipients: ['AGT'],
    trigger: 'complete',
    number: 301,
    slug: 'app-301-assign-conv',
    name: 'app-301-assign-conv',
    body:
      'We received instructions to act in the sale of *|address|*. The assigned Conveyancer is *|conveyancer|*.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 105,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-105-review-cos',
    name: 'app-105-review-cos',
    body:
      'Your contract review has been completed. Please check your email.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 240,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-240-client-auth',
    name: 'app-240-client-auth',
    body:
      '*|buyer|* has completed the Client Authorisation Form. Please begin property searches and enquiries for *|address|*. If other documents remain outstanding, please follow up.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 256,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-256-move-pos',
    name: 'app-256-move-pos',
    body:
      'It is now time to prepare for settlement of *|address|*. If applicable, please check that your customer’s finance is ready for settlement.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 110,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-110-move-pos',
    name: 'app-110-move-pos',
    body:
      'The settlement of your property is fast approaching. We have just emailed you.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 242,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-242-settle-time',
    name: 'app-242-settle-time',
    body:
      'Is it time to prepare the following for *|address|*? Statement of Adjustments, Settlement Statement, Settlement Costs Statement, Tax Invoice',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 108,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-108-alert-buyer',
    name: 'app-108-alert-buyer',
    body:
      'The settlement of your property is fast approaching. We have just emailed you.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },

  {
    number: 111,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-111-upload-inv',
    name: 'app-111-upload-inv',
    body:
      'We are almost ready for settlement. We have just sent you an important email.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 312,
    recipients: ['AGT'],
    trigger: 'complete',
    slug: 'app-312-remind-inspect',
    name: 'app-312-remind-inspect',
    body:
      'Settlement of *|address|* is due on *|settlement_date|* at *|settlement_time|*. Please organise final inspection.\n\nCheers,\nStartup Inc\n\nThis is an automated App, please do not reply.',
    type: 'APP',
  },
  {
    number: 298,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-298-final-review',
    name: 'app-298-final-review',
    body: 'FYI, the customer experience survey for (property address) is now complete.',
    type: 'APP',
  },
  {
    number: 119,
    recipients: ['CUS'],
    trigger: 'complete',
    delay: '',
    slug: 'app-119-assign-con',
    name: 'app-119-assign-con',
    body:
      'Re: *|address|*\nYour Startup Inc conveyancer will contact you soon. Please expect a call from *|conveyancer|*.',
    type: 'APP',
  },
  {
    number: 320,
    recipients: ['AGT'],
    trigger: 'complete',
    slug: 'app-320-assign-con',
    name: 'app-320-assign-con',
    body:
      'Re: *|address|*\nWe received instructions to act in the sale. The assigned Conveyancer is *|conveyancer|*.',
    type: 'APP',
  },
  {
    number: 220,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-220-assign-con',
    name: 'app-220-assign-con',
    body:
      'Re: *|address|*\nYou have been assigned *|seller|*. Please call the customer within 2 hours. Please prepare and upload the following:\n    \n    - Letter of Engagement\n    - Cost Disclosure',
    type: 'APP',
  },
  {
    number: 403,
    trigger: 'complete',
    recipients: ['CUS'],
    slug: 'app-403-approve-egl',
    name: 'app-403-approve-egl',
    body:
      'Re: *|address|*\nWe have just emailed you about several important documents for your immediate attention.',
    type: 'APP',
  },
  {
    number: 120,
    recipients: ['CON'],
    slug: 'app-120-approve-cdc',
    name: 'app-120-approve-cdc',
    body: 'Re: *|address|*\n',
    type: 'APP',
  },
  {
    number: 404,
    trigger: 'complete',
    recipients: ['PM'],
    delay: '',
    slug: 'app-404-client-auth',
    name: 'app-404-client-auth',
    body: 'Re: *|address|*\nThe CAF is complete, please review\n',
    type: 'APP',
  },
  {
    number: 263,
    recipients: ['CON'],
    trigger: 'ready',
    slug: 'app-263-voi-complete',
    name: 'app-263-voi-complete',
    body: "All VOI's have been completed for *|address|*",
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 145,
    recipients: ['CUS'],
    slug: 'app-145-prep-27',
    name: 'app-145-prep-27',
    body:
      'Re: *|address|*\nWe have prepared your deposit release statement. Please review and sign via *|url|*',
    type: 'APP',
  },
  {
    number: 264,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-264-sign-27',
    name: 'app-264-sign-27',
    body:
      'Re: *|address|*\nThe Section 27. has been signed. Please email this to the buyer’s representative.',
    type: 'APP',
  },
  {
    number: 265,
    recipients: ['CON'],
    slug: 'app-265-approve-s32',
    name: 'app-265-approve-s32',
    body: 'Re: *|address|*\n',
    type: 'APP',
  },
  {
    number: 244,
    trigger: 'complete',
    recipients: ['CON'],
    slug: 'app-244-sign-s32',
    name: 'app-244-sign-s32',
    body:
      'Re: *|address|*\n*|seller|* has approved the contract and signed the section 32',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 267,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-267-buyer-sign-contract',
    name: 'app-267-buyer-sign-contract',
    body: 'Re: *|address|*\nThe signed the contract of sale has been uploaded',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 167,
    trigger: 'complete',
    recipients: ['CUS'],
    slug: 'app-167-buyer-sign-contract',
    name: 'app-167-buyer-sign-contract',
    body:
      'Re: *|address|*\nCongratulations on the sale of your property. We will begin preparing for settlement',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 367,
    trigger: 'complete',
    recipients: ['AGT'],
    slug: 'app-367-buyer-sign-contract',
    name: 'app-367-buyer-sign-contract',
    body:
      'Re: *|address|*\nCongratulations on the sale of this property. We will begin preparing for settlement',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 128,
    recipients: ['CUS'],
    trigger: 'ready',
    slug: 'app-128-remind-27',
    name: 'app-128-remind-27',
    body:
      'Re: *|address|*\nDid you know, you may be eligible for an early release of the deposit. Contact your conveyancer for more information. ',
    type: 'APP',
  },

  {
    number: 333,
    recipients: ['AGT'],
    slug: 'app-333-settlement-date-time',
    name: 'app-333-settlement-date-time',
    body:
      'Re: *|address|*\nSettlement has been booked for *|settlement_time|* on *|settlement_date|*\nPlease ensure all keys are ready for release after settlement.',
    type: 'APP',
  },
  {
    number: 133,
    trigger: 'complete',
    recipients: ['CUS'],
    slug: 'app-133-settlement-date-time',
    name: 'app-133-settlement-date-time',
    body:
      'Re: *|address|*\nSettlement has been booked for *|settlement_time|* on *|settlement_date|*\nPlease ensure all keys are ready for release after settlement.',
    type: 'APP',
  },
  {
    number: 130,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-130-seller-alert',
    name: 'app-130-seller-alert',
    body: 'Re: *|address|* The settlement of your property is fast approaching.',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 132,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-132-seller-sro-alert',
    name: 'app-132-seller-sro-alert',
    body:
      'Re: *|address|* Please look out for an email from the State Revenue Office. Please action this immediately',
    type: 'APP',
  },
  {
    number: 247,
    recipients: ['CON'],
    trigger: 'ready',
    delay: '',
    slug: 'app-247-upload-soa',
    name: 'app-247-upload-soa',
    body:
      'Re: *|address|* Please upload statement of adjustments, settlement costs statement, tax invoice and account sales (if any)',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 269,
    recipients: ['CON'],
    slug: 'app-269-upload-invoice',
    name: 'app-269-upload-invoice',
    body: 'Re: *|address|*\n',
    type: 'APP',
  },
  {
    number: 406,
    trigger: 'ready',
    recipients: ['PM'],
    slug: 'app-406-approve-soa',
    name: 'app-406-approve-soa',
    body:
      'Re: *|address|*\nStatement of adjustments and settlement costs are ready for your review\n\n',
    type: 'APP',
  },
  {
    number: 252,
    trigger: 'complete',
    recipients: ['CON'],
    slug: 'app-252-approve-soa',
    name: 'app-252-approve-soa',
    body:
      'Re: *|address|*\nStatement of adjustments and settlement costs have been approved',
    type: 'APP',
  },
  {
    number: 253,
    trigger: 'reject',
    recipients: ['CON'],
    slug: 'app-253-approve-soa',
    name: 'app-253-approve-soa',
    body:
      'Re: *|address|*\nStatement of adjustments and settlement costs have been declined. Please contact your practice manager',
    type: 'APP',
  },
  {
    number: 270,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-270-settle-review',
    name: 'app-270-settle-review',
    body: 'Re: *|address|*\nFYI, the customer experience survey is complete. ',
    type: 'APP',
  },
  {
    number: 445,
    trigger: 'complete',
    recipients: ['PM'],
    slug: 'app-445-settle-review',
    name: 'app-445-settle-review',
    body: 'Re: *|address|*\nFYI, the customer experience survey is complete. ',
    type: 'APP',
  },
  {
    number: 103,
    recipients: ['CUS'],
    trigger: 'complete',
    slug: 'app-103-assign-review',
    name: 'app-103-assign-review',
    body:
      'Re: *|address|*\nWe are starting to review your contract. We will let you know when it is ready.\n',
    type: 'APP',
  },
  {
    number: 231,
    recipients: ['CON'],
    trigger: 'complete',
    delay: '',
    slug: 'app-231-assign-review',
    name: 'app-231-assign-review',
    body: 'Re: *|address|*\nPlease complete a contract review',
    url: '/next-steps/:id',
    type: 'APP',
  },
  {
    number: 239,
    recipients: ['CON'],
    trigger: 'complete',
    slug: 'app-239-review-cos',
    name: 'app-239-review-cos',
    body:
      'Re: *|address|*\nPlease call *|buyer|* to check that they understand the Contract Review and inform them about next steps.',
    type: 'APP',
  },
  {
    number: 299,
    recipients: ['CON'],
    trigger: 'complete',
    delay: '',
    slug: 'app-299-cust-feedback',
    name: 'app-299-cust-feedback',
    body: 're: *|address|*\nFYI, the customer experience survey is now complete. ',
    type: 'APP',
  },
]
