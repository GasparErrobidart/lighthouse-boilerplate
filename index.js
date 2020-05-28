const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({chromeFlags: opts.chromeFlags , port : process.env.PORT}).then(chrome => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then(results => {
      // use results.lhr for the JS-consumable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.lhr)
    }).catch( err=> console.error(err));
  }).catch( err=> console.error(err));
}

const opts = {
  chromeFlags: ['--headless','--remote-debugging-address=0.0.0.0', '--no-sandbox']
};

// Usage:
launchChromeAndRunLighthouse('https://mejuri.com', opts).then(results => {
  console.log(results)
});
