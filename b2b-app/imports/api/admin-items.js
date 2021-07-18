/**
 * This file isn't imported by the main app. It lives here as a means of
 * recording the set of admin modules, and it is used to generate a
 * number of things, namely:
 * - Routes /imports/ui/routes/generated-routes.js
 * - Admin menu items /imports/ui/components/generated-admin-items.js
 * - Factories list /imports/test/generated-factories.js
 * - Publications list /imports/startup/server/generated-pubs.js
 */
export default adminItems = [
  { id: 'message-templates', collection: 'MessageTemplates' },
  { id: 'settings', collection: 'SettingsList' },
  { id: 'users', collection: 'UserList' },
  { id: 'cronjobs', collection: 'Cronjobs' },
  { id: 'triggers', collection: 'Triggers' },
  { id: 'surveys', collection: 'Surveys' },
  { id: 'events', collection: 'Events' },
  { id: 'courses', collection: 'Courses' },
  { id: 'tools', collection: 'Tools' },
  { id: 'sessions', collection: 'Sessions' },
]
