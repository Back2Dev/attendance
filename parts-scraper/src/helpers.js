const axios = require('axios');
const _ = require('lodash');
exports.asyncQueue = (handler, parallel = 1) => {
  let counter = 0;
  const tasks = [];
  const queueHandler = handler || ((fn, ...args) => fn(...args));
  const process = async () => {
    if (counter < parallel && tasks.length) {
      counter += 1;
      const { resolve, reject, args } = tasks.shift();
      try {
        resolve(await queueHandler(...args));
      } catch (e) {
        reject(e);
      }
      counter -= 1;
      process();
    }
  };
  const result = (...args) =>
    new Promise((resolve, reject) => {
      tasks.push({ args, resolve, reject });
      process();
    });

  return result;
};

// if we use the same cookie, they wont allow us to make multiple concurrent requests :)
const createSessionCookie = keyword => {
  const rand = () => Math.round(Math.random() * 9);
  return `osCsid=v${rand()}${rand()}j${rand()}hjmfckr${rand()}hojpfg${rand()}nk${rand()}of${rand()};`;
};

exports.request = async keyword => {
  const cookie = createSessionCookie(keyword);
  const { data } = await axios({
    method: 'POST',
    url: 'https://www.bicyclepartswholesale.com.au/search',
    withCredentials: 'true',
    headers: {
      post: '/search HTTP/1.1',
      host: 'www.bicyclepartswholesale.com.au',
      connection: 'keep-alive',
      'content-length': `${keyword.length}`,
      'cache-control': 'max-age=0',
      origin: 'https://www.bicyclepartswholesale.com.au',
      'upgrade-insecure-requests': '1',
      dnt: '1',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      referer: 'https://www.bicyclepartswholesale.com.au/search',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
      cookie
    },
    data: `keywords=${keyword}`
  });

  return data;
};
