Roles.allow({
	insert: function (userId, doc) {
		return Roles.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Roles.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Roles.userCanRemove(userId, doc);
	}
});

Roles.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Roles.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Roles.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Roles.before.remove(function(userId, doc) {
	
});

Roles.after.insert(function(userId, doc) {
	
});

Roles.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Roles.after.remove(function(userId, doc) {
	
});
