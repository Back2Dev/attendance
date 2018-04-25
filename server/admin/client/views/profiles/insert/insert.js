var pageSession = new ReactiveDict();

Template.ProfilesInsert.onCreated(function() {
	
});

Template.ProfilesInsert.onDestroyed(function() {
	
});

Template.ProfilesInsert.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.ProfilesInsert.events({
	
});

Template.ProfilesInsert.helpers({
	
});

Template.ProfilesInsertForm.onCreated(function() {
	
});

Template.ProfilesInsertForm.onDestroyed(function() {
	
});

Template.ProfilesInsertForm.onRendered(function() {
	

	pageSession.set("profilesInsertFormInfoMessage", "");
	pageSession.set("profilesInsertFormErrorMessage", "");

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

Template.ProfilesInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("profilesInsertFormInfoMessage", "");
		pageSession.set("profilesInsertFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var profilesInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(profilesInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("profilesInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("profiles", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("profilesInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("profilesInsert", values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("profiles", mergeObjects(Router.currentRouteParams(), {}));
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

Template.ProfilesInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("profilesInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("profilesInsertFormErrorMessage");
	}
	
});
