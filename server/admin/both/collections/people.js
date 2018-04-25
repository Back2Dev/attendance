this.People = new Mongo.Collection("people");

this.People.userCanInsert = function(userId, doc) {
	return true;
};

this.People.userCanUpdate = function(userId, doc) {
	return true;
};

this.People.userCanRemove = function(userId, doc) {
	return true;
};
