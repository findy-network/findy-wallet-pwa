module.exports = {
    'Demo test OP Lab': function (browser) {
        browser
            .url('https://www.op-lab.fi/')
            .waitForElementVisible('body')
            .assert.titleContains('OP Lab')
            .end();
    }
};