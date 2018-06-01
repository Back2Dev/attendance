#!/usr/local/bin/node
'use strict';

const _ = require('lodash');
const fs = require('fs');
const shell = require('shelljs/global');
const recursive = require('recursive-readdir');
require('shelljs/global');
const git = require('git-rev');
const gitTag = require('git-tag')({localOnly:true});
const gitStatus = require("git-status");

// This file contains the list of targets that can be built
const choices = require('./choices');
// import choices from './choices';

// the "opts" object will contain all the command line parameters and options
// So the first parameter will be in the opts._ array, eg the first one will be in opts._[0]
// eg if run with --debug, then opts.debug will be true
const opts = require('minimist')(process.argv.slice(2));
// Be forgiving on this one
if (opts['dry-run'])
	opts.dry_run = true;
const willDo = (opts.dry_run) ? '(Not) ' : '';

if (opts.help) {
	console.log(`
#Usage:
	npm run deploy-XXX -- [--help] [--minor|major] [--all] [--dry_run]
Where
	--minor will bump the minor version, eg 1.2.5 => 1.3.0
	--major will bump the major version, eg 1.2.5 => 2.0.0
	--all will deploy to all hosts of the same level (eg prod)
	--dry_run will go through the motions, but not actually execute any commands 

NB: If you are specifying command line switches, you need to specify '--' in order for subsequent parameters to be passed through to the script
==  (otherwise command options are passsed to npm, which is not what you want)

#Prerequisites
	- Development environment, eg node/git etc

#Processing:
	This command will do the following
		- Bump the patch level version, eg 1.2.5 => 1.2.6 (unless --minor or --major is specified)
		- Do the mup deploy
		`);
	process.exit(0);
}

const BANG = '\n * * * * * * * FAILED * * * * * * * * *\n\n';
function ABORT(msg) {
	console.error(BANG+msg+'\n'+BANG);
	process.exit(1);
}

// 
// Recurse through the templates directory and mailmerge them into the target app
//   (you could template more than just the version no if you like)
//
const tdir = "./templates";
try {
	fs.existsSync(tdir);
} catch (e) {
	throw new Error("Can't find templates directory "+e);
}

let level = '';

function doCmd(cmd) {
	if (opts.debug)
	  console.log(`${willDo}Executing command: ${cmd}`);
	if (!opts.dry_run && exec(cmd).code !== 0) {
	  ABORT('Error: command failed ('+cmd+')');
	}
};

if (_.keys(choices).indexOf(opts._[0]) === -1) {
	ABORT("Fatal error: You must specify one of "+_.keys(choices).join(", "));
}
const choice = choices[opts._[0]];		// Get a reference to the choice made with the command line parameter
if (choice.level)
	level = choice.level;
if (!choice.app)
	choice.app = 'app';		// Provide a default to be safe

// Check the git status to make sure we are clean:
gitStatus((err, data) => {
  // console.log('gitStatus\n', err || data);
  // => [ { x: ' ', y: 'M', to: 'example/index.js', from: null } ]
  const dirty = [];
  _.each(data,row => {
  	if (row.from || row.y === 'M') {
  		dirty.push(row.to);
  	}
  });
  if (dirty.length && !opts.dry_run) {
  	ABORT("Git is showing "+dirty.length+" dirty files, ("+dirty.join(", ")+") please fix and retry");
  }
  checkBranch();
});

function checkBranch() {
	git.branch(function (str) {
		pkg.branch = str;
		if (choice.branch !== '' && pkg.branch !== choice.branch && !opts.dry_run) {
			ABORT(`You need to be on the [${choice.branch}] branch to deploy to the '${choice.name}' server.`);
		}
		pkg.tag = pkg.branch+"-v"+pkg.version;
		npmInstall();
	});
}

//
// A bit of defensive code to do a `meteor npm install`, which helps to prevent deployment problems
//   due to missing packages.
//
function npmInstall() {
	if (opts.debug)
		console.log(`Updating npm packages`);		
	doCmd("cd app && meteor npm install && cd .. ");
	gitStatus((err, data) => {
	  const dirty = [];
	  _.each(data,row => {
	  	if (row.from || row.y === 'M') {
	  		dirty.push(row.to);
	  	}
	  });
	  if (dirty.length && !opts.dry_run) {
			doCmd("git commit -am 'npm install' && git push");
	  }
		bumpVersion();
	});
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//
// The first job is to bump the version (sometimes)
//
function bumpVersion() {
	if (level === '' && 0) {		// It messes up if you don't bump the version no
		console.info("Not bumping version no");
	} else {
		if (opts.minor) {
			level = "minor";
		} else {
			if (opts.major) {
				level = "major";
			}
		}
		const cmd = `cd ${choice.app} && npm version ${level} --no-git-tag-version -m "Deploying version to ${choice.name}] - - - - - - - -"`;
		if (!opts.nobump) {
			doCmd(cmd);
		}
	}
  doTemplating();
}
//
// Read the package file - specifically get the version
//
const pkg = require(process.cwd()+`/${choice.app}/package.json`); // eslint-disable-line global-require
pkg.when = new Date();
git.long(function (str) {
	pkg.commit = str;
})

//
// We now do some templating of key config files
//
function doTemplating() {
	const basedir = process.cwd()+`/${choice.app}/`;

	// if (opts.debug)
	// 	console.log("cwd="+process.cwd());

	recursive(tdir, [], function (err, files) {
		if (err) {
			console.error("Recursion error: ",err)
		}
	  // Files is an array of filename
		// if (opts.debug)
		//   console.log(files);
		_.each(files,function(f) {
			const destf = f.replace("templates/",basedir);
			console.info(`${willDo}Templating file ${f} => ${destf}`);
			const t = fs.readFileSync(f,'utf8');
			// if (opts.debug)
			//   console.log("template=",t);
			const tt = _.template(t);
			const buf = tt(pkg);
			// if (opts.debug) {
			//   console.log(`${willDo}writing ${destf}`);
			// }
			if (!opts.dry_run)
				fs.writeFileSync(destf,buf);
		});
		mainGame();
	});
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// The main game....
//
// Grab all the npm modules we need
// Compile the typescript files
// Now delete the unwanted npm modules
function mainGame() {
	const cmds = [];

	// cmds.push('npm run ms.template');
	cmds.push(`git diff --quiet && git diff --staged --quiet || git commit -am "Completed templating of ${choice.app}/${pkg.version}" && git pull`);
	cmds.push(`git tag -a v${pkg.version}.${choice.name} -m "Tag message ${pkg.when}"`);
	cmds.push("git push");
	cmds.push("git push --tags");

  cmds.push("echo Deploying files to remote server");
  let mupdir = "./deployment/"+choice.name+"/";
  const settingsFile = mupdir+"settings.json";
  const mupFile = mupdir+"mup.js";

  const cmd = "mup deploy --settings "+settingsFile+" --config "+ mupFile;
  cmds.push(cmd);

  if (opts.all) {
	  Object.keys(choices)
	  .filter(name => choices[name].branch === choice.branch && choices[name].name !== choice.name)
	  .forEach(name => {
			cmds.push(`echo Deploying cached build to ${name}`);
		  mupdir = "./deployment/"+choices[name].name;
		  const command = ` 	 mup deploy --settings ${mupdir}/settings.json --cached-build --config ${mupdir}/mup.js`;
		  cmds.push(command);
	  })

  }
	cmds.push("echo Done.");


	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	//
	// Run all the commands in sequence
	//
	_.each(cmds,(cmd) => {
		doCmd(cmd);
	});
}
