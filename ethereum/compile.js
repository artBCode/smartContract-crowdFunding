const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const capaignPath = path.resolve(__dirname, 'contracts', 'CrowdFundingCampaign.sol');
const source = fs.readFileSync(capaignPath, 'utf8');

const output = solc.compile(source, 1).contracts

// creating the build folder
fs.ensureDirSync(buildPath) 

//writing the contracts to disk

for(let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}

