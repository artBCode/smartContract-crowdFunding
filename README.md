# SmartContract: Crowd Funding Campaign

In this project Ethereum smart contracts are used to crowd fund multiple campaigns.

In each campaign, each contributor (who sent some min ammount of ethereum) will have the right to vote on how the campaign funds will be spent. Namely, the manager (creator of a campaign) issues requests to transfer money from the smart contract to an external account and these transfers will only be executed by the smart contract if more than half of the contributors approve them.

With the provided scripts the contract is deployed on the https://rinkeby.etherscan.io/ Ethereum network but the scipts can be easily adapted to deploy the contract on any other network (ERC-20 included).

## The main languages, libraries and frameworks involved in this project

* solidity
* ganache
* truffle
* mocha
* react.js
* next.js

## How to install the required dependecies

It might be a good idea to do this every time you change the branch. 
```
npm install
```

## Compile the smart contract 

```
node compile.js
```

## Run the tests
```
npm run test
```

## Deploy the contract on the Rinkeby network #

```
export TEST_MM_MNEMONICS="<your 12-word Secret Recovery Phrase>"
export TEST_INFURA_RINKEBY_ENDPOINT="<your API endpoint>"
node deploy.js
```

At the end of the deployment the address of the deployed contract will be printed on the terminal and also stored in `ethereum\deployedContractAddress.txt` file.

## Run the web GUI
Before running the GUI you might want to ensure the `ethereum/factory.js` contains the address of the smart contract (factory) you want the GUI to interact with. The default value is an address of a test contract.

In case you want to bind the GUI to **your** lastest deployed contract, its address can be found in `ethereum\deployedContractAddress.txt`.

```
npm run dev
```

## Access the web GUI
http://localhost:3000/





-----------------------------------------------------------------

##### Credit to [Stephen Grider](https://github.com/StephenGrider) 