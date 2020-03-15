// methods that affect more than one collection:
import '/imports/api/methods'

// roles
import '/imports/api/members/methods'
import '/imports/api/members/server/publications'
// sessions
import '/imports/api/sessions/methods'
import '/imports/api/sessions/server/publications'

// parts
import '/imports/api/parts/methods'
import '/imports/api/parts/schema'
import '/imports/api/parts/server/publications'

// orders
import '/imports/api/orders/methods'
import '/imports/api/orders/schema'
import '/imports/api/orders/server/publications'

// Assessments
import '/imports/api/assessments/schema'
import '/imports/api/assessments/services'
import '/imports/api/assessments/serviceItems'
import '/imports/api/assessments/methods'
import '/imports/api/assessments/server/publications'

// Purchases
import '/imports/api/purchases/schema'
import '/imports/api/purchases/methods'
import '/imports/api/purchases/server/publications'

// Products
import '/imports/api/products/schema'
import '/imports/api/products/methods'
import '/imports/api/products/server/publications'

// Events
// import '/imports/api/events/schema'
// // import '/imports/api/events/methods'
// import '/imports/api/events/server/publications'

// Promos
import '/imports/api/promos/schema'
import '/imports/api/promos/methods'
import '/imports/api/promos/server/publications'

// Reports
import '/imports/api/reports/schema'
import '/imports/api/reports/methods'
import '/imports/api/reports/server/publications'

// WCCS
import '/imports/api/wwccs/schema'
import '/imports/api/wwccs/methods'
import '/imports/api/wwccs/server/publications'

// OrderEmails
import '/imports/api/orderemails/schema'
import '/imports/api/orderemails/methods'
import '/imports/api/orderemails/server/publications'

//users
import '/imports/api/users/server/publications'

//roles
import '/imports/api/roles/server/publications'

// Import all the things...
import './generated-pubs'
