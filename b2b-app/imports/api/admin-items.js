/**
 * This file isn't imported by the main app. It lives here as a means of
 * recording the set of admin modules, and it is used to generate a
 * number of things, namely:
 * - Routes /imports/ui/routes/generated-routes.js
 * - Admin menu items /imports/ui/components/generated-admin-items.js
 * - Factories list /imports/test/generated-factories.js
 * - Publications list /imports/startup/server/generated-pubs.js
 */
module.exports = [
  { id: 'audits', menu: 'Audits', fixtures: 0, pubs: 1 },
  { id: 'cronjobs', menu: 'Cronjobs', fixtures: 1, pubs: 1 },
  { id: 'triggers', menu: 'Triggers', fixtures: 1, pubs: 1 },
  { id: 'message-templates', menu: 'Message templates', fixtures: 1, pubs: 1 },
  { id: 'messages', menu: '', fixtures: 0, pubs: 1 },
  { id: 'notifications', menu: '', fixtures: 0, pubs: 1 },
  { id: 'members', menu: 'Members', fixtures: 1, pubs: 1 },
  { id: 'settings', menu: 'Settings', fixtures: 1, pubs: 1 },
  { id: 'surveys', menu: 'Surveys', fixtures: 1, pubs: 1 },
  { id: 'events', menu: 'Events', fixtures: 0, pubs: 1 },
  { id: 'courses', menu: 'Courses', fixtures: 0, pubs: 1 },
  { id: 'tools', menu: 'Tools', fixtures: 1, pubs: 1 },
  { id: 'sessions', menu: 'Sessions', fixtures: 0, pubs: 1 },
  { id: 'service-items', menu: 'Service items', fixtures: 1, pubs: 1 },
  { id: 'jobs', menu: 'Jobs', fixtures: 0, pubs: 1 },
]
