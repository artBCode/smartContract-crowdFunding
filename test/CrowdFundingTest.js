const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledCampaign = require('../ethereum/build/CrowdFundingCampaign.json');
const compiledFactory = require('../ethereum/build/CrowdFundingFactory.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });
    await factory.methods.createCrowdFundingCampaign('100')
        .send({ from: accounts[0], gas: '1000000' });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress);
});

async function getBalance(account) {
    let balance = await web3.eth.getBalance(account);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    return balance;
}

describe('Crowd funding campaigns', async () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('manager is properly defined', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute and become request approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '1000'
        });
        const isApprover = await campaign.methods.approvers(accounts[1]).call();
        assert(isApprover);
    });

    it('requires a min contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '10'
            });
            assert(false);
        } catch (err) {
            return;
        }
        // it should never reach this point without throwing an error
        assert(false);
    });

    it('allows the manager to make a payment request', async () => {
        await campaign.methods.createRequest(
            'a request test',
            50,
            accounts[2]
        ).send({
            from: accounts[0], // manger's account
            gas: '1000000'
        });

        // getting the first(and the only one) request
        const request = await campaign.methods.requests(0).call();
        assert.equal('a request test', request.description);
        assert.equal('50', request.value);
        assert.equal(accounts[2], request.recipient);
    });

    it('a non manager cannot create a request', async () => {
        try {
            await campaign.methods.createRequest(
                'a request test',
                50,
                // after aproval and finalization the funds should be transfered to this one
                accounts[2]
            ).send({
                from: accounts[1], // non manager
                gas: '1000000'
            });
            assert(false);
        } catch (err) {
            return;
        }
        // it should never reach this point without throwing an error
        assert(false);
    });

    it('end to end: contribute, request, accept, finilize', async () => {

        // someone contributes
        await campaign.methods.contribute().send({
            from: accounts[1], // another account
            gas: '1000000',
            value: web3.utils.toWei('10', 'ether')
        });

        // the manager requests to send 5 ether to account[2]
        await campaign.methods.createRequest(
            'a request test',
            web3.utils.toWei('5', 'ether'),
            accounts[2] // the funds should be transfered to this one
        ).send({
            from: accounts[0], // manger's account
            gas: '1000000'
        });

        // now the request is approved by the only 1 contributor
        await campaign.methods.approveRequest(0).send({
            from: accounts[1], // another account
            gas: '1000000'
        });

        const balanceBefore = await getBalance(accounts[2]);

        // finally the manager triggers the transfer
        // the account 2 should receive 5 ether as per request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0], // another account
            gas: '1000000'
        });

        const balanceAfter = await getBalance(accounts[2]);

        assert.equal(5, balanceAfter - balanceBefore);

    });

    const checkSummaryAndRequestsCount = async (expMinContr, expBalance, expNoReq, expNoApprovers, expManager) => {
        const summary = await campaign.methods.getSummary().call();
        assert.equal(expMinContr, summary[0]);
        assert.equal(expBalance, summary[1]);
        assert.equal(expNoReq, summary[2]);
        assert.equal(expNoApprovers, summary[3]);
        assert.equal(expManager, summary[4]);

        const curNoRequests = await campaign.methods.getRequestsCount().call();
        assert.equal(expNoReq, curNoRequests);
    }

    it('getSummary & getRequestsCount test', async () => {
        await checkSummaryAndRequestsCount('100', 0, 0, 0, accounts[0]);

        // someone contributes
        await campaign.methods.contribute().send({
            from: accounts[1], // another account
            gas: '1000000',
            value: web3.utils.toWei('10', 'ether')
        });

        // new approver and 10 ether balance on the contract
        await checkSummaryAndRequestsCount('100', web3.utils.toWei('10', 'ether'), 0, 1, accounts[0]);
        
        // the manager requests to send 5 ether to account[2]
        await campaign.methods.createRequest(
            'a request test',
            web3.utils.toWei('5', 'ether'),
            accounts[2] // the funds should be transfered to this one
        ).send({
            from: accounts[0], // manger's account
            gas: '1000000'
        });

        // new request
        await checkSummaryAndRequestsCount('100', web3.utils.toWei('10', 'ether'), 1, 1, accounts[0]);

        // now the request is approved by the only 1 contributor
        await campaign.methods.approveRequest(0).send({
            from: accounts[1], // another account
            gas: '1000000'
        });

        const balanceBefore = await getBalance(accounts[2]);

        // finally the manager triggers the transfer
        // the account 2 should receive 5 ether as per request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0], // another account
            gas: '1000000'
        });

        const balanceAfter = await getBalance(accounts[2]);

        assert.equal(5, balanceAfter - balanceBefore);

    });
});