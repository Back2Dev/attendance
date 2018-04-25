Meteor.publish("profiles", function() {
	return Profiles.find({}, {});
});

Meteor.publish("profiles_empty", function() {
	return Profiles.find({_id:null}, {});
});

Meteor.publish("profiles_selected", function(customerId) {
	return Profiles.find({_id:customerId}, {});
});

