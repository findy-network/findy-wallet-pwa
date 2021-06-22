module.exports = {
  'Check app loads': (browser) => {
    const home = 'http://localhost:3000/'
    const addConBtn = '//button[contains(.,"Add connection")]'
    const newInvBtn = '//button[contains(.,"New invitation")]'
    const user = require('./e2e.user.json')
    const cmd = `window.localStorage.token = "${user.jwt}"`
    browser
      .url(home)
      .execute(cmd)
      .url(home)
      .useXpath()
      .waitForElementVisible(addConBtn)
      .useXpath()
      .waitForElementVisible(newInvBtn)
      .end()
  },
}
