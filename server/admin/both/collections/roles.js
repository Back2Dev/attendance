this.Roles = new Mongo.Collection("roles");

this.Roles.userCanInsert = function(userId, doc) {
	return true;
};

this.Roles.userCanUpdate = function(userId, doc) {
	return true;
};

this.Roles.userCanRemove = function(userId, doc) {
	return true;
};
