var pageSession = new ReactiveDict();

Template.RolesEdit.onCreated(function() {
	
});

Template.RolesEdit.onDestroyed(function() {
	
});

Template.RolesEdit.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.RolesEdit.events({
	
});

Template.RolesEdit.helpers({
	
});

Template.RolesEditForm.onCreated(function() {
	
});

Template.RolesEditForm.onDestroyed(function() {
	
});

Template.RolesEditForm.onRendered(function() {
	

	pageSession.set("rolesEditFormInfoMessage", "");
	pageSession.set("rolesEditFormErrorMessage", "");

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

Template.RolesEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("rolesEditFormInfoMessage", "");
		pageSession.set("rolesEditFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var rolesEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(rolesEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("rolesEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("roles", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("rolesEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("rolesUpdate", t.data.roles_selected._id, values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("roles", mergeObjects(Router.currentRouteParams(), {}));
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

Template.RolesEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("rolesEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("rolesEditFormErrorMessage");
	}
	
});
