var pageSession = new ReactiveDict();

Template.Roles.onCreated(function() {
	
});

Template.Roles.onDestroyed(function() {
	
});

Template.Roles.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.Roles.events({
	
});

Template.Roles.helpers({
	
});

var RolesListItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("RolesListSearchString");
	var sortBy = pageSession.get("RolesListSortBy");
	var sortAscending = pageSession.get("RolesListSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "role", "programid", "profilefields", "email"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var RolesListExport = function(cursor, fileType) {
	var data = RolesListItems(cursor);
	var exportFields = [];

	var str = exportArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}

Template.RolesList.onCreated(function() {
	
});

Template.RolesList.onDestroyed(function() {
	
});

Template.RolesList.onRendered(function() {
	pageSession.set("RolesListStyle", "table");
	
});

Template.RolesList.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("RolesListSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("RolesListSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("RolesListSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("roles.insert", mergeObjects(Router.currentRouteParams(), {}));
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		RolesListExport(this.roles, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		RolesListExport(this.roles, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		RolesListExport(this.roles, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		RolesListExport(this.roles, "json");
	}

	
});

Template.RolesList.helpers({

	

	"isEmpty": function() {
		return !this.roles || this.roles.count() == 0;
	},
	"isNotEmpty": function() {
		return this.roles && this.roles.count() > 0;
	},
	"isNotFound": function() {
		return this.roles && pageSession.get("RolesListSearchString") && RolesListItems(this.roles).length == 0;
	},
	"searchString": function() {
		return pageSession.get("RolesListSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("RolesListStyle") == "table";
	},
	"viewAsBlog": function() {
		return pageSession.get("RolesListStyle") == "blog";
	},
	"viewAsList": function() {
		return pageSession.get("RolesListStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("RolesListStyle") == "gallery";
	}

	
});


Template.RolesListTable.onCreated(function() {
	
});

Template.RolesListTable.onDestroyed(function() {
	
});

Template.RolesListTable.onRendered(function() {
	
});

Template.RolesListTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("RolesListSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("RolesListSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("RolesListSortAscending") || false;
			pageSession.set("RolesListSortAscending", !sortAscending);
		} else {
			pageSession.set("RolesListSortAscending", true);
		}
	}
});

Template.RolesListTable.helpers({
	"tableItems": function() {
		return RolesListItems(this.roles);
	}
});


Template.RolesListTableItems.onCreated(function() {
	
});

Template.RolesListTableItems.onDestroyed(function() {
	
});

Template.RolesListTableItems.onRendered(function() {
	
});

Template.RolesListTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Meteor.call("rolesUpdate", this._id, values, function(err, res) {
			if(err) {
				alert(err.message);
			}
		});

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Meteor.call("rolesRemove", me._id, function(err, res) {
							if(err) {
								alert(err.message);
							}
						});
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("roles.edit", mergeObjects(Router.currentRouteParams(), {customerId: this._id}));
		return false;
	}
});

Template.RolesListTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }
	

	
});
