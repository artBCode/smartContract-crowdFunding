import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react'
import getCampaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';
import { Router } from '../routes'



class RequestRow extends Component {

    onApprove = async () => {
        const accounts = await web3.eth.getAccounts();
        const campaign = getCampaign(this.props.contractAddress);
        await campaign.methods.approveRequest(this.props.id).send({
            from: accounts[0]
        });
    };

    onFinalize = async () => {
        const accounts = await web3.eth.getAccounts();
        const campaign = getCampaign(this.props.contractAddress);
        await campaign.methods.finalizeRequest(this.props.id).send({
            from: accounts[0]
        });
    };


    render() {
        const { Row, Cell } = Table;
        const { request, id, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{this.props.approversCount}</Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color='green' basic onClick={this.onApprove}>Approve</Button>
                    )}
                </Cell>
                <Cell>
                    {request.complete ? null : (
                        <Button color='red' basic onClick={this.onFinalize}>Finalize</Button>
                    )}
                </Cell>
            </Row>
        );
    }
}
export default RequestRow;