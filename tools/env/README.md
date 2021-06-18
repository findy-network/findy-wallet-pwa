# Agency Setup for Local Development

## Description

In case you do not have cloud installation of Findy Agency available, you can
setup needed services locally and develop your application against a local Findy
Agency. This document describes how to set up Findy Agency service containers on
your local computer.

The setup uses agency internal file ledger, intended only for testing during
development. This setup does not suit for testing inter-agency communication
even though it is possible to set one up using a common indy-plenum ledger.

The steps below describe how to setup full Findy agency installation. It also
shows how web wallet users can connect with other agents that are operated through findy-agent-cli tool.

## Prerequisities

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/en/download/)
- [findy-agent-cli](https://github.com/findy-network/findy-agent-cli#installation)

## Steps

1. **Launch backend services**

   Open terminal and run:

   ```sh
   cd tools/env
   make pull-up
   ```

   This will pull the latest versions of the needed docker images. Later on when
   launching the backend you can use `make up` if there is no need to fetch the
   latest images.

   It will take a short while for all the services to start up. Logs from all of
   the started services are printed to the console. `C-c` stops the
   containers.

   When the init sequence is complete, you should see something similar to this output:
   ![Architecture](./docs/env-01.png)

   The script will create a folder called `.data` where all the data of the
   services are stored during execution. If there is no need for the test data
   anymore, `make clean` will remove all the generated data and allocated
   resources.

1. **Start wallet development environment.**

   Open terminal on the root of this repository, run `npm install` and `npm start`. Wallet application is launched and you can access the service with browser in address http://localhost:3000

1. **Register Alice's Web-Wallet**

   Follow the guides on [Findy Wallet](http://localhost:3000) and register the
   first wallet holder by the name Alice.

   ![Wallet login](../../docs/wallet-login.gif)

   Now you have the agency services up and running and you have onboarded the first wallet user.

1. **Build playground environment with CLI tool.**

   Make sure you have [installed](https://github.com/findy-network/findy-agent-cli#installation) findy-agent-cli and it is available in your path. CLI can be used to register and operate other agents that can interact with your web wallet user.

   Check [here](https://github.com/findy-network/findy-agent-cli/scripts/fullstack#steps) for more tips, features and details of this setup.

   Once you have installed `findy-agent-cli`, define env variable `FCLI`:

   ```sh
   export FCLI=<your-name-for-binary>
   ```

   Enter the following command to setup the CLI for the currently running local agency:

   ```sh
   source ./setup-cli-env.sh
   ```

   Note:

   - **For Linux only**: define following aliases and install `xclip` if not
     already installed:
     ```sh
     alias pbcopy="xclip -selection c"
     alias pbpaste="xclip -selection clipboard -o"
     ```
   - use the same terminal for Bob's operations from now on.

1. **Onboard Bob (terminal)**

   Alice is already registered thru Web UI. Register Bob (agent operated through CLI) by entering this to the same terminal as in previous step:

   ```sh
   source bob/register
   ```

   Now you have onboarded two agents to agency, "Alice" with the web wallet and "Bob" through CLI tool.

1. **Bob invites Alice to connect...**

   ```sh
   # Authenticate Bob
   source bob/login

   # Create invitation for Bob and copy it to clipboard
   $FCLI agent invitation --label Bob | pbcopy
   ```

   Open Alice's web wallet and paste invitation to the add connection dialog.

   ![Add connection](./docs/env-02.gif)

1. **...or Alice invites Bob to connect**

   Create invitation for Alice in the web UI. Copy it to the clipboard.

   Enter following command to the terminal:

   ```sh
   export FCLI_CONN_ID=`pbpaste | bob/connect`
   ```

   ![Add connection](./docs/env-03.gif)

1. **Bob sends Alice message**

   Now you have the connection ID (pairwise ID) in the environment variable. That enables you to start messaging to Alice:

   ```sh
   $FCLI bot chat
   ```

   Exit chat with C-c

   ![Send messages](./docs/env-04.gif)

1. **Alice sends text message to Bob**

   Enter following in Bob's terminal to start listening to messages:

   ```sh
   $FCLI bot read
   ```

   Go to the Alice's web wallet and send text message to "Bob the Builder."

   Bob's terminal should output Alice's welcoming messages. To stop Bob's
   listen command just press C-c.

   ![Recieve messages](./docs/env-05.gif)

1. **All done!**

   Congratulations, you just completed the initial Findy agency crash course! You can now continue experiments

   - Either by issuing and verifying credentials or building chat bots using findy-agent-cli functionality. See more documentation and samples here: https://github.com/findy-network/findy-agent-cli
   - Or building applications that utilise Findy Agency through its GRPC API. You can use our helper libraries for [golang](https://github.com/findy-network/findy-common-go) or [Typescript](https://github.com/findy-network/findy-common-ts) or use directly [the GRPC interface](https://github.com/findy-network/findy-agent-api) with the language of your choice.
