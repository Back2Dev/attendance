#!/bin/node
const fs = require("fs");
const exec = require("child_process").exec;

function gitBranch(cmd, dirname, cb) {
  exec(cmd, {}, function(err, stdout, stderr) {
    cb(stdout.split("\n").join(""));
  });
}

// Read the mup.js file to get config information
const m = require(process.cwd() + "/mup");

// Remove the first 2 arguments
process.argv.shift();
process.argv.shift();
const pkg = require(process.cwd() + `/${m.app.path}/package.json`); // eslint-disable-line global-require

gitBranch(
  `git -C ${m.app.path} rev-parse --abbrev-ref HEAD`,
  m.app.path,
  function(branch) {
    fs.appendFileSync(
      "../../mup-deploy.log",
      `${process.argv.join(" ")} ${branch} ${m.app.env.ROOT_URL} ${
        pkg.version
      }\n`
    );
  }
);
