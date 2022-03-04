const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CrowdFundingFactory.json');
const path = require('path');
const fs = require('fs-extra');

const MM_MNEMONICS = process.env.TEST_MM_MNEMONICS
const INFURA_ENDPOINT = process.env.TEST_INFURA_RINKEBY_ENDPOINT

const provider = new HDWalletProvider(
    MM_MNEMONICS,
    INFURA_ENDPOINT
);
const web3 = new Web3(provider);
const mainDir = path.resolve(__dirname);


const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ gas: '1000000', from: accounts[0] });

    console.log('Contract deployed to ', result.options.address);
    
    fs.writeFileSync(
        path.resolve(mainDir, 'deployedContractAddress.txt'),
        result.options.address
    );
    provider.engine.stop();

};
deploy();
