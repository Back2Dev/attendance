#!/usr/bin-_-/env node

/* 
 
 cd scraper/src
  node index.js ./in /parts.json ./out /

 
 */
//

const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const { request, asyncQueue } = require("./helpers");
const readFileP = promisify(fs.readFile);
const writeFileP = promisify(fs.writeFile);
const _ = require("lodash");
const cheerio = require("cheerio");
const promiseRetry = require("promise-retry");

const csvParse = require("csv-parse");
const csvParseP = promisify(csvParse);

const wait = duration => new Promise(resolve => setTimeout(resolve, duration));

const errorHandler = e => {
  console.log(e.message);
  console.log(`n=${n}`);
  process.exit(1);
};

const [, , inputPath, outputPath] = process.argv;
let n = 0;

// perhaps you could drop this function into meteor app to
// get the urls dynamically and insert into db if not there ?

const getPartUrl = async partNumber => {
  const html = await request(partNumber);
  const $ = await cheerio.load(html);

  const imgUrl = $("div.photo img").attr("src");

  if (!imgUrl) {
    // retry, probably a dud random cookie
    throw Error("Missing image URL");
  }

  return imgUrl;
};

const processPart = partNumber =>
  promiseRetry(async (retry, number) => {
    try {
      // just in case theres some ddos protection going on
      await wait(Math.round(Math.random() * 100));

      console.log({ partNumber });

      const imgUrl = await getPartUrl(partNumber);
      n = n + 1;
      // output final csv
      await writeFileP(
        path.resolve(__dirname, outputPath, `urls.csv`),
        `${partNumber}, ${imgUrl}\n`,
        { flag: "a+" }
      );
    } catch (e) {
      console.log(`${e.message} retrying ${partNumber}`);
      retry(e);
    }
  });

const main = async () => {
  const parts = _.map(
    JSON.parse(await readFileP(path.resolve(__dirname, inputPath), "utf8")),
    "partNo"
  );

  await Promise.all(parts.map(asyncQueue(processPart, 50)));

  const urlsCsv = await csvParseP(
    await readFileP(path.resolve(__dirname, outputPath, `urls.csv`), "utf8")
  );

  await writeFileP(
    path.resolve(__dirname, outputPath, `urls.json`),
    JSON.stringify(urlsCsv.map(([part, url]) => ({ part, url }))),
    { flag: "a+" }
  );
};

main().catch(errorHandler);
console.log(`n=${n}`);
