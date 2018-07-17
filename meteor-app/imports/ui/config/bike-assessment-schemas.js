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
            services: { type: "string", title: "Services", enum: ['test1', 'test2', 'test3']}, 
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
              "ui:widget": "select"
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
            parts: { type: "string", enum: [] }, 
            // TODO: array brought in from DB 
            comments: { type: "string", title: "Comments" },
            additionalFee: { type: "integer", title: "Enter additional fee if required (list reason in comments)" },
            replacementBike: { type: "boolean", title: "Replacement bike required?" },
            sentimentalValue: { type: "boolean", title: "Does bike have sentimental value?" },
            pickUpDate: {type: "string", title: "Pick-up Date"},
            requestUrgent: { type: "string", title: "Is this request urgent?" },
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
          pickUpDate: {
              "ui:widget": "alt-date"
          },
          requestUrgent: {
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
