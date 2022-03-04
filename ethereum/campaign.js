import web3 from './web3'
import CrowdFundingCampaign from './build/CrowdFundingCampaign.json'

export default address => {
    return new web3.eth.Contract(
        JSON.parse(CrowdFundingCampaign.interface),
        address
    );
};