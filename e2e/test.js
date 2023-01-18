const invitationContent = require('./e2e.invitation.json')
const user = require('./e2e.user.json')
const organisationLabel = `#conn-${invitationContent['@id']}`
const userCmd = `window.localStorage.token = "${user.jwt}"`
const home = process.env.AGENCY_URL || 'http://localhost:3000'
const addConBtn = '//button[contains(.,"Add connection")]'
const messageInput = 'input[placeholder="Type your answer here..."]'
const walletLink = '#wallet-link'
const credentialsHeader = user.existing
  ? '//span[contains(.,"email")]'
  : '//h2[contains(.,"Your wallet is empty")]'

const login = browser =>
  browser
    .url(home)
    .execute(userCmd)
    .url(home)
    .useXpath()
    .waitForElementVisible(addConBtn)
    .useCss()

module.exports = {
  afterEach: (browser) => {

    // TODO: fails occasionally with error:
    // Error while running .getLogContents() protocol action: This driver instance does
    //not have a valid session ID (did you call WebDriver.quit()?) and may no longer be used.

    // browser.isLogAvailable(
    //   browser.getLog('browser', (logEntriesArray) => {
    //     console.log('Log length: ' + logEntriesArray.length)
    //     logEntriesArray.forEach(function (log) {
    //       console.log(
    //         '[' + log.level.name + '] ' + log.timestamp + ' : ' + log.message
    //       )
    //     })
    //   })
    // )
    browser.end()
  },

  'Check app loads': (browser) => {
    const newInvBtn = '//button[contains(.,"New invitation")]'
    login(browser)
      .useXpath()
      .waitForElementVisible(newInvBtn)
  },
  'Check connection is done': (browser) => {
    const invitationInput = 'input[placeholder="Enter invitation code"]'
    const confirmBtn = '//button[contains(.,"Confirm")]'
    const invitation = JSON.stringify(invitationContent)
    login(browser)
      .useXpath()
      .click(addConBtn)
      .useCss()
      .waitForElementVisible(invitationInput)
      .setValue(invitationInput, invitation)
      .useXpath()
      .waitForElementVisible(confirmBtn)
      .click(confirmBtn)
      .useCss()
      .waitForElementVisible(organisationLabel)
  },
  'Check navigation works': (browser) => {
    login(browser)
      .useCss()
      .waitForElementVisible(walletLink)
      .click(walletLink)
      .useXpath()
      .waitForElementVisible(credentialsHeader)
  },
  'Check invalid connection id redirects to home': (browser) => {
    login(browser)
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
    login(browser)
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
      .useCss()
      .click(walletLink)
      .waitForElementVisible(credIcon)
  },
}
