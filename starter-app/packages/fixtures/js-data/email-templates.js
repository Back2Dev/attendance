module.exports = [
  {
    body:
      'Dear *|nickname|*,\nThank you for expressing your interest to join the Startup Inc community.\nWe are pleased to advise you that your application has progressed to the next stage.\nWe would like to invite you to participate in an online interview.\nPlease select your preferred date:\n[*|optionDate1|* at *|optionTime1|*] (*|optionUrl1|*) \n[*|optionDate2|* at *|optionTime2|*] (*|optionUrl2|*) \nOnce again, thank you for your application and congratulations on progressing to the next stage.\nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP—we are here to help.',
    name: 'acceptance-expression-interest',
    revision: 1,
    slug: 'acceptance-expression-interest',
    type: 'EMAIL',
  },
  {
    body:
      'Thank you for choosing Startup Inc.\n*|agent|* added a listing for you. Please set up or login to your account by clicking [here.] (*|url|*) \nDetails: \nAddress: *|address|* \nType: *|type|*',
    name: 'add-property',
    revision: 1,
    slug: 'add-property',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThis property is now settled. \nPlease update the property through the Agentbox. \nAgentBox listing id: *|external_id|* \nThanks for your business and please don’t hesitate to contact us if we can help with anything down the track.',
    name: 'agentbox-property-complete',
    revision: 1,
    slug: 'agentbox-property-complete',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nA new announcement has been added on *|timestamp|* by *|createdBy|*. \nDetails: \nAnnouncement: *|comment|* \nStatus: *|status|* \nAssigned to: *|conveyancer|* \nAddress: *|address|* \nType: *|type|*',
    name: 'announcement',
    revision: 1,
    slug: 'announcement',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nYou have been assigned as an agent to a listing at *|address|*. Please set up or login to your account by clicking [here] (*|url|*) .',
    name: 'assign-agent',
    revision: 1,
    slug: 'assign-agent',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe have now assigned a customer to your property settlement.\n*|customer|* has been assigned to *|address|*',
    name: 'assign-conveyancer',
    revision: 1,
    slug: 'assign-conveyancer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nYou have been assigned as a customer to a listing at *|address|*',
    name: 'assign-customer',
    revision: 1,
    slug: 'assign-customer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nA new comment has been added on *|timestamp|* by *|createdBy|* \nDetails: \nComment: *|notes|* \nStatus: *|status|* \nAssigned to: *|conveyancer|* \nAddress: *|address|* \nType: *|type|*',
    name: 'comment transaction',
    revision: 1,
    slug: 'comment-transaction',
    type: 'EMAIL',
  },
  {
    body:
      'Dear Startup Inc Admin, \nYou received a message from contact us page.\nDetails: \nName: *|nickname|* \nEmail: *|email|* \nMobile number: *|phoneNumber|* \nMessage: *|message|*',
    name: 'contact-us',
    revision: 1,
    slug: 'contact-us',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe have now reviewed your Contract of Sale. Our feedback can be accessed via [My documents] (*|url|*) . \nThe Contract of Sale is the most important document in the conveyancing process as it records the terms of your agreement with the seller. \nIf you are happy to proceed, please organise to sign the contract with your real estate agent. \nWhat happens next? \nYour real estate agent will organise the seller to countersign the contract. \nOnce all parties have signed the Contract of Sale, it is your responsibility to ensure we receive a signed copy which should be electronically uploaded to the Startup Inc platform. \nYou may also find the [Startup Inc Buyer’s Guide] (*|url|*) a useful reference tool. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'contract-upload',
    revision: 1,
    slug: 'contract-upload',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe have now reviewed your Contract of Sale. Our feedback can be accessed via [My documents] (*|url|*) . \nThe Contract of Sale is the most important document in the conveyancing process as it records the terms of your agreement with the seller. \nIf you are happy to proceed, please organise to sign the contract with the selling agent. \nWhat happens next? \nThe selling agent will organise the seller to countersign the contract. \nOnce all parties have signed the Contract of Sale, it is your responsibility to ensure we receive a signed copy which should be electronically uploaded to the Startup Inc platform. \nYou may also find the [Startup Inc Buyer’s Guide] (*|url|*) a useful reference tool. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'contract-upload-otp',
    revision: 1,
    slug: 'contract-upload-otp',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe have now reviewed your Contract of Sale. Our feedback can be accessed via [My documents] (*|url|*) . \nThe Contract of Sale is the most important document in the conveyancing process as it records the terms of your agreement with the seller. \nIf you are happy to proceed, please organise to sign the contract with the selling agent. \nWhat happens next? \nThe selling agent will organise the seller to countersign the contract. \nOnce all parties have signed the Contract of Sale, it is your responsibility to ensure we receive a signed copy which should be electronically uploaded to the Startup Inc platform. \nYou may also find the [Startup Inc Buyer’s Guide] (*|url|*) a useful reference tool. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'contract-upload-otp-original',
    revision: 1,
    slug: 'contract-upload-otp-original',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nYou have been assigned *|address|*. Please call *|buyer|* to introduce yourself within the next 2 hours and prepare and upload the Contract Review if required.',
    name: 'conveyancer-assign-buying',
    revision: 1,
    slug: 'conveyancer-assign-buying',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThis is a courtesy reminder to verify your email and activate your account.',
    name: 'courtesy-reminder',
    revision: 1,
    slug: 'courtesy-reminder',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe would love to hear about your experience with us–we are committed to continuously improving our services. \nThis [short survey] (*|url|*) should only take a minute of your time. \nMany thanks!',
    name: 'customer-agent-review',
    revision: 1,
    slug: 'customer-agent-review',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nThank you for expressing your interest to join the Startup Inc community.\nUnfortunately your application has been unsuccessful at this time.\nOnce again, thank you for your application and we wish you all the best for the future.\nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP.',
    name: 'decline-expression-interest',
    revision: 1,
    slug: 'decline-expression-interest',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nThank you for taking part in our online interviewing process.\nUnfortunately, your application has been unsuccessful at this time.\nOnce again, thank you for your application and we wish you all the best for the future.\nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP—we are here to help.',
    name: 'decline-interview',
    revision: 1,
    slug: 'decline-interview',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThanks! We received everything we asked from you. \nA copy of your marketing Contract of Sale can be reviewed in [My documents] (*|url|*) . \nAt this stage, we only need you to review the marketing contract and advise us if you require any amendments. \nOtherwise, we will forward a copy directly to the real estate agent. \nWhat happens next? \nIt’s important that you are 100% happy with the buyer’s offer. Please DO NOT sign the Contract of Sale until the buyer has made you a formal offer that you are happy with. You will be legally bound as soon as you sign, date and exchange the Contract of Sale. \nIf you think you may require the deposit to be released before settlement, please let us know as soon as possible so we can assess your eligibility and get things started. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'draft-contract-nsw-selling',
    revision: 1,
    slug: 'draft-contract-nsw-selling',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThanks! We received everything we asked from you. \nA draft copy of your Contract of Sale and Section 32 Vendor’s Statement can be reviewed in [My documents] (*|url|*) . \nPlease read these carefully and if you require any amendments, let us know as soon as possible. \nAt this stage, we only need you to sign and electronically upload the Section 32 Vendor’s Statement so we can finalise this document and forward it to your real estate agent. \nWhat happens next? \nPlease DO NOT sign the Contract of Sale until the buyer has made you a formal offer in writing and signed this document. \nIt’s important that you are 100% happy with the buyer’s offer. You will be legally bound as soon as you sign and date the Contract of Sale. \nIf you think you may require the deposit to be released before settlement, please let us know as soon as possible so we can assess your eligibility and get things started. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'draft-contract-seller',
    revision: 1,
    slug: 'draft-contract-seller',
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
      'Dear *|nickname|*, \nCongratulations on your purchase! We have now received the signed Contract of Sale. Please read through our [Startup Inc Letter of Engagement] (*|url|*) as it contains some very important information. \nThe following items in [My documents] (*|url|*) require your immediate attention: \n  *  read and sign our Client Authorisation Form   *  complete and submit our Startup Inc Buyer’s Questionnaire   *  review our Startup Inc Costs Disclosure. \nWhat happens next? \nYou must ensure that you have paid the deposit on your purchase by the due date as outlined in your Contract of Sale. \nIf the Contract of Sale is subject to any special conditions, it is your responsibility these are met by the agreed deadline. \nIf you cannot meet deadlines on any special conditions, you must let us know so we can communicate this information to all parties before you are legally bound by the Contract of Sale. \nIf you need help with any of the above, please contact us on 1800-STARTUP. We are here to help.',
    name: 'initial-engagement-buying',
    revision: 1,
    slug: 'initial-engagement-buying',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nCongratulations on your off the plan purchase! We have now received the signed Contract of Sale. Please read through our [Startup Inc Letter of Engagement] (*|url|*) as it contains some very important information. \nThe following items in [My documents] (*|url|*) require your immediate attention: \n  *  read and sign our Client Authorisation Form   *  review our Startup Inc Costs Disclosure. \nThe Contract of Sale is the most important document in the conveyancing process as it records the terms of your agreement with the seller in writing. Do not rely upon any oral terms or undertakings given to you by the seller and/or agents. \nThe property is being sold to you off the plan, which means the developer/seller is yet to complete construction of the property as at the date of sale. \nWe will let you know when we receive notification that the development has been completed. At this time, it is vital that you contact your lender/bank (if applicable) to arrange for signing of the loan documents. Do not delay this important step as it could impact your settlement. \nYou might also: \n  *  incur penalty interest   *  be liable for damages/losses. \nWhat happens next? \nYou must let us know, if you cannot meet deadlines on any special conditions so we can communicate this information to all parties before you are bound by the Contract of Sale. \nIf you need help with any of the above, please contact us on 1800-STARTUP. We are here to help.',
    name: 'initial-engagement-otp',
    revision: 1,
    slug: 'initial-engagement-otp',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe have received your instructions–thank you. \nWe have just uploaded our [Startup Inc Letter of Engagement] (*|url|*) which highlights some very important information. \nThe following items in [My documents] (*|url|*) require your immediate attention: \n  *  read and sign our Client Authorisation Form   *  complete and submit our Startup Inc Seller’s Questionnaire   *  review our Startup Inc Costs Disclosure. \nThe Contract of Sale is an essential document in the conveyancing process as it records the terms of your agreement with the purchaser. \nA current Section 32 Vendor’s Statement is also very important, as this must be provided to the buyer before they sign the Contract of Sale. It contains all the important information about the property you are selling. \nWe will draft these documents as soon as we receive everything we need from you. \nYou may also find the [Startup Inc Seller’s Guide] (*|url|*) a useful resource. \nIf you need help with any of the above, please contact us on 1800-STARTUP. We are here to help.',
    name: 'initial-engagement-selling',
    revision: 1,
    slug: 'initial-engagement-selling',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nYou are invited to join Startup Inc. Please register by clicking [here.] (*|url|*)',
    name: 'invite-user',
    revision: 1,
    slug: 'invite-user',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThank you for using our service. Please see attached for your invoice. \nDetails: \nTotal cost: $*|totalCost|* \nAddress: *|address|*\nType: *|type|*',
    name: 'invoice',
    revision: 1,
    slug: 'invoice',
    type: 'EMAIL',
  },
  {
    body:
      'Dear Startup Inc Admin, \nA *|type|* is requesting to join Startup Inc. \nDetails: \nFirst name: *|nickname|* \nLast name: *|customer|* \nEmail: *|email|* \nMobile number: *|phoneNumber|* \nState: *|state|* \nComment: *|comment|*',
    name: 'join-us',
    revision: 1,
    slug: 'join-us',
    type: 'EMAIL',
  },
  {
    body:
      'Dear Startup Inc Admin, \nA potential *|type|* is requesting to join Startup Inc. \nDetails: \nFirst name: *|nickname|* \nLast name: *|customer|* \nEmail: *|email|* \nMobile number: *|phoneNumber|*',
    name: 'join-us-agent',
    revision: 1,
    slug: 'join-us-agent',
    type: 'EMAIL',
  },
  {
    body: 'Dear *|nickname|*, \nYou have been assigned to a listing at *|address|*',
    name: 'listing-assignment-agent',
    revision: 1,
    slug: 'listing-assignment-agent',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe have now assigned an agent to your property settlement.\n*|agent|* has been assigned to *|address|*\n*|agent|* will be in touch shortly.',
    name: 'listing-assignment-customer',
    revision: 1,
    slug: 'listing-assignment-customer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nA document is attached on your listing.\nListing Details:\nAddress: *|address|*\nType: *|type|*',
    name: 'listing-document',
    revision: 1,
    slug: 'listing-document',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nYou have successfully added a new property.\nDetails: \nAddress: *|address|* \nType: *|type|*',
    name: 'listing-successful-new-property',
    revision: 1,
    slug: 'listing-successful-new-property',
    type: 'EMAIL',
  },
  {
    body:
      'Hi Developer, \nThis is a test email.\nDetails: \nTo Email: *|toEmail|* \nFrom Email: *|fromEmail|* \nMessage: *|message|*',
    name: 'message-test',
    revision: 1,
    slug: 'message-test',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nA new listing has been added. \nListing Details:\nAddress: *|address|*\nType: *|type|*',
    name: 'convx-newtransaction',
    revision: 1,
    slug: 'new-transaction',
    type: 'EMAIL',
  },
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
      'Dear *|nickname|*, \nGreat news! We have been notified that the plan of subdivision for *|address|* is now registered. \nSettlement is expected to take place on *|settlement_date|* \nThe following items in [My documents] (*|url|*) require your immediate attention: \n  *  complete and review our Startup Inc Off The Plan Buyer’s Questionnaire   *  verify your identity (VOI). \nPlease also review and approve the following documents within 14 days: \n  *  the registered plan   *  the certificate of occupancy. \nPlease contact your Startup Inc conveyancer immediately if you have any concerns about these documents. \nWhat happens next? \nFinance \nIf you haven’t already, please don’t forget to let us know who your bank/lender is so we can invite them to settlement. \nIf you are not applying for finance, we will let you know how much you will be required to pay at settlement. \nPlease do not hesitate to contact us on 1800-STARTUP, if you have any questions. We are here to help.',
    name: 'occupancy-otp',
    revision: 1,
    slug: 'occupancy-otp',
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
  {
    body:
      'Dear *|nickname|*, \nThank you for using our service. Here are your payment details. \nDetails: \nAmount: $*|transactionPrice|* \nReceipt number: *|receiptNumber|*',
    name: 'payment-confirmation',
    revision: 1,
    slug: 'payment-confirmation',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThank you for using our service. Your listing is ready to be settled. Please make a payment [here.] (*|url|*) \nDetails: \nTotal cost: $*|totalCost|* \nAddress: *|address|*\nType: *|type|*',
    name: 'payment-reminder',
    revision: 1,
    slug: 'payment-reminder',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWelcome to Startup Inc.\nPlease verify your email address by clicking [here.] (*|url|*)',
    name: 'convx-registration',
    revision: 1,
    slug: 'registration',
    type: 'EMAIL',
  },
  {
    body:
      'Dear Startup Inc Admin, \nA callback has been requested. \nDetails: \nCallback phone number: *|phoneNumber|* \nWhat are you interested in? : *|transactionType|* \nYour name: *|nickname|* \nEmail: *|email|* \nPreferred callback date: *|callbackDate|* \nPreferred callback time: *|callbackTime|*',
    name: 'request-a-callback',
    revision: 1,
    slug: 'request-a-callback',
    type: 'EMAIL',
  },
  {
    body: 'Dear *|nickname|*, \n*|message|* \n[*|ctaButton|*] (*|ctaLink|*)',
    name: 'se-generic-action',
    revision: 1,
    slug: 'se-generic-action',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nCongratulations! The settlement of your purchase is now complete, and you are now the registered owner. \nThe document that records who owns the property is called an eCT (electronic Certificate of Title). If there is a mortgage on your property, your bank/lender will be the electronic controller of your eCT until the loan is repaid. \nIf there is no mortgage on your property, Startup Inc will be the electronic controller of your eCT unless we are instructed otherwise. \nStartup Inc will now notify council and water authorities that you are the new owner. \nIt is your responsibility to ensure that your other utility providers have now been notified. \nShould you require a copy of the adjustments and settlement statement or Startup Inc tax invoice, these can be accessed via [My documents] (*|url|*) . We recommend you download and save these for future reference. \nThanks for your business and please don’t hesitate to contact us if we can help with anything else down the track.',
    name: 'settlement-complete-buyer',
    revision: 1,
    slug: 'settlement-complete-buyer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nCongratulations! The settlement of your new property is now complete, and you are now the registered owner. \nThe document that records who owns the property is called an eCT (electronic Certificate of Title). If there is a mortgage on your property, your bank/lender will be the electronic controller of your eCT until the loan is repaid. \nIf there is no mortgage on your property, Startup Inc will be the electronic controller of your eCT unless we are instructed otherwise. \nStartup Inc will now notify council and water authorities that you are the new owner. \nIt is your responsibility to arrange the connection of utilities in your name. \nShould you require a copy of the registered plan, certificate of occupancy, adjustments, settlement statement or Startup Inc tax invoice, these can be accessed via [My documents] (*|url|*) . We recommend you download and save these for future reference. \nThanks for your business and please don’t hesitate to contact us if we can help with anything else down the track.',
    name: 'settlement-complete-otp',
    revision: 1,
    slug: 'settlement-complete-otp',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nCongratulations! The settlement of your sale is complete. \nStartup Inc will now notify council and water authorities that you no longer own the property. \nIt is your responsibility to close the accounts of your remaining utility providers. \nShould you require a copy of the adjustments and settlement statement or Startup Inc tax invoice, these can be accessed via [My documents] (*|url|*) . \nWe recommend you also download and save these documents for future reference. \nThanks for your business and please don’t hesitate to contact us if we can help with anything down the track.',
    name: 'settlement-complete-seller',
    revision: 1,
    slug: 'settlement-complete-seller',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nIt’s time to prepare for settlement, but before this happens, we need a few things from you. \n  *  You will receive an email from the State Revenue Office. It is important you follow the link in that email \nto review and approve the information we have provided. Settlement will not proceed until you complete \nthis step.   *  Please check [My documents] (*|url|*) for the following information and contact us if you have any questions or \nconcerns: \n  * funds required for settlement   * adjustments and settlement statement   * Startup Inc tax invoice \nFinal inspection \nAs a buyer, you are entitled to undertake a final inspection in the week before settlement. The purpose of this is to ensure that the property is in the same condition as when it was initially inspected by you. \nIt’s a good idea to conduct this inspection as close to settlement as possible. Things look a lot different without furniture! \nYou’ll save yourself a lot of stress if you test electrical devices such as garage roller doors, air conditioning/heating units, pool equipment, central vacuuming systems, security and the stove! And don’t forget to ask the real estate agent for user manuals. \nYou can do this inspection with the real estate agent or the seller. \nFinally, we encourage you to revisit the [Startup Inc Buyer’s Guide] (*|url|*) . \nAsk yourself, is your new property insured, have you connected your utilities, redirected your mail and arranged for the collection of your keys? Does your bank have everything they need to proceed to settlement? \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'settlement-details-buyer',
    revision: 1,
    slug: 'settlement-details-buyer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nIt’s time to prepare for settlement, but before this happens, we need a few things from you. \n  *  You will receive an email from the State Revenue Office. It is important you follow the link in that email to review and approve the information we have provided. Settlement will not proceed until you complete this step.   *  Please check [My documents] (*|url|*) for the following information and contact us if you have any questions or \nconcerns: \n  * funds required for settlement   * adjustments and settlement statement   * Startup Inc tax invoice \nFinal inspection \nAs a buyer, you are entitled to undertake one final inspection in the week before settlement. The purpose of this is to ensure that the property is in the condition as agreed in the Contract of Sale. \nIt’s a good idea to conduct this inspection as close to settlement as possible. \nYou can arrange this inspection with the selling agent or the seller. \nFinally, we encourage you to revisit the [Startup Inc Off The Plan Buyer’s Guide] (*|url|*) . \nAsk yourself, have you connected your utilities, redirected your mail and arranged for the collection of your key or handover pack? Does your bank have everything they need to proceed to settlement? \nHave you arranged for contents insurance and, if the property is to be tenanted, have you arranged for landlord’s insurance? \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'settlement-details-otp',
    revision: 1,
    slug: 'settlement-details-otp',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nIt’s time to prepare for settlement, but before this happens, we need a few things from you. \n  *  You will receive an email from the State Revenue Office. It is important you follow the link in that email \nto review and approve the information we have provided. Settlement will not proceed until you complete \nthis step.   *  Please check [My documents] (*|url|*) for the following information and contact us if you have any questions or \nconcerns: \n  * funds required for settlement   * adjustments and settlement statement   * real estate statement of account   * Startup Inc tax invoice \nReminders \nThe buyer is entitled to undertake a final inspection of the property in the week before settlement. The purpose of this is to ensure that the property is in the same condition as when it was initially inspected by them. \nWe encourage you to revisit the [Startup Inc Seller’s Guide] (*|url|*) - there is a lot to remember. \nHave you: \n  * arranged for the disconnection of all utilities   * organised mail redirection   * contacted your insurer to cancel your policy post-settlement   * cleared the property   * left full sets of keys and user manuals for the real estate agent to release at settlement. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'settlement-details-seller',
    revision: 1,
    slug: 'settlement-details-seller',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nThanks! We received everything we asked from you. \nPlease note, if any of your personal circumstances have changed since you first completed our Startup Inc \nBuyer’s Questionnaire, it’s important that you let us know as soon as possible as this can directly affect your settlement and the ownership of your property. \nWhat happens next? \nProperty enquiries \nWe will now conduct property searches and enquiries to double check the information in the Contract of Sale and Section 32 Vendor’s Statement is correct. \nFinance \nIf you are borrowing money to purchase the property, you must now let your bank/lender know that you have signed a Contract of Sale. \nIf you haven’t already, please don’t forget to let us know who your bank/lender is so we can invite them to settlement. \nIf you are not applying for finance, we will let you know how much you will be required to pay at settlement. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'settlement-preparation-buyer',
    revision: 1,
    slug: 'settlement-preparation-buyer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nCongratulations on the sale of your property! \nAlthough the property has now been sold, it is still yours until settlement. That’s why, for your own protection, we strongly recommend you remain fully insured right up until settlement. \nIt’s important to note that under your contract, your property must remain in the same condition as when the buyer first inspected the property. \nDischarge of Mortgage \nIf you have a mortgage on your property, Startup Inc will now: \n  * ask you to sign a mortgage discharge authority   * ask your bank/lender to prepare for settlement   * ask your bank/lender for the final payout figure. \nIf you don’t have a mortgage on your property, you don’t have to do anything else right now. \nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP. We are here to help.',
    name: 'settlement-preparation-seller',
    revision: 1,
    slug: 'settlement-preparation-seller',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nYour transaction has progressed to the next stage.\nDetails: \nAddress: *|address|* \nType: *|type|*',
    name: 'convx-statusupdate',
    revision: 1,
    slug: 'status-update',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nThank you for taking the time to tell us more about yourself during your recent online interview.\nCongratulations! We are delighted to invite you to join the Startup Inc community.\nPlease review and accept the independent contractor agreement and then [click here to complete your registration process] (*|url|*) .\nIf you have any questions, please do not hesitate to contact us on 1800-STARTUP— we are here to help.',
    name: 'successful-interview',
    revision: 1,
    slug: 'successful-interview',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nWe have now assigned a customer to your property settlement.\n*|nickname|* has been assigned to *|address|*',
    name: 'transaction-assigned-customer',
    revision: 1,
    slug: 'transaction-assigned-customer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nYour Startup Inc conveyancer will contact you soon. Please expect a call from *|conveyancer|*.',
    name: 'transaction-assignment',
    revision: 1,
    slug: 'transaction-assignment',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*,\nYou have been assigned *|address|*. Please call *|buyer|* to introduce yourself within 2 hours and prepare and upload the following: \n- Letter of Engagement\n- Client Authorisation Form\n- Costs Disclosure',
    name: 'transaction-assignment-conveyancer',
    revision: 1,
    slug: 'transaction-assignment-conveyancer',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nA new document has been uploaded. \nListing Details:\nAddress: *|address|*\nType: *|type|*',
    name: 'convx-uploadeddocument',
    revision: 1,
    slug: 'uploaded-document',
    type: 'EMAIL',
  },
  {
    body:
      'Dear *|nickname|*, \nAs a valued customer, we’re so happy to welcome you back to Startup Inc! \nPlease confirm your [customer details] (*|url|*) so we can get things started right away.',
    name: 'Welcome back',
    revision: 2,
    slug: 'welcome-back',
    type: 'EMAIL',
  },
]
