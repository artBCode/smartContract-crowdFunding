import web3 from './web3'
import CrowdFundingFactory from './build/CrowdFundingFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CrowdFundingFactory.interface),
    // REPLACE with the content of deployedContractAddress.txt
    // which contains the latest deployed factory contract
    '0xB9195436C751843D43b24D6D90f939C0C01cd6B0'
);

export default instance;