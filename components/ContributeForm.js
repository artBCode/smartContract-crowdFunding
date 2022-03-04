import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react'
import getCampaign from '../ethereum/campaign'
import web3 from '../ethereum/web3';
import { Router } from '../routes'


class ContributeForm extends Component {
    state = {
        contributionAmount: '', //ETHER
        errorMessage: '',
        contributionInProgress: false
    };

    onFormSubmit = async (event) => {
        // By default the form is submitted to the back-end server
        // Here we avoid it.
        event.preventDefault();

        this.setState({
            // We assume all good. We erase the previous error if any
            errorMessage: '',
            // show the spinner on the create button
            contributionInProgress: true
        }
        );

        try {
            const accounts = await web3.eth.getAccounts();
            const campaign = getCampaign(this.props.contractAddress);
            await campaign.methods
                .contribute()
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(this.state.contributionAmount, 'ether')
                });

            // If it reaches this point it means it has been sucessfully
            // Hence, we redirect the user to the home page
            Router.replaceRoute(`/campaigns/${this.props.contractAddress}`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ contributionInProgress: false });

    }

    render() {
        return (
            <Form onSubmit={this.onFormSubmit} error={this.state.errorMessage !== ''}>
                <Form.Field>
                    <label>Amount to contribute</label>
                    <Input
                        label="Ether"
                        labelPosition='right'
                        value={this.state.contributionAmount}
                        onChange={event =>
                            this.setState({ contributionAmount: event.target.value })
                        }
                    />
                </Form.Field>

                <Message
                    error
                    header='Oops!'
                    content={this.state.errorMessage}></Message>

                <Button primary loading={this.state.contributionInProgress}>Create!</Button>
            </Form>
        );
    }
}
export default ContributeForm;