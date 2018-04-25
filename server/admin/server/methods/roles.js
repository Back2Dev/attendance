Meteor.methods({
	"rolesInsert": function(data) {
		if(!Roles.userCanInsert(this.userId, data)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		return Roles.insert(data);
	},

	"rolesUpdate": function(id, data) {
		var doc = Roles.findOne({ _id: id });
		if(!Roles.userCanUpdate(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Roles.update({ _id: id }, { $set: data });
	},

	"rolesRemove": function(id) {
		var doc = Roles.findOne({ _id: id });
		if(!Roles.userCanRemove(this.userId, doc)) {
			throw new Meteor.Error(403, "Forbidden.");
		}

		Roles.remove({ _id: id });
	}
});
