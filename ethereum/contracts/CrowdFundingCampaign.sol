pragma solidity ^0.4.17;

// this contract will deploy multiple instances of CrowdFundingCampaign contract
contract CrowdFundingFactory {
    address[] public deployedCrowdFunds;

    function createCrowdFundingCampaign(uint256 minimumContribution) {
        // the addres invoking this method will become the manager of the new instance of the contract
        address newCampaign = new CrowdFundingCampaign(
            minimumContribution,
            msg.sender
        );
        deployedCrowdFunds.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCrowdFunds;
    }
}

// this contract can be use to crowdfound a project.
// Each contributor (which has sent more than a specified ammount) will
// have the right to vote on how the money will be spent. Namely, the contract manager
// issues requests to transfer money from the smart contract to an external account and
// these transfers will only be executed if more than half of the contributors approve it.
contract CrowdFundingCampaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete; // true only the transfer has been completed
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    address public manager;

    // required to vote on how the money is spent
    uint256 public minimumContribution; // in Wei

    // list of people who contributed at least minimumContribution
    mapping(address => bool) public approvers;
    uint256 public approversCount; // remember, the mapping in solidity is very limited compared to other program. lang

    Request[] public requests;

    modifier onlyManager() {
        require(manager == msg.sender);
        // the compiler ensures the instructions of the method having this modifier will be executed just here:
        _;
    }

    function CrowdFundingCampaign(
        uint256 _minimumContribution,
        address contractCreator
    ) public {
        //msg.data/gas/sender/value is provided in each method invocation
        manager = contractCreator;
        minimumContribution = _minimumContribution;
        approversCount = 0;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution);
        // if the same address contributes more than once it will only be counted once
        if (!approvers[msg.sender]) {
            approversCount++;
        }
        approvers[msg.sender] = true;
    }

    function createRequest(
        string description,
        uint256 value,
        address recipient
    ) public onlyManager {
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        requests.push(newRequest);
    }

    function approveRequest(uint256 requestIndex) public {
        Request storage request = requests[requestIndex];
        require(approvers[msg.sender]); // only people who contribute are allowed to vote/approve
        require(!request.approvals[msg.sender]); // ensure he/she votes just one time / request

        request.approvals[msg.sender] = true; // after this the address cannot vote again
        request.approvalCount++; // the manager gets closer to his goal
    }

    function finalizeRequest(uint256 requestIndex) public onlyManager {
        Request storage request = requests[requestIndex];
        // at least half of the contributors should approve the spending request
        require(request.approvalCount > approversCount / 2);
        // the same request should not be used to send the funds twice
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint256) {
        return requests.length;
    }
}
