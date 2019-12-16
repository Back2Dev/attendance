export default [
  {
    stepTitle: 'Base Service',
    stepDescription: '',
    schema: {
      type: 'object',
      title: '',
      properties: {
        package: {
          type: 'string',
          enum: ['Minor Service', 'Major Service']
        }
      }
    },
    uiSchema: {
      package: {
        'ui:widget': 'hidden'
      }
    }
  },
  {
    stepTitle: 'Services',
    stepDescription: '',
    schema: {
      title: 'Select Services',
      type: 'object',
      required: ['assessor', 'bikeMake', 'bikeColor', 'approxBikeValue'],
      properties: {
        assessor: {
          type: 'string',
          title: 'Assessor',
          default: ''
        },
        bikeMake: {
          type: 'string',
          title: 'Bike Make'
        },
        bikeModel: {
          type: 'string',
          title: 'Bike Model'
        },
        bikeColor: {
          type: 'string',
          title: 'Bike Color'
        },
        approxBikeValue: {
          type: 'integer',
          title: 'Approx. Bike Value'
        },
        services: {
          type: 'array',
          title: 'Services',
          items: {
            type: 'string',
            enum: [' Service 1', ' Service 2', ' Service 3']
          },
          uniqueItems: true
        },
        serviceCost: {
          type: 'integer',
          title: 'Total Service Cost'
        }
      }
    },
    uiSchema: {
      assessor: {
        'ui:placeholder': 'Who is doing the assessment?',
        'ui:autoFocus': true
      },

      bikeMake: {
        'ui:placeholder': 'Bike make..',
        'ui:autoFocus': true
      },
      bikeModel: {
        'ui:placeholder': 'Bike model..',
        'ui:autoFocus': true
      },
      bikeColor: {
        'ui:placeholder': 'Bike color..',
        'ui:autoFocus': true
      },
      approxBikeValue: {
        'ui:placeholder': '$Approx. price',
        'ui:widget': 'updown',
        classNames: 'currency'
      },
      services: {
        'ui:widget': 'checkboxes'
      },
      serviceCost: {
        'ui:widget': 'hidden'
      }
    }
  },
  {
    stepTitle: 'Parts',
    stepDescription: '',
    schema: {
      type: 'object',
      required: ['additionalFee', 'discount'],
      title: 'Select Parts',
      properties: {
        parts: {
          type: 'array',
          title: 'Parts',
          items: {
            type: 'string',
            enum: [' Bike Part 1', ' Bike Part 2', ' Bike Part 3']
          },
          uniqueItems: true
        },
        partsCost: {
          type: 'integer',
          title: 'Total Parts Cost'
        },
        comments: {
          type: 'string',
          title: 'Comments'
        },
        additionalFee: {
          type: 'integer',
          title: 'Enter additional cost if required (list reason in comments)'
        },
        discount: {
          type: 'integer',
          title: 'Discount'
        },
        discountReason: {
          type: 'string',
          title: 'Reason for discount'
        }
      }
    },
    uiSchema: {
      parts: {
        'ui:widget': 'checkboxes'
      },
      partsCost: {
        'ui:widget': 'hidden'
      },
      comments: {
        'ui:widget': 'textarea',
        'ui:placeholder': 'Please enter any comments if there are any additional fees or services needed..',
        'ui:options': {
          rows: 10
        }
      },
      additionalFee: {
        classNames: 'currency',
        'ui:placeholder': '$Additional Cost',
        'ui:widget': 'updown'
      },
      discount: {
        classNames: 'currency',
        'ui:placeholder': '$Discount',
        'ui:widget': 'updown'
      }
    }
  },

  {
    stepTitle: 'Review',
    stepDescription: '',
    schema: {
      type: 'object',
      title: '',
      properties: {}
    },
    uiSchema: {}
  },
  {
    stepTitle: 'Customer Details',
    stepDescription: '',
    schema: {
      type: 'object',
      title: 'Enter Customer Details',
      properties: {
        isRefurbish: {
          type: 'boolean',
          title: 'Is this bike being refurbished?',
          default: false
        },
        // *** Notes for Pat: ***
        // The fields
        //   - name
        //   - phone
        //   - replacementBike
        //   - sentimentalValue
        //   - requestUrgent
        // don't appear at this point in this schema, although they do appear
        // they do appear below in 'dependencies'. The UI works ok,
        // but the generated input fields don't have id's on the fields, so
        // the tests don't work.
        //
        // We can add them in here, like this:
        // name: {type: 'string'},  // One of these for each of the above
        //
        // This fixes the id problem, but I'm not sure what this
        // does to the UI, as these fields don't need to appear for a refurb
        //
        // There is, however a case where we are doing a refurb for a customer
        // - basically they are buying a bike that isn't fixed yet
        // - in this case they are not paying for the repairs, they
        // will be paying for the bike (probably more than the cost of the repairs)
        // So I think it's ok that these fields are still shown. Ideally we should
        // have some kind of indicator to tell the user that these fields don't apply
        //
        // Documentation reference: https://github.com/nilportugues/react-jsonschema-form-semanticui#property-dependencies
        //
        name: {
          type: 'string'
        },
        pickUpDate: {
          type: 'string',
          title: 'Pick-up Date',
          format: 'date',
          default: '2018-10-10'
        }
      },
      dependencies: {
        isRefurbish: {
          oneOf: [
            {
              properties: {
                isRefurbish: { enum: [true, ''] }
              }
            },
            {
              properties: {
                isRefurbish: { enum: [false] },
                name: {
                  type: 'string',
                  title: 'Name'
                },
                phone: {
                  type: 'string',
                  title: 'Phone Number'
                },
                email: {
                  type: 'string',
                  title: 'Email'
                },
                replacementBike: {
                  type: 'boolean',
                  title: 'Replacement bike required?',
                  default: false
                },
                sentimentalValue: {
                  type: 'boolean',
                  title: 'Does bike have sentimental value?',
                  default: false
                },
                requestUrgent: {
                  type: 'boolean',
                  title: 'Is this request urgent?',
                  default: false
                }
              },
              anyOf: [
                { required: ['name', 'phone'] },
                { required: ['name', 'phone', 'email'] },
                { required: ['name', 'email'] }
              ]
            }
          ]
        }
      }
    },
    uiSchema: {
      isRefurbish: {},
      name: {},
      phone: {},
      email: {
        'ui:widget': 'email'
      },
      replacementBike: {},
      sentimentalValue: {},
      requestUrgent: {}
    }
  }
]
