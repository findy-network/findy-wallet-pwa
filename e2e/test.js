module.exports = {
  'Check app loads': (browser) => {
    const addConBtn = '//button[contains(.,"Add connection")]'
    const newInvBtn = '//button[contains(.,"New invitation")]'
    const connectionsBtn = '//button[contains(.,"Connections")]'
    const credentialsBtn = '//button[contains(.,"Credentials")]'
    const logouBtn = '//button[contains(.,"Logout")]'
    browser
      .url('http://localhost:3000/')
      .useXpath()
      .waitForElementVisible(addConBtn)
      .useXpath()
      .waitForElementVisible(newInvBtn)
      .useXpath()
      .waitForElementVisible(connectionsBtn)
      .useXpath()
      .waitForElementVisible(credentialsBtn)
      .useXpath()
      .waitForElementVisible(logouBtn)
      .end()
  },
}
