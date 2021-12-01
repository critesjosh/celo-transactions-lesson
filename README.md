# Celo Transactions

A repo to help better understand Celo transaction structure and tools to send transactions

## Workshop

Recording:

[![](http://img.youtube.com/vi/rwq14V9e2hU/0.jpg)](http://www.youtube.com/watch?v=rwq14V9e2hU)

## Requirements

- familiarity with Javascript and basic web development
- have `yarn` installed

## Get started

1. Run `yarn install` in the project root.
2. Run `node createAccount.js`. This will print new Celo account details. Copy the private key for your new account into the `PRIVATE_KEY` variable in `.env`.
3. Fund the account address on the Alfajores testnet here: https://celo.org/developers/faucet
4. Go through `lesson.js`, following the provided details and uncommenting the function calls to run the associated code.

## Basic Celo browser extension (Metamask fork) example

### Requirements

- [Metamask](https://metamask.io)
- `cd` into the `webpage` directory.
- Run `yarn install` to install the dependencies. The simple webpage uses [broswerify](http://browserify.org/) to bundle contractkit into a javascript file usable by the browser. It also uses [watchify](https://www.npmjs.com/package/watchify) to watch `index.js` and `index.html` for changes, and will automatically re-bundle everything for you when a change is detected.
- Run `yarn dev` to start the [lite server](https://www.npmjs.com/package/lite-server) and watchify to serve the page at localhost:3000
