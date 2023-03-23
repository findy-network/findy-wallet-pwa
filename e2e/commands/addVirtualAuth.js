module.exports = class CustomCommand {
  async command() {
    let returnValue;

    try {
      returnValue = await this.httpRequest({
        // the pathname of the endpoint to call
        path: '/session/:sessionId/webauthn/authenticator',

        // the current Selenium/Webdriver sessionId
        sessionId: this.api.sessionId,

        // host and port are normally not necessary, since it is the current Webdriver hostname/port
        //host: '',
        //port: '',

        // the body of the request
        data: {
          protocol: 'ctap2',
          transport: 'usb',
        },

        method: 'POST'
      });
    } catch (err) {
      console.error('An error occurred', err);
      returnValue = {
        status: -1,
        error: err.message
      }
    }

    return returnValue;
  }
}
