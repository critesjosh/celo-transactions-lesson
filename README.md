# Celo Transactions

A repo to help better understand Celo transaction structure and tools to send transactions



To get started 

1. Run `npm install` in the project root.
2. Run `node createAccount.js`. This will print new Celo account details. Copy the private key for your new account into the `PRIVATE_KEY` variable in `.env`.
3. Fund the account address on the Alfajores testnet here: https://celo.org/developers/faucet
4. Create an account on Figment Data Hub [here](https://figment.io/datahub/celo/) and get your API key and add it to the `FIGMENT_API_KEY` in `.env`. This will allow you to connect to the Celo networks.
5. Go through `lesson.js`, following the provided details and uncommenting the function calls to run the associated code.
