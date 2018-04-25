var pageSession = new ReactiveDict();

Template.PeopleEdit.onCreated(function() {
	
});

Template.PeopleEdit.onDestroyed(function() {
	
});

Template.PeopleEdit.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.PeopleEdit.events({
	
});

Template.PeopleEdit.helpers({
	
});

Template.PeopleEditForm.onCreated(function() {
	
});

Template.PeopleEditForm.onDestroyed(function() {
	
});

Template.PeopleEditForm.onRendered(function() {
	

	pageSession.set("peopleEditFormInfoMessage", "");
	pageSession.set("peopleEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
});

Template.PeopleEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("peopleEditFormInfoMessage", "");
		pageSession.set("peopleEditFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var peopleEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(peopleEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("peopleEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("people", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("peopleEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("peopleUpdate", t.data.people_selected._id, values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("people", mergeObjects(Router.currentRouteParams(), {}));
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.PeopleEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("peopleEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("peopleEditFormErrorMessage");
	}
	
});
