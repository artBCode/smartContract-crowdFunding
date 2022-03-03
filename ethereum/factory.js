import web3 from './web3'
import CrowdFundingFactory from './build/CrowdFundingFactory.json'

const instance = new web3.eth.Contract(
    JSON.parse(CrowdFundingFactory.interface),
    '0xDC47D1346b72B63D95bBDf751831551dFbB521eA'
);

export default instance;