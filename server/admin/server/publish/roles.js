Meteor.publish("roles", function() {
	return Roles.find({}, {});
});

Meteor.publish("roles_empty", function() {
	return Roles.find({_id:null}, {});
});

Meteor.publish("roles_selected", function(customerId) {
	return Roles.find({_id:customerId}, {});
});

