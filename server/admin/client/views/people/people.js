var pageSession = new ReactiveDict();

Template.People.onCreated(function() {
	
});

Template.People.onDestroyed(function() {
	
});

Template.People.onRendered(function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
});

Template.People.events({
	
});

Template.People.helpers({
	
});

var PeopleListItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("PeopleListSearchString");
	var sortBy = pageSession.get("PeopleListSortBy");
	var sortAscending = pageSession.get("PeopleListSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["pplname", "pplsurname", "ppllastatn", "pplavatar", "pplisvol", "pplissuper", "pplisadmin"];
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

var PeopleListExport = function(cursor, fileType) {
	var data = PeopleListItems(cursor);
	var exportFields = [];

	var str = exportArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}

Template.PeopleList.onCreated(function() {
	
});

Template.PeopleList.onDestroyed(function() {
	
});

Template.PeopleList.onRendered(function() {
	pageSession.set("PeopleListStyle", "table");
	
});

Template.PeopleList.events({
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
				pageSession.set("PeopleListSearchString", searchString);
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
					pageSession.set("PeopleListSearchString", searchString);
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
					pageSession.set("PeopleListSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("people.insert", mergeObjects(Router.currentRouteParams(), {}));
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		PeopleListExport(this.people, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		PeopleListExport(this.people, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		PeopleListExport(this.people, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		PeopleListExport(this.people, "json");
	}

	
});

Template.PeopleList.helpers({

	

	"isEmpty": function() {
		return !this.people || this.people.count() == 0;
	},
	"isNotEmpty": function() {
		return this.people && this.people.count() > 0;
	},
	"isNotFound": function() {
		return this.people && pageSession.get("PeopleListSearchString") && PeopleListItems(this.people).length == 0;
	},
	"searchString": function() {
		return pageSession.get("PeopleListSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("PeopleListStyle") == "table";
	},
	"viewAsBlog": function() {
		return pageSession.get("PeopleListStyle") == "blog";
	},
	"viewAsList": function() {
		return pageSession.get("PeopleListStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("PeopleListStyle") == "gallery";
	}

	
});


Template.PeopleListTable.onCreated(function() {
	
});

Template.PeopleListTable.onDestroyed(function() {
	
});

Template.PeopleListTable.onRendered(function() {
	
});

Template.PeopleListTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("PeopleListSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("PeopleListSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("PeopleListSortAscending") || false;
			pageSession.set("PeopleListSortAscending", !sortAscending);
		} else {
			pageSession.set("PeopleListSortAscending", true);
		}
	}
});

Template.PeopleListTable.helpers({
	"tableItems": function() {
		return PeopleListItems(this.people);
	}
});


Template.PeopleListTableItems.onCreated(function() {
	
});

Template.PeopleListTableItems.onDestroyed(function() {
	
});

Template.PeopleListTableItems.onRendered(function() {
	
});

Template.PeopleListTableItems.events({
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

		Meteor.call("peopleUpdate", this._id, values, function(err, res) {
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
						Meteor.call("peopleRemove", me._id, function(err, res) {
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
		Router.go("people.edit", mergeObjects(Router.currentRouteParams(), {customerId: this._id}));
		return false;
	}
});

Template.PeopleListTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }
	

	
});
