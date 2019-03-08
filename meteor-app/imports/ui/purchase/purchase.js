// This component will use withTracker

import { withTracker } from 'meteor/react-meteor-data'
import PurchaseOptions from '/imports/ui/purchase/purchase-option-card'

export default withTracker(props => {})(PurchaseOptions)