this.simulatingAnonymous = function() {
  return Meteor.userId() && Meteor.user() && Users.isAdmin(Meteor.userId()) && Session.get("simulateAnonymous");
};

this.getCurrentZone = function() {
  return Meteor.userId() && Meteor.user() && !simulatingAnonymous() ? "private": "public";
};

Router.publicRoutes = Router.publicRoutes || [];

Router.privateRoutes = Router.privateRoutes || [];

Router.freeRoutes = Router.freeRoutes || [];

Router.roleMap = Router.roleMap || [];

Router.defaultFreeRoute = Router.defaultFreeRoute || "";
Router.defaultPublicRoute = Router.defaultPublicRoute || "";
Router.defaultPrivateRoute = Router.defaultPrivateRoute || "";

Router.firstGrantedRoute = function(preferredRoute) {
	if(preferredRoute && Router.routeGranted(preferredRoute)) return preferredRoute;

	var grantedRoute = "";

	_.every(Router.privateRoutes, function(route) {
		if(Router.routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(Router.publicRoutes, function(route) {
		if(Router.routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	_.every(Router.freeRoutes, function(route) {
		if(Router.routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;
	});
	if(grantedRoute) return grantedRoute;

	if(!grantedRoute) {
		// what to do?
		console.log("All routes are restricted for current user.");
	}

	return "";
};

// this function returns true if user is in role allowed to access given route
Router.routeGranted = function(routeName) {
	if(!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if(!Router.roleMap || Router.roleMap.length === 0) {
		// this app don't have role map - enable access
		return true;
	}

	var roleMapItem = _.find(Router.roleMap, function(roleItem) { return roleItem.route == routeName; });
	if(!roleMapItem) {
		// page is not restricted
		return true;
	}

	if(!Meteor.user() || !Meteor.user().roles || simulatingAnonymous()) {
		// user is not logged in
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	var allowedRoles = roleMapItem.roles;
	var granted = _.intersection(allowedRoles, Meteor.user().roles);
	if(!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.ensureLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!Meteor.userId() || simulatingAnonymous()) {
		// user is not logged in - redirect to public home
		var redirectRoute = Router.firstGrantedRoute(Router.defaultPublicRoute);
		this.redirect(redirectRoute);
	} else {
		// user is logged in - check role
		if(!Router.routeGranted(this.route.getName())) {
			// user is not in allowedRoles - redirect to first granted route
			var redirectRoute = Router.firstGrantedRoute(Router.defaultPrivateRoute);
			this.redirect(redirectRoute);
		} else {
			this.next();
		}
	}
};

Router.ensureNotLogged = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(Meteor.userId() && !simulatingAnonymous()) {
		var redirectRoute = Router.firstGrantedRoute(Router.defaultPrivateRoute);
		this.redirect(redirectRoute);
	}
	else {
		this.next();
	}
};

// called for pages in free zone - some of pages can be restricted
Router.ensureGranted = function() {
	if(Meteor.userId() && (!Meteor.user() || !Meteor.user().roles)) {
		this.render('loading');
		return;
	}

	if(!Router.routeGranted(this.route.getName())) {
		// user is not in allowedRoles - redirect to first granted route
		var redirectRoute = Router.firstGrantedRoute(Router.defaultFreeRoute);
		this.redirect(redirectRoute);
	} else {
		this.next();
	}
};

Router.currentRouteParams = function() {
	var route = Router ? Router.current() : null;
	if(!route) {
		return {};
	}

	var params = {};
	for(var key in route.params) {
		params[key] = JSON.parse(JSON.stringify(route.params[key]));
	}

	return params;
};

this.menuItemClass = function(routeName, params) {
	if(!Router.routeGranted(routeName)) {
		return "hidden";
	}

	if(!Router.current() || !Router.current().route) {
		return "";
	}

	if(!Router.routes[routeName]) {
		return "";
	}

	if(Router.current().route.getName() == routeName) {
		if(params && params.hash && Router.current().data().params) {
			var eq = true;
			for(var key in params.hash) {
				if(Router.current().data().params[key] != params.hash[key]) {
					eq = false;
				}
			}
			return eq ? "active" : "";
		}
		return "active";
	}

	var currentPath = Router.routes[Router.current().route.getName()].handler.path;
	var routePath = Router.routes[routeName].handler.path;

	if(routePath === "/") {
		return (currentPath == routePath || Router.current().route.getName().indexOf(routeName + ".") === 0) ? "active" : "";
	}

	return currentPath.indexOf(routePath) === 0 ? "active" : "";
};
