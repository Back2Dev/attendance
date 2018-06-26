export default [
  {
    stepTitle: 'About You',
    stepDescription: '',
    schema: {
      type: "object",
      title: "Lets get to know each other.",
      // required: ["bikesHousehold", "reasons"],
      properties: {
        bikesHousehold: { type: "number", title: "How many bikes in your household?" },
        primaryBike: { type: "string", title: "What type of bike do you ride the most?", enum: ["Road/racer", "Hybrid", "Mountain", "Cruiser", "Ladies", "Gents", "Fixie/Single Speed"] },
        workStatus: { type: "string", title: "Work status", enum: ["Full Time", "Part Time", "Pension/Disability", "Unemployed", "Student", "Retired"] },
        reasons: { type: "string", title: "Reasons for volunteering" }
      }
    },
    uiSchema: {
      bikesHousehold: {
        "ui:widget": "updown",
        "ui:placeholder": "Enter the number of bikes you own",
        "ui:autofocus": true,
      },
      primaryBike: {
        "ui:widget": "select",
        "ui:placeholder": "Select a type of bike",
      },
      workStatus: {
        "ui:widget": "select",
        "ui:placeholder": "Select your employment status",
      },
      reasons: {
        "ui:widget": "textarea",
        "ui:placeholder": "Some good starting points:\nWhat makes you want to to volunteer at Back2Bikes?\nHave you ever done any other volunteering before?\nHave you worked on bikes or something similar before?",
        "ui:options": {
          "rows": 12
        }
      }
    }
  },
  {
    stepTitle: 'Contact',
    stepDescription: '',
    schema: {
      title: "Details",
      type: "object",
      required: ["name", "pin"],
      properties: {
        name: { type: "string", title: "Name" },
        email: { type: "string", format: "email", title: "Email" },
        addressStreet: { type: "string", title: "Street Address" },
        addressSuburb: { type: "string", title: "Suburb" },
        addressState: { type: "string", title: "State", default: "VIC", enum: ["VIC", "NSW", "SA", "QLD", "NT", "WA", "TAS"] },
        addressPostcode: { type: "number", title: "Postcode" },
        phone: { type: "string", title: "Phone number" },
        mobile: { type: "string", title: "Mobile number" },
        pin: { type: "string", title: "PIN number" },
        pinConfirm: { type: "string", title: "PIN number" },
      }
    },
    uiSchema: {
      name: {
        "ui:placeholder": "Enter your name",
        "ui:autofocus": true,
      },
      
      email: {
        "ui:placeholder": "Enter your email address",

      },
      addressStreet: {
        "ui:placeholder": "Enter your street address e.g. 12 Luck Street",

      },
      addressSuburb: {
        "ui:placeholder": "Enter your suburb",

      },
      addressState: {
        "ui:placeholder": "Enter your state",
      },
      addressPostcode: {
        "ui:placeholder": "Enter your postcode",
      },
      phone: {
        "ui:placeholder": "Enter your phone number",
        "ui:options": {
          inputType: 'tel'
        }
      },
      mobile: {
        "ui:placeholder": "Enter your mobile number",
        "ui:options": {
          inputType: 'tel'
        }
      },
      pin: {
        "ui:placeholder": "Enter a PIN number for signing in and out.",
        "ui:options": {
          inputType: 'password'
        }
      },
      pinConfirm: {
        "ui:placeholder": "Enter the same PIN number again to confirm.",
        "ui:options": {
          inputType: 'password'
        }
      },
    }
  },
  {
    stepTitle: 'Emergency',
    stepDescription: '',
    schema: {
      type: "object",
      title: "Who should we contact in an emergency?",
      // required: ["emergencyContact"],
      properties: {
        emergencyContact: { type: "string", title: "Emergency Contact Name" },
        emergencyEmail: { type: "string", title: "Emergency Contact Email" },
        emergencyPhone: { type: "string", title: "Emergency Contact Mobile number" },
      },
    },
    uiSchema: {
      emergencyContact: {
        "ui:placeholder": "Enter your emergency contact's full name",
        "ui:autofocus": true,
      },
      emergencyEmail: {
        "ui:placeholder": "Enter your emergency contact's email"
      },
      emergencyPhone: {
        "ui:placeholder": "Enter your emergency contact's mobile or phone number",
        "ui:options": {
          inputType: 'tel'
        }
      },
    }
  },
  {
    stepTitle: 'Avatar',
    stepDescription: '',
    schema: {
      type: "object",
      title: "Choose an avatar",
      // required: ["emergencyContact"],
      properties: {
        avatar: {
          type: "string",
          title: "Avatar",
          default: "default.jpg",
          enum: ["default.jpg", "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg"],
          enumNames: ["default", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"]
        },
      },
    },
    uiSchema: {
      avatar: {
        "ui:widget": "avatarWidget",
        "ui:options": {
          label: false
        }
      },
    }
  }
]
