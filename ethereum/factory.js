import web3 from './web3'
import CrowdFundingFactory from './build/CrowdFundingFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CrowdFundingFactory.interface),
    '0x715563c2a439579f80Bf6e235062221C7cA8a32a'
);

export default instance;