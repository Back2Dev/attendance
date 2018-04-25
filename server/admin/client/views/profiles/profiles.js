var pageSession = new ReactiveDict();

Template.Profiles.onCreated(function() {
	
});

Template.Profiles.onDestroyed(function() {
	
});

Template.Profiles.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.Profiles.events({
	
});

Template.Profiles.helpers({
	
});

var ProfilesListItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ProfilesListSearchString");
	var sortBy = pageSession.get("ProfilesListSortBy");
	var sortAscending = pageSession.get("ProfilesListSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "userids", "createdat", "email"];
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

var ProfilesListExport = function(cursor, fileType) {
	var data = ProfilesListItems(cursor);
	var exportFields = [];

	var str = exportArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}

Template.ProfilesList.onCreated(function() {
	
});

Template.ProfilesList.onDestroyed(function() {
	
});

Template.ProfilesList.onRendered(function() {
	pageSession.set("ProfilesListStyle", "table");
	
});

Template.ProfilesList.events({
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
				pageSession.set("ProfilesListSearchString", searchString);
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
					pageSession.set("ProfilesListSearchString", searchString);
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
					pageSession.set("ProfilesListSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("profiles.insert", mergeObjects(Router.currentRouteParams(), {}));
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ProfilesListExport(this.profiles, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ProfilesListExport(this.profiles, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ProfilesListExport(this.profiles, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ProfilesListExport(this.profiles, "json");
	}

	
});

Template.ProfilesList.helpers({

	

	"isEmpty": function() {
		return !this.profiles || this.profiles.count() == 0;
	},
	"isNotEmpty": function() {
		return this.profiles && this.profiles.count() > 0;
	},
	"isNotFound": function() {
		return this.profiles && pageSession.get("ProfilesListSearchString") && ProfilesListItems(this.profiles).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ProfilesListSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ProfilesListStyle") == "table";
	},
	"viewAsBlog": function() {
		return pageSession.get("ProfilesListStyle") == "blog";
	},
	"viewAsList": function() {
		return pageSession.get("ProfilesListStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ProfilesListStyle") == "gallery";
	}

	
});


Template.ProfilesListTable.onCreated(function() {
	
});

Template.ProfilesListTable.onDestroyed(function() {
	
});

Template.ProfilesListTable.onRendered(function() {
	
});

Template.ProfilesListTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ProfilesListSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ProfilesListSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ProfilesListSortAscending") || false;
			pageSession.set("ProfilesListSortAscending", !sortAscending);
		} else {
			pageSession.set("ProfilesListSortAscending", true);
		}
	}
});

Template.ProfilesListTable.helpers({
	"tableItems": function() {
		return ProfilesListItems(this.profiles);
	}
});


Template.ProfilesListTableItems.onCreated(function() {
	
});

Template.ProfilesListTableItems.onDestroyed(function() {
	
});

Template.ProfilesListTableItems.onRendered(function() {
	
});

Template.ProfilesListTableItems.events({
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

		Meteor.call("profilesUpdate", this._id, values, function(err, res) {
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
						Meteor.call("profilesRemove", me._id, function(err, res) {
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
		Router.go("profiles.edit", mergeObjects(Router.currentRouteParams(), {customerId: this._id}));
		return false;
	}
});

Template.ProfilesListTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }
	

	
});
