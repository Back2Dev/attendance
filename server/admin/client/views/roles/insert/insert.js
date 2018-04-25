var pageSession = new ReactiveDict();

Template.RolesInsert.onCreated(function() {
	
});

Template.RolesInsert.onDestroyed(function() {
	
});

Template.RolesInsert.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.RolesInsert.events({
	
});

Template.RolesInsert.helpers({
	
});

Template.RolesInsertForm.onCreated(function() {
	
});

Template.RolesInsertForm.onDestroyed(function() {
	
});

Template.RolesInsertForm.onRendered(function() {
	

	pageSession.set("rolesInsertFormInfoMessage", "");
	pageSession.set("rolesInsertFormErrorMessage", "");

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

Template.RolesInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("rolesInsertFormInfoMessage", "");
		pageSession.set("rolesInsertFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var rolesInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(rolesInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("rolesInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("roles", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("rolesInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("rolesInsert", values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
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

Template.RolesInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("rolesInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("rolesInsertFormErrorMessage");
	}
	
});
