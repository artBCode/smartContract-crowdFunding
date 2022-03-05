import React, { Component } from 'react'
import Layout from '../../components/Layout';
import { Card, Button, Grid } from 'semantic-ui-react'
import getCampaign from '../../ethereum/campaign'
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';
class CampaignShow extends Component {
    // invoked on both server and browser
    static async getInitialProps(props) {
        const contractAddress = props.query.address
        const campaign = getCampaign(contractAddress);
        const campaignSummary = await campaign.methods.getSummary().call();
        console.log(campaignSummary);
        return {
            minimumContribution: campaignSummary[0],
            balance: campaignSummary[1],
            numberRequests: campaignSummary[2],
            numberContributors: campaignSummary[3],
            manager: campaignSummary[4],
            contractAddress: contractAddress
        };
    }

    renderCards() {
        const items = [
            {
                header: this.props.manager,
                meta: 'Address of the manager',
                description: 'The account of the manager who created this campaign and can create spending requests',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.minimumContribution,
                meta: 'Minimum contribution(Wei)',
                description: 'Each contributor in this campaign should send at leat this amount',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(this.props.balance, 'ether'),
                meta: 'Available to spend balance(Ether)',
                description: 'The sum of all the contributions, which then can be used by the manager to create spending requests',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.numberRequests,
                meta: 'Number of requests',
                description: 'Number of spending requests. Both open and closed',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: this.props.numberContributors,
                meta: 'Number of contributors/approvers',
                description: 'All these people have the right to approve the spending requests',
                style: { overflowWrap: 'break-word' }
            }
        ]
        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>{`Details of the ${this.props.contractAddress} campaign`}</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}

                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm contractAddress={this.props.contractAddress} />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.contractAddress}/requests`}>
                                <Button primary>View Requests</Button>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>


            </Layout>
        );
    }
}

export default CampaignShow;