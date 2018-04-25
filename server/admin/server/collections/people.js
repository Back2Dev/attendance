People.allow({
	insert: function (userId, doc) {
		return People.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return People.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return People.userCanRemove(userId, doc);
	}
});

People.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

People.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

People.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

People.before.remove(function(userId, doc) {
	
});

People.after.insert(function(userId, doc) {
	
});

People.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

People.after.remove(function(userId, doc) {
	
});
