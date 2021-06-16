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
- [Node.js](https://nodejs.org/en/download/) for UI only
- [findy-agent-cli (installer)](https://raw.githubusercontent.com/findy-network/findy-agent-cli/HEAD/install.sh)
  for CLI operations only

## Steps

1. Launch backend services with

   ```sh
   make pull-up
   ```

   This will pull the latest versions of the needed docker images. Later on when
   launching the backend you can use `make up` if there is no need to fetch the
   latest images.

   It will take a short while for all the services to start up. Logs from all of
   the started services are printed to the console. `<CTRL>+C` stops the
   containers.

   The script will create a folder called `.data` where all the data of the
   services are stored during execution. If there is no need for the test data
   anymore, `make clean` will remove all the generated data and allocated
   resources.

1. [Option UI] Start wallet development environment. On the root of this
   repository, run `npm install` and `npm start`. Wallet application is launched
   and you can access the service with browser in address http://localhost:3000

1. [Option Backend] Build playground environment with CLI tool. It's usually
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
   master key for your CLI FIDO2 authenticator. If you want to keep your development
   environment between restarts you should persist that key now by copying it to
   your environment variables. The key is in env `FCLI_KEY` after running the
   setup script.

   Next time you run the `./setup-cli-env.sh` it won't create a new key *if it
   founds the existing one*.
   
1. Test the features running the test chat bot. TODO: instructions for creating
   schema/cred-def/invitation + starting the bot. 

1. Implement an issuer or verifier of your own using our go/js frameworks (TODO:
   link to samples)
