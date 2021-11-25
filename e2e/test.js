const user = require('./e2e.user.json')
const userCmd = `window.localStorage.token = "${user.jwt}"`
const home = 'http://localhost:3000/'
const addConBtn = '//button[contains(.,"Add connection")]'

module.exports = {
  'Check app loads': (browser) => {
    const newInvBtn = '//button[contains(.,"New invitation")]'
    browser
      .url(home)
      .execute(userCmd)
      .url(home)
      .useXpath()
      .waitForElementVisible(addConBtn)
      .waitForElementVisible(newInvBtn)
      .end()
  },
  'Check connection is done': (browser) => {
    const invitationInput = 'input[placeholder="Enter invitation code"]'
    const confirmBtn = '//button[contains(.,"Confirm")]'
    const organisationLabel = '//p[contains(.,"organisation")]'
    const invitation = JSON.stringify(require('./e2e.invitation.json'))
    browser
      .url(home)
      .execute(userCmd)
      .url(home)
      .useXpath()
      .waitForElementVisible(addConBtn)
      .click(addConBtn)
      .useCss()
      .waitForElementVisible(invitationInput)
      .setValue(invitationInput, invitation)
      .useXpath()
      .waitForElementVisible(confirmBtn)
      .click(confirmBtn)
      .waitForElementVisible(organisationLabel)
      .end()
  },
  'Check navigation works': (browser) => {
    const walletLink = '//a[contains(.,"Wallet")]'
    const credentialsHeader = '//h2[contains(.,"Your wallet is empty")]'
    browser
      .url(home)
      .execute(userCmd)
      .url(home)
      .useXpath()
      .click(walletLink)
      .waitForElementVisible(credentialsHeader)
      .end()
  },
  'Check invalid connection id redirects to home': (browser) => {
    browser
      .url(home)
      .execute(userCmd)
      .url(`${home}/invalid-connection-id`)
      .useXpath()
      .waitForElementVisible(addConBtn)
      .end()
  },
}
