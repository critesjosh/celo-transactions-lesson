/*

In this code walkthrough we are going to go over the
basics of Celo transactions and what you need to know
as a Celo developer.

In this walkthough we will go over:

- Structure of a Celo transaction
- How & why it is different than Ethereum
- Sending CELO transactions with web3.js, ethers.js
    and ContractKit
- Sending cUSD transactions with ContractKit, web3.js,
    and ethers.js

*/

/*
================================================================================
*/

/*

    Section 1.

    Setup

*/

const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
const celo_ethers = require('@celo-tools/celo-ethers-wrapper')
require('dotenv').config({path: '.env'})
const { ethers } = require('ethers')

const web3 = new Web3(`https://celo-alfajores--rpc.datahub.figment.io/apikey/${process.env.FIGMENT_API_KEY}/`)

//const web3 = new Web3('https://forno.celo.org')

const kit = ContractKit.newKitFromWeb3(web3)

// Get an account object to use in the walkthrough
// Run `node createAccount.js` in the project root to print new account info
// Copy the printed private key into the PRIVATE_KEY variable in a .env file
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY)

/*
================================================================================
*/

/*

    Section 2.

    Signing an example Ethereum transaction

    Resources:
    - https://web3js.readthedocs.io/en/latest/

*/

let EthTx = {
    to: "0x9a8e698171364db8e0F5Fe30f658F233F1347F6a",
    gas: 200000,
    from: account.address,

    // the follwoing fields are optional
    nonce: 1,
    chainId: "44787",             // Alfajores testnet
    data: "0xabc1",               // data to send for smart contract execution
    value: 10,
    gasPrice: "5000000000",       // 0.5 Gwei
}

async function signEthTx(){
    let signedEthTx = await web3.eth.accounts.signTransaction(EthTx, account.privateKey)
    console.log('Signed ETH Tx: %o', signedEthTx)
}
// signEthTx()

// This example is for illustrative purposes only
// Below, we will see how the Celo transaction object is similar to Ethereum's

/*
================================================================================
*/

/*

    Section 3.

    Signing an example Celo Transaction

*/

let CeloTx = {
    to: "0x9a8e698171364db8e0F5Fe30f658F233F1347F6a",
    value: 10,
    gas: 200000,
    nonce: 1,
    chainId: "44787",             // Celo Alfajores testnet chainId
    data: "0xabc1",               // data to send for smart contract execution
    gasPrice: "5000000000",       // 0.5 Gwei
    gatewayFee: 1,       
    gatewayFeeRecipient: "0x0000000000000000000000000000000000000000",
    feeCurrency: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",  // cUSD Alfajores contract address
    from: account.address
}

// To use ContractKit to sign the transaction, you need to add your private key to the kit
kit.connection.addAccount(account.privateKey)
kit.defaultAccount = account.address

async function signCeloTx(){
    // To sign the transaction without sending, get the Wallet from the kit
    let celoWallet = await kit.getWallet()
    let signedCeloTx = await celoWallet.signTransaction(CeloTx)
    
    console.log('Signed Celo Tx: %o', signedCeloTx)
}

// signCeloTx()

/*

    This section showed how to sign Celo transactions without sending them to the
    network.

    You saw how a Celo transaction object has 3 additional fields compared to an
    Ethereum transaction object.
        - feeCurrency
        - gatewayFee
        - gatewayFeeRecipient

    These fields allow for some of the additional features of Celo namely, allowing
    transaction fees to be paid in multiple currencies and full node incentives to
    promote decentralization and provide reliable access to ultralight mobile clients.
*/

/*
================================================================================
*/

/*

    Section 4.

    Sending a CELO transaction

    Requirements:

    - Before you can send a transaction, you will need to fund your account 
    with CELO and/or cUSD to pay for transaction fees.

    https://celo.org/developers/faucet

*/

