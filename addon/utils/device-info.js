import { OS_LIST, BROWSER_LIST } from 'quizzes-addon/config/parse-event';

/**
 * This function parse and matchitem
 */
function matchItem(agent, data) {
  var i = 0,
    j = 0,
    regex,
    regexv,
    match,
    matches,
    version;

  for (i = 0; i < data.length; i += 1) {
    regex = new RegExp(data[i].value, 'i');
    match = regex.test(agent);
    if (match) {
      regexv = new RegExp(`${data[i].version}[- /:;]([\\d._]+)`, 'i');
      matches = agent.match(regexv);
      version = '';
      if (matches) {
        if (matches[1]) {
          matches = matches[1];
        }
      }
      if (matches) {
        matches = matches.split(/[._]+/);
        for (j = 0; j < matches.length; j += 1) {
          if (j === 0) {
            version += `${matches[j]}.`;
          } else {
            version += matches[j];
          }
        }
      } else {
        version = '0';
      }
      return {
        name: data[i].name,
        version: parseFloat(version)
      };
    }
  }
  return { name: 'unknown', version: 0 };
}

/**
 * Get device info
 @returns {Object} current device info
 */
export function getDeviceInfo() {
  const header = [
    navigator.platform,
    navigator.userAgent,
    navigator.appVersion,
    navigator.vendor,
    window.opera
  ];
  const agent = header.join(' ');
  let os = matchItem(agent, OS_LIST);
  let browser = matchItem(agent, BROWSER_LIST);
  const deviceInfo = {
    os: os.name,
    browser: browser.name,
    browserVersion: browser.version,
    navigatorUserAgent: navigator.userAgent,
    navigatorAppVersion: navigator.appVersion,
    navigatorPlatform: navigator.platform,
    navigatorVendor: navigator.vendor
  };
  return deviceInfo;
}
