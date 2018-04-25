Meteor.methods({
	"profilesInsert": function(data) {
		if(!Profiles.userCanInsert(this.userId, data)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		return Profiles.insert(data);
	},

	"profilesUpdate": function(id, data) {
		var doc = Profiles.findOne({ _id: id });
		if(!Profiles.userCanUpdate(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Profiles.update({ _id: id }, { $set: data });
	},

	"profilesRemove": function(id) {
		var doc = Profiles.findOne({ _id: id });
		if(!Profiles.userCanRemove(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Profiles.remove({ _id: id });
	}
});
