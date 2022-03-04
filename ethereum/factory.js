import web3 from './web3'
import CrowdFundingFactory from './build/CrowdFundingFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CrowdFundingFactory.interface),
    '0x8a70b5E46A26BCeb990bE9788c7C4305e8FC1FE8'
);

export default instance;