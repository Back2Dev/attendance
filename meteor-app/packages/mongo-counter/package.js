Package.describe({
  name: 'mikkelking:mongo-counter',
  summary: "Atomic counters stored in MongoDB",
  version: "0.0.6",
  git: ""
});

Package.onUse(function (api) {
  api.versionsFrom("1.2.1");
  api.use(['coffeescript'], 'server');
  api.addFiles('counter.coffee', 'server');
  if (api.export) {
    api.export('incrementCounter', 'server');
    api.export('decrementCounter', 'server');
    api.export('setCounter', 'server');
    api.export('deleteCounters', 'server', {testOnly: true});
  }
});

Package.onTest(function(api) {
  api.use('coffeescript');
  api.use('tinytest');
  api.use('mikkelking:mongo-counter');
//  api.addFiles('tests.counter.coffee', 'server');
});
