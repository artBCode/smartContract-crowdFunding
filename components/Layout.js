import React from 'react'
import Header from './header';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


export default (props) => {
    return (
    <Container>
        <Header />
        {props.children}
    </Container >);
}