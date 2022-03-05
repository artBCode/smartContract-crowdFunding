import React, { Component } from 'react'
import Layout from '../../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react'
import factory from '../../../ethereum/factory'
import web3 from '../../../ethereum/web3'
import { Router } from '../../../routes'
import getCampaign from '../../../ethereum/campaign'


class RequestNew extends Component {
    // invoked on both server and browser
    static async getInitialProps(props) {
        const contractAddress = props.query.address;
        const campaign = getCampaign(contractAddress);
        
        return {
            contractAddress: contractAddress,
            campaign: campaign
        };
    }
    state = {
        spendingAmountEth: '',
        recipient: '',
        description: '',
        errorMessage: '',
        newRequestInProgress: false
    };

    onFormSubmit = async (event) => {
        // By default the form is submitted to the back-end server
        // Here we avoid it.
        event.preventDefault();

        this.setState({
            // We assume all good. We erase the previous error if any
            errorMessage: '',
            // show the spinner on the new button
            newRequestInProgress: true
        }
        );

        try {
            const accounts = await web3.eth.getAccounts();
            console.log(this.props.campaign.methods);
            await this.props.campaign.methods
                .createRequest(this.state.description,
                    web3.utils.toWei(this.state.spendingAmountEth, 'ether'),
                    this.state.recipient, 
                )
                .send({
                    from: accounts[0]
                });

            // If it reaches this point it means it has been sucessfully
            // Hence, we redirect the user to the requests page
            Router.pushRoute(`/campaigns/${this.props.contractAddress}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ newRequestInProgress: false });

    };

    render() {
        return (
            <Layout>
                <h3>Create new spending request</h3>
                <Form onSubmit={this.onFormSubmit} error={this.state.errorMessage !== ''}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event =>
                                this.setState({ description: event.target.value })
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Amount Eth</label>
                        <Input
                            value={this.state.spendingAmountEth}
                            onChange={event =>
                                this.setState({ spendingAmountEth: event.target.value })
                            }
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event =>
                                this.setState({ recipient: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Message
                        error
                        header='Oops!'
                        content={this.state.errorMessage}></Message>

                    <Button primary loading={this.state.newRequestInProgress}>Create!</Button>
                </Form >
            </Layout >
        );
    }
}

export default RequestNew;