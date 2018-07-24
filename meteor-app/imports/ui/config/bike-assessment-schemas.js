export default [{
    stepTitle: 'Base Service',
    stepDescription: '',
    schema: {
      type: "object",
      title: "",
      properties: {
        package: {
          type: "string",
          enum: ["Minor Service Package", "Major Service Package"]
        }
      }
    },
    uiSchema: {
      package: {
        "ui:widget": "hidden"
      }
    }
  },
  {
    stepTitle: 'Services',
    stepDescription: '',
    schema: {
      title: "Select Services",
      type: "object",
      required: ['assessor', 'bikeMake', 'bikeColor', 'approxBikeValue'],
      properties: {
        assessor: {
          type: "string",
          title: "Assessor",
          enum: ["Mark", "Mike", ""],
          default: ""
        },
        bikeMake: {
          type: "string",
          title: "Bike Make"
        },
        bikeModel: {
          type: "string",
          title: "Bike Model"
        },
        bikeColor: {
          type: "string",
          title: "Bike Color"
        },
        approxBikeValue: {
          type: "integer",
          title: "Approx. Bike Value"
        },
        services: {
          type: "array",
          title: "Services",
          items: {
            type: "string",
            enum: [" Service 1", " Service 2", " Service 3"]
          },
          uniqueItems: true
        },
        serviceCost: {
          type: "integer",
          title: "Total Service Cost"
        }
      }
    },
    uiSchema: {
      assessor: {
        "ui:placeholder": "Who is doing the assessment?",
        "ui:autoFocus": true,
      },

      bikeMake: {
        "ui:placeholder": "Bike make..",
        "ui:autoFocus": true,
      },
      bikeModel: {
        "ui:placeholder": "Bike model..",
        "ui:autoFocus": true,
      },
      bikeColor: {
        "ui:placeholder": "Bike color..",
        "ui:autoFocus": true,
      },
      approxBikeValue: {
        "ui:placeholder": "$Approx. price",
        "ui:widget": "updown",
        classNames: "currency" 
      },
      services: {
        "ui:widget": "checkboxes"
      },
      serviceCost: {
        "ui:widget": "hidden"
      }
    }
  },
  {
    stepTitle: 'Parts',
    stepDescription: '',
    schema: {
      type: "object",
      title: "Select Parts",
      required: ['pickUpDate'],
      properties: {
        parts: {
          type: "array",
          title: "Parts",
          items: {
            type: "string",
            enum: [" Bike Part 1", " Bike Part 2", " Bike Part 3"],
          },
          uniqueItems: true
        },
        partsCost: {
          type: "integer",
          title: "Total Parts Cost"
        },
        comments: {
          type: "string",
          title: "Comments"
        },
        additionalFee: {
          type: "integer",
          title: "Enter additional fee if required (list reason in comments)"
        },
        replacementBike: {
          type: "boolean",
          title: "Replacement bike required?"
        },
        sentimentalValue: {
          type: "boolean",
          title: "Does bike have sentimental value?"
        },
        requestUrgent: {
          type: "boolean",
          title: "Is this request urgent?"
        },
        pickUpDate: {
          type: "string",
          title: "Pick-up Date",
          format: "date",
          default: "2018-10-10"
        },
      },
    },
    uiSchema: {
      parts: {
        "ui:widget": "checkboxes"
      },
      partsCost: {
        "ui:widget": "hidden"
      },
      comments: {
        "ui:widget": "textarea",
        "ui:placeholder": "Please enter any comments if there are any additional fees or services needed..",
        "ui:options": {
          "rows": 10
        }
      },
      additionalFee: {
        classNames: "currency",
        "ui:placeholder": "$Additional Fee",
        "ui:widget": "updown"
      },
      replacementBike: {},
      sentimentalValue: {},
      requestUrgent: {

      },
    }
  },
  {
    stepTitle: 'Review',
    stepDescription: '',
    schema: {
      type: "object",
      title: "",
      properties: {},
    },
    uiSchema: {},
  },
  {
    stepTitle: 'Customer Details',
    stepDescription: '',
    schema: {
      type: "object",
      title: "Enter Customer Details",
      properties: {
        b2bRefurbish: {
          type: "boolean",
          title: "Is this bike being refurbished by Back 2 Bikes?",
          default: false
        },
      },
      dependencies: {
        b2bRefurbish: {
          "oneOf": [
            {
              properties: {
                b2bRefurbish: { enum: [true, ""] }
              }
            },
            {
              properties: {
                b2bRefurbish: { enum: [false] },
                name: {
                  type: "string",
                  title: "Name"
                },
                phone: {
                  type: "string",
                  title: "Phone Number"
                },
                email: {
                  type: "string",
                  title: "Email"
                },
              },
              required: ["name", "phone", "email"]
            }
          ]
        }
      }
    },
    uiSchema: {
      b2bRefurbish: {},
      name: {},
      phone: {},
      email: {
        "ui:widget": "email"
      }
    },
  }
]
