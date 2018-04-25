this.Profiles = new Mongo.Collection("profiles");

this.Profiles.userCanInsert = function(userId, doc) {
	return true;
};

this.Profiles.userCanUpdate = function(userId, doc) {
	return true;
};

this.Profiles.userCanRemove = function(userId, doc) {
	return true;
};
