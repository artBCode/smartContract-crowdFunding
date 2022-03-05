import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Button, Table, Header } from 'semantic-ui-react'
import web3 from '../../../ethereum/web3'
import { Router } from '../../../routes'
import getCampaign from '../../../ethereum/campaign'
import { Link } from '../../../routes';
import RequestRow from '../../../components/RequestRow'

class RequestIndex extends Component {
    //invoked on both server and browser
    static async getInitialProps(props) {
        // console.log("getInitialProps");
        const contractAddress = props.query.address;
        const campaign = getCampaign(contractAddress);
        const requestsCount = await campaign.methods.getRequestsCount().call();
        // const request = await campaign.methods.requests(0).call();
        console.log(requestsCount);

        const requests = await Promise.all(
            Array(requestsCount)
                .fill()
                .map((element, index) => {
                    return campaign.methods.requests(index).call();
                })
        );
        const approversCount = await campaign.methods.approversCount().call();

        return {
            contractAddress,
            requestsCount,
            requests,
            approversCount
        };
    }

    renderRows() {
        console.log(this.props.requests);
        return this.props.requests.map((request, index) => {
            return (
            <RequestRow
                key={index}
                id={index}
                request={request}
                contractAddress={this.props.contractAddress}
                approversCount={this.props.approversCount}
            />);
        });
    }

    renderTable() {
        const { Header, Row, HeaderCell, Body } = Table
        return (
            <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Description</HeaderCell>
                        <HeaderCell>Amount</HeaderCell>
                        <HeaderCell>Recipient</HeaderCell>
                        <HeaderCell>ApprovalCount</HeaderCell>
                        <HeaderCell>Approve</HeaderCell>
                        <HeaderCell>Finalize</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {this.renderRows()}
                </Body>
            </Table>
        );
    }

    render() {
        return (
            <Layout>
                <h3>{`Requests in the ${this.props.contractAddress} campaign`}</h3>

                <Link route={`/campaigns/${this.props.contractAddress}/requests/new`}>
                    <a>
                        <Button primary>Add request</Button>
                    </a>
                </Link>

                <br />
                {this.renderTable()}

            </Layout>
        );
    }
}


export default RequestIndex;