# findy-wallet-pwa

[![test](https://github.com/findy-network/findy-wallet-pwa/actions/workflows/test.yml/badge.svg?branch=dev)](https://github.com/findy-network/findy-wallet-pwa/actions/workflows/test.yml)

## Getting Started

Findy Agency is a collection of services ([Core](https://github.com/findy-network/findy-agent),
[Auth](https://github.com/findy-network/findy-agent-auth),
[Vault](https://github.com/findy-network/findy-agent-vault) and
[this service](https://github.com/findy-network/findy-wallet-pwa)) that provide
full SSI agency along with a web wallet for individuals.
To start experimenting with Findy Agency we recommend you to start with
[the documentation](https://findy-network.github.io/) and
[set up the agency to your localhost environment](https://github.com/findy-network/findy-wallet-pwa/tree/dev/tools/env#agency-setup-for-local-development).

- [Documentation](https://findy-network.github.io/)
- [Instructions for starting agency in Docker containers](https://github.com/findy-network/findy-wallet-pwa/tree/dev/tools/env#agency-setup-for-local-development)

## Project

Web wallet frontend for Findy agency. Uses WebAuthn / Fido2 for authentication to agency backend.

This project is a PoC/MVP of a web wallet intended for Findy agency users (individuals). The UI is unfinished in many ways and probably this project will not be seen in production as such. However, it shows how to implement

1. Authentication to Findy agency from browser environment
1. Data fetching and manipulation use cases that utilise Findy agency vault service (GraphQL-interface)

## General architecture

Wallet related to the general architecture

![Architecture](./docs/arch-wallet.png)

Wallet application interacts with two Findy agency services:

- [Authentication service](https://github.com/findy-network/findy-agent-auth/) for agency registration and authentication.
- [Vault service](https://github.com/findy-network/findy-agent-vault/) provides the app backend that serves data over GraphQL interface.

## Running in development mode

1. [Setup local development environment](./tools/env/README.md#steps)
2. Install Findy Wallet PWA

   ```
   npm install
   ```

3. Run application

   ```
   npm start
   ```

- This will launch the service at: <http://localhost:3000>
- You can access the service with a web browser when the Vault is running in background

## Wallet features

Here is listed some of the features the current version of this web wallet have.
Bare in mind that the features and how they work can change in the future.

### Register/Login

Web wallet uses passwordless WebAuthn / Fido2 authentication for the registration and login. You must to have biometric authentication or hardware token available in order to make succesful registration/login. Check more info about WebAuthn here: <https://webauthn.io/>

![Wallet login](./docs/wallet-login.gif)

Note:

- The agent name you use for registration must be unique among agency users, otherwise the registration fails.
- You can also emulate authenticators e.g. in [Google Chrome](https://developer.chrome.com/docs/devtools/webauthn/)

### Chat

In chat view you can send and receive messages, make proofs and receive credentials with other agents which you have connected with.

#### Connection

In order to make a connection with other agent, you have to scan qr-code invitation or paste invitation json provided by the other agent.
Press "Add connection" button to scan or paste invitation with your web wallet.
Connection request is sent when you press the "confirm" button. It can take several secounds to complete connection request.

#### Invitation

You can generate your own invitation json by pressing the "New invitation" button. You can share generated json with the agent who wants to make connection with you.

#### Messaging

When you successfully made a connection with other agent, you can send and receive messages within the connection.

#### Credential Offer

After you have a connection with other agent, they can send you verified credentials. You can accept or decline these offers.

#### Wallet credentials

You can browse your received credentials by going in the "Wallet" section of the app.

#### Proof Request

In chat view you can also receive proof requests. You must have proper credential in your wallet in order to accept the proof. You can also decline the request.
The app will tell you if you have the suitable credentials to accept the proof request or not.
