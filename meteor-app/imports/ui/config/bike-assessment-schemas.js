export default [
    {
      stepTitle: 'Base Price',
      stepDescription: '',
      schema: {
        type: "object",
        title: "Select Base Service",
        properties: {}
      }
    },
    {
        stepTitle: 'Services',
        stepDescription: '',
        schema: {
          title: "Select Services",
          type: "object",
          properties: {
            assessor: { type: "string", title: "Assessor", enum: ["Mark", "Mike"]},
            bikeMake: { type: "string", title: "Bike Make" },
            bikeModel: { type: "string", title: "Bike Model" },
            bikeColor: { type: "string", title: "Bike Color" },
            approxBikeValue: { type: "integer", title: "Approx. Bike Value"},
            services: {type: "array", title: "Services", items: { 
              type: "number", 
              enum: [1, 2, 3], 
              enumNames:["New York","California","Dallas"]
          },
          uniqueItems: true
        }, 
            // TODO: array brought in from DB 
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
            "ui:widget": "updown"
          },
          services: {
              "ui:widget": "checkboxes"
          },
        }
      },
      {
        stepTitle: 'Parts',
        stepDescription: '',
        schema: {
          type: "object",
          title: "Select Parts",
          properties: {
            parts: {type: "array", title: "Parts", items: { 
              type: "number", 
              enum: [1, 2, 3], 
              enumNames:["Bike Part 1","Bike Part 2","Bike Part 3"]
          },
          uniqueItems: true
        }, 
            // TODO: array brought in from DB 
            comments: { type: "string", title: "Comments" },
            additionalFee: { type: "integer", title: "Enter additional fee if required (list reason in comments)" },
            replacementBike: { type: "boolean", title: "Replacement bike required?" },
            sentimentalValue: { type: "boolean", title: "Does bike have sentimental value?" },
            requestUrgent: { type: "boolean", title: "Is this request urgent?" },
            pickUpDate: {type: "string", title: "Pick-up Date"},
          },
        },
        uiSchema: {
          parts: {
            "ui:widget": "checkboxes"
          },
          comments: {
            "ui:widget": "textarea",
            "ui:placeholder": "Please enter any comments if there are any additional fees or services needed..",
            "ui:options": {
              "rows": 10
            }
          },
          additionalFee: {
            "ui:placeholder": "$Additional Fee",
            "ui:widget": "updown"
          },
          replacementBike: {
          },
          sentimentalValue: {
          },
          requestUrgent: {

          },
          pickUpDate: {
              "ui:widget": "alt-date"
          }
        }
      },
      {
        stepTitle: 'Review',
        stepDescription: '',
        schema: {
          type: "object",
          title: "",
          properties: {
          },
        },
        uiSchema: {
          },
      },
      {
        stepTitle: 'Customer Details',
        stepDescription: '',
        schema: {
          type: "object",
          title: "Enter Customer Details",
           properties: {
    
          },
        },
        uiSchema: {
    
          },
      } 
]
