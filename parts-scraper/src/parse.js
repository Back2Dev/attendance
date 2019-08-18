const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);
const _ = require('lodash');
const xlsx = require('xlsx');

//$ parse.js ../prices.xlsx ./in/

const SHEET_NUMBER = 'Sheet2';

const [, , inputFile, outputFile] = process.argv;

const keysToCamelCase = object =>
  _.mapKeys(object, (value, key) => _.camelCase(key));

const main = async () => {
  const file = xlsx.read(await readFileP(path.resolve(__dirname, inputFile)), {
    type: 'buffer'
  });
  const res = xlsx.utils
    .sheet_to_json(file.Sheets[SHEET_NUMBER])
    .map(keysToCamelCase);

  await writeFileP(
    path.resolve(__dirname, outputFile, 'parts.json'),
    JSON.stringify(res)
  );
};

main();
