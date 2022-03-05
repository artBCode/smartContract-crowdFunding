import React, { Component } from 'react';
import { Table } from 'semantic-ui-react'
import getCampaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';
import { Router } from '../routes'


class RequestRow extends Component {
    // state = {
    //     contributionAmount: '', //ETHER
    //     errorMessage: '',
    //     finalizeInProgress: false
    // };


    render() {
        const { Row, Cell } = Table;
        const {request, id, approversCount} = this.props;

        return (
            <Row>
                <Cell>{id}</Cell>
                <Cell>{request.description}</Cell>
                <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
                <Cell>{request.recipient}</Cell>
                <Cell>{request.approvalCount}/{this.props.approversCount}</Cell>
                <Cell></Cell>
                <Cell></Cell>
                <Cell></Cell>
            </Row>
        );
    }
}
export default RequestRow;