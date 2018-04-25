Template.Home.onCreated(function() {
	
});

Template.Home.onDestroyed(function() {
	
});

Template.Home.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.Home.events({
	
});

Template.Home.helpers({
	
});

Template.HomeJumbotron.onCreated(function() {
	
});

Template.HomeJumbotron.onDestroyed(function() {
	
});

Template.HomeJumbotron.onRendered(function() {
	
});

Template.HomeJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("", {});
	}
	
});

Template.HomeJumbotron.helpers({
	
});
