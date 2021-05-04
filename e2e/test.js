module.exports = {
  'Check app loads': (browser) => {
    const addConBtn = '//button[contains(.,"Add connection")]'
    const newInvBtn = '//button[contains(.,"New invitation")]'
    browser
      .url('http://localhost:3000/')
      .useXpath()
      .waitForElementVisible(addConBtn)
      .useXpath()
      .waitForElementVisible(newInvBtn)
      .end()
  },
}
