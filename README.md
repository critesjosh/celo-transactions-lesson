# Celo Transactions

A repo to help better understand Celo transaction structure and tools to send transactions

## Requirements

- familiarity with Javascript and basic web development 
- have the `yarn`

## Get started 

1. Run `yarn install` in the project root.
2. Run `node createAccount.js`. This will print new Celo account details. Copy the private key for your new account into the `PRIVATE_KEY` variable in `.env`.
3. Fund the account address on the Alfajores testnet here: https://celo.org/developers/faucet
4. Create an account on Figment Data Hub [here](https://figment.io/datahub/celo/) and get your API key and add it to the `FIGMENT_API_KEY` in `.env`. This will allow you to connect to the Celo networks.
5. Go through `lesson.js`, following the provided details and uncommenting the function calls to run the associated code.

## Basic Celo browser extension (Metamask fork) example

### Requirements

- [Celo extension wallet](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh)

`cd` into the `webpage` directory. 
- Run `yarn install` to install the dependencies. The simple webpage uses [broswerify](http://browserify.org/) to bundle contractkit into a javascript file usable by the browser. Run `browserify index.js -o bundle.js` after editing `index.js` to see the updates in the page.
- Run `yarn dev` to start the [lihttps://www.npmjs.com/package/lite-serverserver](url) to serve the page at localhost:3000
