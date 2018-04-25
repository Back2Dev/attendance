var pageSession = new ReactiveDict();

Template.ProfilesEdit.onCreated(function() {
	
});

Template.ProfilesEdit.onDestroyed(function() {
	
});

Template.ProfilesEdit.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.ProfilesEdit.events({
	
});

Template.ProfilesEdit.helpers({
	
});

Template.ProfilesEditForm.onCreated(function() {
	
});

Template.ProfilesEditForm.onDestroyed(function() {
	
});

Template.ProfilesEditForm.onRendered(function() {
	

	pageSession.set("profilesEditFormInfoMessage", "");
	pageSession.set("profilesEditFormErrorMessage", "");

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

Template.ProfilesEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("profilesEditFormInfoMessage", "");
		pageSession.set("profilesEditFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var profilesEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(profilesEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("profilesEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("profiles", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("profilesEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("profilesUpdate", t.data.profiles_selected._id, values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
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

Template.ProfilesEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("profilesEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("profilesEditFormErrorMessage");
	}
	
});
