# Agency Setup for Local Development

## Description

In case you do not have cloud installation of Findy Agency available, you can
setup needed services locally and develop your application against a local Findy
Agency. This document describes how to set up Findy Agency service containers on
your local computer.

The setup uses agency internal file ledger, intended only for testing during
development. This setup does not suit for testing inter-agency communication
even though it is possible to set one up using a common indy-plenum ledger.

## Prerequisities

- [Docker](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/en/download/)
- [findy-agent-cli](https://github.com/findy-network/findy-agent-cli#installation)

## Steps

1. Launch backend services with

   ```sh
   cd tools/env
   make pull-up
   ```

   This will pull the latest versions of the needed docker images. Later on when
   launching the backend you can use `make up` if there is no need to fetch the
   latest images.

   It will take a short while for all the services to start up. Logs from all of
   the started services are printed to the console. `<CTRL>+C` stops the
   containers.

   When the init sequence is complete, you should see something similar to this output:
   ![Architecture](./docs/env-01.png)

   The script will create a folder called `.data` where all the data of the
   services are stored during execution. If there is no need for the test data
   anymore, `make clean` will remove all the generated data and allocated
   resources.

1. Start wallet development environment. On the root of this
   repository, run `npm install` and `npm start`. Wallet application is launched
   and you can access the service with browser in address http://localhost:3000

   **Register Alice's Web-Wallet**

   Follow the guides on [Findy Wallet](http://localhost:3000) and register the
   first wallet holder by name Alice which make easier to follow these samples.

1. Build playground environment with CLI tool. It's usually
   good idea to have some test data at the backend before UI development or
   application logic itself. Now, when your whole stack is running thanks to
   step one you can easily play with it from the command line.

   To install `findy-agent-cli` execute the following:

   ```shell
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/findy-network/findy-agent-cli/HEAD/install.sh)"
   ```

   It will install the one binary which is only that's needed in
   `./bin/findy-agent-cli` where you can move it to your path, create alias for
   it, setup auto-completion, etc. More information about it can be found from
   [here](https://github.com/findy-network/findy-agent-cli).

   To make use of `findy-agent-cli` there is a helper script to setup the CLI
   environment. Enter the following command:

   ```shell
   source ./setup-cli-env.sh
   ```

   That will setup all the needed environment variables for CLI configuration
   for the currently running environment. Most importantly it creates a new
   master key for your CLI FIDO2 authenticator. If you want to keep your
   development environment between restarts you should persist that key by
   copying it to your environment variables. The key is in env `FCLI_KEY` after
   running the setup script. The setup generates the `use-key.sh` script for
   your convenient as well. Add `source use-key.sh` to your boot files for
   example.

   Next time you run the `./setup-cli-env.sh` it won't create a new key _if it
   founds the existing one_ i.e. you have sourced the `use-key.sh` script.

   _Tip_ Enter following commands:

   ```shell
   alias cli=findy-agent-cli
   . <(findy-agent-cli completion bash | sed 's/findy-agent-cli/cli/g')
   ```

   You should enter the following after you have installed the working
   `findy-agent-cli`:

   ```shell
   export FCLI=<your-name-for-binary>
   ```

   That's for the helper scrips used in this directory and referenced here as
   well.

   **On-board Alice (web wallet) and Bob (terminal)**

   Alice's wallet should be registered thru Web UI and Bob's by entering this to
   currently setup terminal:

   ```shell
   source bob/register
   ```

   You can play each of them by entering for example following:

   ```shell
   source bob/login
   $FCLI agent ping
   ```

   **Alice invites Bob to connect**

   **Note: For Linux only** define following aliases and install `xclip` if not
   already installed:

   ```shell
   alias pbcopy="xclip -selection c"
   alias pbpaste="xclip -selection clipboard -o"
   ```

   These are to keep samples more readable and to follow common idioms.

   Go to your web browser and Login as Alice if not already and copy the
   invitation JSON to clipboard.

   <**TODO**: instructions and even screen shot?>

   Come back to the this same terminal (it's important that your CLI settings
   are the same) and enter the following command:

   ```shell
   export FCLI_CONN_ID=`pbpaste | bob/connect`
   ```

   Or you could enter it as here to have new connection ID in clipboard for
   later use:

   ```shell
   pbpaste | bob/connect | pbcopy && export FCLI_CONN_ID=pbpaste
   ```

   Now you have the connection ID (pairwise ID) in the environment variable and
   you could test that with the commands:

   ```shell
   source bob/login
   $FCLI connection trustping
   ```

   Which means that Bob's end of the connection calls Bob's trustping
   protocol and Alice's cloud agent responses it.

   **Alice sends text message to Bob**
   First in the Bob's terminal enter the following:

   ```shell
   $FCLI bot read
   ```

   Go to the Alice's web wallet and send text message to newly created
   connection to Bob:

   **TODO** Web-Alice sends message to Terminal-Bob.

   The Bob's terminal should output Alice's welcoming messages. To stop Bob's
   listen command just press C-c.
