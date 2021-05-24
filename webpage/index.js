let Web3 = require("web3")
let ContractKit = require("@celo/contractkit")
let BigNumber = require("bignumber.js")
let erc20Abi = require("./erc20Abi.json")

const ERC20_DECIMALS = 18
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

let kit
let cUSDcontract

let anAddress = '0xD86518b29BB52a5DAC5991eACf09481CE4B0710d'
let amount = "10000000000000000"

const connectCeloWallet = async function () {
  if (window.celo) {
    try {
      await window.celo.enable()

      const web3 = new Web3(window.celo)
      kit = ContractKit.newKitFromWeb3(web3)

      const accounts = await kit.web3.eth.getAccounts()
      kit.defaultAccount = accounts[0]

      cUSDcontract = new kit.web3.eth.Contract(erc20Abi, cUSDContractAddress)
      
      getBalance()
    } catch (error) {
      console.log(`⚠️ ${error}.`)
    }
  } else {
    console.log("⚠️ Please install the CeloExtensionWallet.")
  }
}

async function send() {
  const result = await cUSDcontract.methods
    .transfer(anAddress, amount)
    .send({ from: kit.defaultAccount })
  getBalance()
  showTxHash(result.transactionHash) 
  return result
}

const getBalance = async function () {
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount)
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
  document.querySelector("#balance").textContent = cUSDBalance
}

const showTxHash = async function(transactionHash){
  let link = `https://alfajores-blockscout.celo-testnet.org/tx/${transactionHash}`
  document.querySelector("#txHash").textContent = link
  document.getElementById("txHash").href = link
}

document.querySelector("#login").addEventListener("click", async (e) => {
  connectCeloWallet()
})  

document.querySelector("#send").addEventListener("click", async (e) => {
    send()
}) 
