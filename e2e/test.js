const user = require('./e2e.user.json')
const userCmd = `window.localStorage.token = "${user.jwt}"`
const home = process.env.AGENCY_URL || 'http://localhost:3000'
const addConBtn = '//button[contains(.,"Add connection")]'
const organisationLabel = '//p[contains(.,"organisation")]'
const messageInput = 'input[placeholder="Type your answer here..."]'
const walletLink = '//a[contains(.,"Wallet")]'

module.exports = {
  afterEach: (browser) => {
    browser
      .getLog('browser', (logEntriesArray) => {
        console.log('Log length: ' + logEntriesArray.length)
        logEntriesArray.forEach(function (log) {
          console.log(
            '[' + log.level.name + '] ' + log.timestamp + ' : ' + log.message
          )
        })
      })
      .end()
  },

  'Check app loads': (browser) => {
    const newInvBtn = '//button[contains(.,"New invitation")]'
    browser
      .url(home)
      .execute(userCmd)
      .url(home)
      .useXpath()
      .waitForElementVisible(addConBtn)
      .waitForElementVisible(newInvBtn)
  },
  'Check connection is done': (browser) => {
    const invitationInput = 'input[placeholder="Enter invitation code"]'
    const confirmBtn = '//button[contains(.,"Confirm")]'
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
  },
  'Check navigation works': (browser) => {
    const credentialsHeader = '//h2[contains(.,"Your wallet is empty")]'
    browser
      .url(home)
      .execute(userCmd)
      .url(home)
      .useXpath()
      .click(walletLink)
      .waitForElementVisible(credentialsHeader)
  },
  'Check invalid connection id redirects to home': (browser) => {
    browser
      .url(home)
      .execute(userCmd)
      .url(home)
      .useCss()
      .waitForElementVisible(messageInput)
      .url(`${home}/connections/6e0a9f70-dece-4329-9e1e-93512f24d9dc`)
      .useCss()
      .waitForElementVisible(messageInput)
  },
  'Check issue and verify works': (browser) => {
    const helloLabel = '//p[contains(.,"Hello!")]'
    const submitBtn = 'button[type=submit]'
    const acceptBtn = '//button[contains(.,"Accept")]'
    const verificationText =
      '//p[contains(.,"Hello test! I\'m stupid bot who knows you have verified email address!!! I can trust you.")]'
    const credIcon = 'svg[aria-label=Certificate]'
    browser
      .url(home)
      .execute(userCmd)
      .url(home)
      .useXpath()
      .waitForElementVisible(organisationLabel)
      .click(organisationLabel)
      .useCss()

      // Start bot
      .waitForElementVisible(messageInput)
      .click(messageInput)
      .setValue(messageInput, 'test')
      .click(submitBtn)
      .useXpath()
      .waitForElementVisible(helloLabel)

      // Send email value to bot
      .useCss()
      .waitForElementVisible('#message-3')
      .click(messageInput)
      .setValue(messageInput, 'test')
      .click(submitBtn)

      .waitForElementVisible('#message-5')
      .click(messageInput)
      .setValue(messageInput, 'confirm')
      .click(submitBtn)

      // Wait for credential offer
      .useXpath()
      .waitForElementVisible(acceptBtn)
      .click(acceptBtn)

      // Confirm proof request sending
      .useCss()
      .waitForElementVisible('#message-11')
      .click(messageInput)
      .setValue(messageInput, 'yes')
      .click(submitBtn)

      // Wait for proof request
      .useXpath()
      .waitForElementVisible(acceptBtn)
      .click(acceptBtn)

      // Confirm proof was ok
      .useXpath()
      .waitForElementVisible(verificationText)

      // Check that cred is in wallet
      .useXpath()
      .click(walletLink)
      .useCss()
      .waitForElementVisible(credIcon)
  },
}
