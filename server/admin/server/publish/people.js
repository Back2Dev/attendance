Meteor.publish("people", function() {
	return People.find({}, {});
});

Meteor.publish("people_empty", function() {
	return People.find({_id:null}, {});
});

Meteor.publish("people_selected", function(customerId) {
	return People.find({_id:customerId}, {});
});

