import React, { Component } from 'react'
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react'
import factory from '../../ethereum/factory'
import web3 from '../../ethereum/web3'
import {Router} from '../../routes'

class CampaignNew extends Component {
    state = {
        minimumContribution: '',
        errorMessage: '',
        createCampaignInProgress: false
    };

    onFormSubmit = async (event) => {
        // By default the form is submitted to the back-end server
        // Here we avoid it.
        event.preventDefault();

        this.setState({
            // We assume all good. We erase the previous error if any
            errorMessage: '',
            // show the spinner on the create button
            createCampaignInProgress: true}
        );

        try{
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .createCrowdFundingCampaign(this.state.minimumContribution)
                .send({
                    from: accounts[0]
                });
            
            // If it reaches this point it means it has been sucessfully
            // Hence, we redirect the user to the home page
            Router.pushRoute('/');
        } catch (err){
            this.setState({errorMessage: err.message});
        }

        this.setState({createCampaignInProgress: false});  

    };

    render() {
        return (
            <Layout>
                <h3>Create Crowdfunding Campaign</h3>
                <Form onSubmit={this.onFormSubmit} error={this.state.errorMessage!==''}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label="Wei"
                            labelPosition='right'
                            value={this.state.minimumContribution}
                            onChange={event =>
                                this.setState({ minimumContribution: event.target.value })
                            }
                        />
                    </Form.Field>

                    <Message 
                        error 
                        header='Oops!' 
                        content={this.state.errorMessage}></Message>

                    <Button primary loading={this.state.createCampaignInProgress}>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;