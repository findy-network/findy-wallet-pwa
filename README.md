# findy-wallet-pwa

Web based cloud wallet for Findy agents. Uses WebAuthn / Fido2 for authentication.

## Running in development mode

1. Install and run Findy Vault: https://github.com/findy-network/findy-agent-vault/
2. Install Findy Wallet PWA
   ```
   npm install
   ```
3. Run application
   ```
   npm start
   ```

- This will launch the service at: http://localhost:3000
- You can access the service with a web browser when the Vault is running in background

## Release new version

1. Checkout latest from dev branch.
1. Run
   ```
   ./tools/release.sh
   ```
