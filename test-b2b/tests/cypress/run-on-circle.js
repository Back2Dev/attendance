// Inspired from: https://github.com/xolvio/qualityfaster/blob/master/.scripts/
const { exec } = require('child_process');

const meteorCmd = process.argv[2];
const cyCmd = process.argv[3];

const meteorProcess = exec(meteorCmd); // ex: 'meteor npm run ci-app'

meteorProcess.stdout.pipe(process.stdout);
meteorProcess.stderr.pipe(process.stderr);

// Wait until Meteor is started and the start the cy tests
meteorProcess.stdout.on('data', (data) => {
  if (data.toString().match('App running at')) {
    const cyProcess = exec(cyCmd, { maxBuffer: 20480000 }); // 'ex: meteor npm run ci-test'

    cyProcess.stdout.pipe(process.stdout);
    cyProcess.stderr.pipe(process.stderr);

    cyProcess.on('close', (code) => {
      console.log(`Cypress exited with code ${code}`);
      meteorProcess.kill();
      process.exit(code);
    });
  }
});