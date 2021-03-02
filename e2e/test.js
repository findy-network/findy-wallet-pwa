module.exports = {
    'Check app loads': function (browser) {
        browser
            .url('http://localhost:3000/')
            .waitForElementVisible('body')
            .assert.titleContains('Wallet')
            .end();
    }
};