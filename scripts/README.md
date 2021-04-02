# Scripts

Some brief documentation as to what lives here...

| File                 | Purpose                                                                              |
| -------------------- | ------------------------------------------------------------------------------------ |
| activate.sh          | Script to put on remote server to activate a version                                 |
| deploy.js            | Script to deploy using mup, creates a new version, tags and deploys using mup deploy |
| log-deployment.js    | Script to log a mup deployment, called from a hook in mup.js                         |
| mkcodesets.js        |                                                                                      |
| mkmodule.js          |                                                                                      |
| mkrelease.js         | Creates a release in the builds folder (when not using MUP)                          |
| myip.js              | Tells what your LAN ip address is                                                    |
| modules              | Folder containing module information files (used by mkmodules.js)                    |
| template-codesets.js | Script to do templating of codesets                                                  |
| template-module.js   | Script to do templating of modules                                                   |