async function sendCELOTx(){

    // Connect to the network and get the current tx count
    let nonce = await kit.web3.eth.getTransactionCount(kit.defaultAccount)

    // Send 0.1 CELO
    let amount = kit.web3.utils.toWei("0.1", "ether")
    
    let CeloTx = {
        to: "0x9a8e698171364db8e0F5Fe30f658F233F1347F6a", // omit recipient for a contract deployment
        from: account.address,
        gas: 200000,               // surplus gas will be returned to the sender
        nonce: nonce,
        chainId: "44787",          // Alfajores chainId
        data: "0x0",               // data to send for smart contract execution
        value: amount,
        
        // The following fields can be omitted and will be filled by ContractKit, if required 

        // gasPrice: "",    
        // gatewayFee: 0,       
        // gatewayFeeRecipient: "",
        // feeCurrency: ""
    }

    let tx = await kit.sendTransaction(CeloTx)
    let receipt = await tx.waitReceipt()

    console.log(`CELO tx: https://alfajores-blockscout.celo-testnet.org/tx/${receipt.transactionHash}/token-transfers `)
}

// sendCELOTx()

/*
    This example showed how to generate transactions to send CELO "natively",
    similar to how you would send Ether on Ethereum. 

    In the upcoming sections, you will see how ContractKit makes it easier to 
    create and send transactions and interact with common contracts. 
*/

/*
================================================================================
*/

/*

    Section 5.

    Read Balances using ContractKit

*/

let anAddress = '0xD86518b29BB52a5DAC5991eACf09481CE4B0710d'

async function getBalances(){

    // Get the token contracts
    let goldtoken = await kit.contracts.getGoldToken()
    let stabletoken = await kit.contracts.getStableToken()

    // Get token balances of anAddress
    let celoBalance = await goldtoken.balanceOf(anAddress)
    let cUSDBalance = await stabletoken.balanceOf(anAddress)

    // Print balances
    console.log(`${anAddress} CELO balance: ${kit.web3.utils.fromWei(celoBalance.toString(), "ether")}`)
    console.log(`${anAddress} cUSD balance: ${kit.web3.utils.fromWei(cUSDBalance.toString(), "ether")}`)
}
// getBalances()


/*
================================================================================
*/

/*

    Section 6.

    Send Transactions using ContractKit

*/

async function sendCELOandCUSD(){
    // Specify an amount to send
    let amount = kit.web3.utils.toWei("0.1", "ether")

    // Get the token contract wrappers    
    let goldtoken = await kit.contracts.getGoldToken()
    let stabletoken = await kit.contracts.getStableToken()

    // Transfer CELO and cUSD from your account to anAddress
    // Specify cUSD as the feeCurrency when sending cUSD
    let celotx = await goldtoken.transfer(anAddress, amount).send({from: account.address})
    let cUSDtx = await stabletoken.transfer(anAddress, amount).send({from: account.address, feeCurrency: stabletoken.address})

    // Wait for the transactions to be processed
    let celoReceipt = await celotx.waitReceipt()
    let cUSDReceipt = await cUSDtx.waitReceipt()

    // 17. Print receipts
    console.log(`CELO Transaction: https://alfajores-blockscout.celo-testnet.org/tx/${celoReceipt.transactionHash}/`)
    console.log(`cUSD Transaction: https://alfajores-blockscout.celo-testnet.org/tx/${cUSDReceipt.transactionHash}/`)

    // 18. Get your new balances
    let celoBalance = await goldtoken.balanceOf(account.address)
    let cUSDBalance = await stabletoken.balanceOf(account.address)

    // 19. Print new balance
    console.log(`Your new account CELO balance: ${kit.web3.utils.fromWei(celoBalance.toString(), "ether")}`)
    console.log(`Your new account cUSD balance: ${kit.web3.utils.fromWei(cUSDBalance.toString(), "ether")}`)
}
// sendCELOandCUSD()

/*
================================================================================
*/

/*

    Section 7.

    Using Ethers.js with Celo

    Resources:
    - https://docs.ethers.io/v5/
    - https://github.com/celo-tools/celo-ethers-wrapper 

*/

async function sendCELOWithEthers(){
    const provider = new celo_ethers.CeloProvider(`https://celo-alfajores--rpc.datahub.figment.io/apikey/${process.env.FIGMENT_API_KEY}/`)
    await provider.ready
    const wallet = new celo_ethers.CeloWallet(account.privateKey, provider)

    const txResponse = await wallet.sendTransaction({
        to: anAddress,
        value: ethers.utils.parseEther("0.1")
    })

    const txReceipt = await txResponse.wait()
    console.log(`celo-ethers Transaction: https://alfajores-blockscout.celo-testnet.org/tx/${txReceipt.transactionHash}/`)
}
//sendCELOWithEthers()
