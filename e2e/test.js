module.exports = {
  'Check app loads': (browser) => {
    const addButton = '//button[contains(.,"Add connection")]'
    browser
      .url('http://localhost:3000/')
      .useXpath()
      .waitForElementVisible(addButton)
      .end()
  },
}
