var pageSession = new ReactiveDict();

Template.PeopleInsert.onCreated(function() {
	
});

Template.PeopleInsert.onDestroyed(function() {
	
});

Template.PeopleInsert.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.PeopleInsert.events({
	
});

Template.PeopleInsert.helpers({
	
});

Template.PeopleInsertForm.onCreated(function() {
	
});

Template.PeopleInsertForm.onDestroyed(function() {
	
});

Template.PeopleInsertForm.onRendered(function() {
	

	pageSession.set("peopleInsertFormInfoMessage", "");
	pageSession.set("peopleInsertFormErrorMessage", "");

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

Template.PeopleInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("peopleInsertFormInfoMessage", "");
		pageSession.set("peopleInsertFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var peopleInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(peopleInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("peopleInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("people", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("peopleInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("peopleInsert", values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
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

Template.PeopleInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("peopleInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("peopleInsertFormErrorMessage");
	}
	
});
