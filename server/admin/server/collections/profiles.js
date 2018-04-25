Profiles.allow({
	insert: function (userId, doc) {
		return Profiles.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Profiles.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Profiles.userCanRemove(userId, doc);
	}
});

Profiles.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Profiles.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Profiles.before.upsert(function(userId, selector, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	/*BEFORE_UPSERT_CODE*/
});

Profiles.before.remove(function(userId, doc) {
	
});

Profiles.after.insert(function(userId, doc) {
	
});

Profiles.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Profiles.after.remove(function(userId, doc) {
	
});
