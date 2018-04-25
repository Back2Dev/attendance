Template.notFound.onCreated(function() {
	/*TEMPLATE_CREATED_CODE*/
});

Template.notFound.onDestroyed(function() {
	/*TEMPLATE_DESTROYED_CODE*/
});

Template.notFound.onRendered(function() {
	/*TEMPLATE_RENDERED_CODE*/
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.notFound.events({

});

Template.notFound.helpers({

});
