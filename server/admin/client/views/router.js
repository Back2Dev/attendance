Router.configure({
	templateNameConverter: "upperCamelCase",
	routeControllerNameConverter: "upperCamelCase",
	layoutTemplate: "layout",
	notFoundTemplate: "notFound",
	loadingTemplate: "loading"
});

Router.freeRoutes = [
	"home",
	"people",
	"people.insert",
	"people.edit",
	"roles",
	"roles.insert",
	"roles.edit",
	"profiles",
	"profiles.insert",
	"profiles.edit"
];

Router.defaultFreeRoute = "home";

Router.onBeforeAction(function() {
	// loading indicator here
	if(!this.ready()) {
		this.render('loading');
		$("body").addClass("wait");
	} else {
		$("body").removeClass("wait");
		this.next();
	}
});

Router.map(function () {
	
	this.route("/", {name: "home", controller: "HomeController"});
	this.route("/people", {name: "people", controller: "PeopleController"});
	this.route("/people/insert", {name: "people.insert", controller: "PeopleInsertController"});
	this.route("/people/edit/:customerId", {name: "people.edit", controller: "PeopleEditController"});
	this.route("/roles", {name: "roles", controller: "RolesController"});
	this.route("/roles/insert", {name: "roles.insert", controller: "RolesInsertController"});
	this.route("/roles/edit/:customerId", {name: "roles.edit", controller: "RolesEditController"});
	this.route("/profiles", {name: "profiles", controller: "ProfilesController"});
	this.route("/profiles/insert", {name: "profiles.insert", controller: "ProfilesInsertController"});
	this.route("/profiles/edit/:customerId", {name: "profiles.edit", controller: "ProfilesEditController"});
});
