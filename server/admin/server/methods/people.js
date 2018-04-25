Meteor.methods({
	"peopleInsert": function(data) {
		if(!People.userCanInsert(this.userId, data)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		return People.insert(data);
	},

	"peopleUpdate": function(id, data) {
		var doc = People.findOne({ _id: id });
		if(!People.userCanUpdate(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		People.update({ _id: id }, { $set: data });
	},

	"peopleRemove": function(id) {
		var doc = People.findOne({ _id: id });
		if(!People.userCanRemove(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		People.remove({ _id: id });
	}
});
